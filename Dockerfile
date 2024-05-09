FROM node:14

WORKDIR /app

COPY package*.json ./
COPY .env* ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
