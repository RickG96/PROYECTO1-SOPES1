FROM node:16-alpine3.13
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4500
CMD ["node", "server.js"]
