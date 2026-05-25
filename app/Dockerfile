# Imagen base
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Iniciar aplicación
CMD ["node", "src/index.js"]
