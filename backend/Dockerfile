# Imagem Base
FROM node

#Diretório no container (diretório de trabalho)
WORKDIR /app

#Copia arquivos no diretório de trabalho
COPY package*.json /app/

#Roda comandos
RUN npm install

#Copia todos os arquivos da aplicação para o diretório de trabalho
COPY . /app/

#Expõe porta
EXPOSE 3000

#Comando de inicialização
CMD ["node", "index.js"]

