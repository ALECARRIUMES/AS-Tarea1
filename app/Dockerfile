# ---- Stage 1: build ----
FROM node:20-alpine AS build
WORKDIR /app

# Instalar dependencias primero (mejor cache)
COPY package*.json ./
RUN npm ci

# Copiar el resto y compilar
COPY . .
RUN npm run build

# ---- Stage 2: run (nginx) ----
FROM nginx:alpine

# Copiar build a nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Config para SPA (Vite/React) - fallback a index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]