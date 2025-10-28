# Imagen base de Node
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Construye el proyecto
RUN npm run build

# Imagen final (más ligera)
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Copia solo los archivos necesarios
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
