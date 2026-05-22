#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCAL_ENV_FILE="${ROOT_DIR}/.env.local"
DB_CONTAINER_NAME="${ATLAS_LOCAL_DB_CONTAINER:-atlas-local-db}"
DB_PORT="${ATLAS_LOCAL_DB_PORT:-55432}"
APP_PORT="${ATLAS_LOCAL_APP_PORT:-3210}"
DB_NAME="${ATLAS_LOCAL_DB_NAME:-atlas}"
DB_USER="${ATLAS_LOCAL_DB_USER:-atlas}"
DB_PASSWORD="${ATLAS_LOCAL_DB_PASSWORD:-atlas}"
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@127.0.0.1:${DB_PORT}/${DB_NAME}"
RESET_DB="${ATLAS_BOOTSTRAP_RESET_DB:-true}"

echo "==> Preparing local ATLAS bootstrap"
echo "    DB container: ${DB_CONTAINER_NAME}"
echo "    DB port:      ${DB_PORT}"
echo "    App port:     ${APP_PORT}"

if ! command -v docker >/dev/null 2>&1; then
  DOCKER_EXE="/mnt/c/Program Files/Docker/Docker/resources/bin/docker.exe"
  if [ -x "${DOCKER_EXE}" ]; then
    DOCKER_BIN="${DOCKER_EXE}"
  else
    echo "Docker is required for local bootstrap." >&2
    exit 1
  fi
else
  DOCKER_BIN="docker"
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required for local bootstrap." >&2
  exit 1
fi

if "${DOCKER_BIN}" ps -a --format '{{.Names}}' | grep -qx "${DB_CONTAINER_NAME}"; then
  echo "==> Reusing existing container ${DB_CONTAINER_NAME}"
  "${DOCKER_BIN}" start "${DB_CONTAINER_NAME}" >/dev/null 2>&1 || true
else
  echo "==> Starting PostgreSQL container ${DB_CONTAINER_NAME}"
  "${DOCKER_BIN}" run -d \
    --name "${DB_CONTAINER_NAME}" \
    -e POSTGRES_DB="${DB_NAME}" \
    -e POSTGRES_USER="${DB_USER}" \
    -e POSTGRES_PASSWORD="${DB_PASSWORD}" \
    -p "${DB_PORT}:5432" \
    postgres:16 >/dev/null
fi

echo "==> Waiting for PostgreSQL to become ready"
until "${DOCKER_BIN}" exec "${DB_CONTAINER_NAME}" pg_isready -U "${DB_USER}" -d "${DB_NAME}" >/dev/null 2>&1; do
  sleep 1
done

if [ "${RESET_DB}" != "false" ]; then
  echo "==> Resetting database schema"
  "${DOCKER_BIN}" exec -e PGPASSWORD="${DB_PASSWORD}" "${DB_CONTAINER_NAME}" \
    psql -U "${DB_USER}" -d "${DB_NAME}" -c 'DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;'
fi

cat > "${LOCAL_ENV_FILE}" <<EOF
DATABASE_URL="${DATABASE_URL}"
ATLAS_HOST_PORT="${APP_PORT}"
ATLAS_DB_HOST_PORT="${DB_PORT}"
NEXT_PUBLIC_APP_URL="http://127.0.0.1:${APP_PORT}"
NODE_ENV="development"
APP_MODE="staging"
ATLAS_AUTO_SEED="false"
NEXTAUTH_SECRET="atlas-local-dev-secret-please-change-1234567890"
NEXTAUTH_URL="http://127.0.0.1:${APP_PORT}"
EOF

echo "==> Wrote ${LOCAL_ENV_FILE}"
echo "==> Installing dependencies"
(cd "${ROOT_DIR}" && npm ci --legacy-peer-deps)

echo "==> Generating Prisma client"
(cd "${ROOT_DIR}" && npx prisma generate --schema="${ROOT_DIR}/prisma/schema.prisma")

echo "==> Applying migrations"
(cd "${ROOT_DIR}" && DATABASE_URL="${DATABASE_URL}" npx prisma migrate deploy)

echo "==> Seeding demo data"
(cd "${ROOT_DIR}" && ATLAS_SEED_MODE=bootstrap DATABASE_URL="${DATABASE_URL}" npm run prisma:seed)

cat <<EOF

Local bootstrap completed.

Next steps on your machine:
1. cd "${ROOT_DIR}"
2. PORT=${APP_PORT} env \$(grep -v '^#' .env.local | xargs) npm run dev
3. Open http://127.0.0.1:${APP_PORT}

Demo accounts:
- admin@atlas.local / admin1234
- editor@atlas.local / editor1234
- contributor@atlas.local / contributor1234
- researcher@atlas.local / researcher1234
EOF
