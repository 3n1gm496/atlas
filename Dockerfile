FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache openssl
ENV DATABASE_URL=postgresql://atlas:atlas@db:5432/atlas
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXTAUTH_SECRET=atlas-dev-secret-please-change-2026
ENV NEXTAUTH_URL=http://localhost:3000
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x docker-entrypoint.sh
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm","run","start"]
