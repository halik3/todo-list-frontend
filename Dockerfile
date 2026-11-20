# ---- Stage 1: Build ----
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files dulu (agar layer cache efisien)
COPY package*.json ./
RUN npm ci

# Copy sisa kode
COPY . .

# Pass VITE_API_URL via build argument (default untuk lokal)
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

# Build
RUN npm run build

# ---- Stage 2: Serve ----
FROM nginx:alpine

# Copy hasil build dari stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]