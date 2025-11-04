# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /app

# 1. Copy package.json và lock file, cài deps
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# 2. Copy toàn bộ source và build
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# Stage 2: runtime
FROM node:18-alpine AS runner
WORKDIR /app

# Copy kết quả build và node_modules từ builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Nếu có file .next/output (Next 13+ với outputStandalone), bạn có thể điều chỉnh phù hợp:
# COPY --from=builder /app/.next/output ./.next/output

# Mở cổng ứng dụng (mặc định Next chạy port 3000)
EXPOSE 3000

# Chạy ứng dụng ở production mode
CMD ["npm", "start"]
