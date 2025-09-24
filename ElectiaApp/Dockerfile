# Dockerfile para React App - OPTIMIZADO PARA CACHE
FROM node:18-alpine AS build

WORKDIR /app

# PASO 1: Copiar SOLO package.json y package-lock.json (para cache de dependencias)
COPY package*.json ./

# PASO 2: Instalar dependencias (esta capa se cachea si no cambias package.json)
RUN npm ci

# PASO 3: Copiar código fuente (solo se ejecuta si cambias código)
COPY . .

# Build de la aplicación (usando configuración menos estricta para Docker)
RUN npm run build:docker

# Usar nginx para servir la aplicación
FROM nginx:alpine

# Copiar archivos build al directorio de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar configuración de tipos MIME
COPY mime.types /etc/nginx/mime.types

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
