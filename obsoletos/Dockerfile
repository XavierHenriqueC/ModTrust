# Imagem Base para Node.js
FROM node AS node_builder

# Diretório de trabalho para o projeto Node.js
WORKDIR /app/backend

# Copia os arquivos de dependências do projeto principal
COPY backend/package*.json ./

# Instala as dependências do projeto principal
RUN npm install

# Copia todos os arquivos da aplicação principal para o diretório de trabalho
COPY backend/ .

# Imagem Base para o projeto React
FROM node AS react_builder

# Diretório de trabalho para o projeto React
WORKDIR /app/Interface

# Copia os arquivos de dependências do projeto React
COPY Interface/package*.json ./

# Instala as dependências do projeto React
RUN npm install

# Copia todos os arquivos da aplicação React para o diretório de trabalho
COPY Interface/ .

# Roda o comando de build do projeto React
RUN npm run build

# Combina as duas imagens
FROM node

# Diretório de trabalho no container
WORKDIR /app

# Copia os arquivos de dependências do projeto principal da imagem do projeto Node.js
COPY --from=node_builder /app/backend .

# Copia os arquivos de construção do projeto React da imagem do projeto React
COPY --from=react_builder /app/Interface/dist ./Interface/dist

# Expõe as portas
EXPOSE 3000
EXPOSE 8080

# Comando de inicialização
CMD ["node", "index.js"]
