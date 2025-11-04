# Stage build: cài deps và generate Prisma client
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json và lockfile, cài dependencies (bao gồm devDependencies để chạy prisma generate)
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copy schema Prisma để chạy generate trước
COPY prisma ./prisma
RUN npx prisma generate


# Copy toàn bộ source code
COPY . .

# Stage runtime: chỉ lấy phần cần thiết, dùng NODE_ENV=production
FROM node:18-alpine AS runner
WORKDIR /app

# Copy từ builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json

EXPOSE 5002

# Chạy app (thay đổi nếu entrypoint khác)
CMD ["node", "src/server.js"]
