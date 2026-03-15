#!/bin/sh
set -e

export DATABASE_URL="${DATABASE_URL:-postgresql://atlas:atlas@db:5432/atlas}"

until npx prisma migrate deploy; do
  echo "Database non ancora pronto, nuovo tentativo tra 2 secondi..."
  sleep 2
done

if [ "${ATLAS_AUTO_SEED:-true}" = "true" ]; then
  ATLAS_SEED_MODE=bootstrap npm run prisma:seed
fi

exec "$@"
