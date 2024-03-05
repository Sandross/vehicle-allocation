FROM node:20.11.1-alpine3.18

WORKDIR /app

COPY package*.json .

RUN npm install

RUN npm install sqlite3 --save

COPY . .

EXPOSE 3000

CMD ["npm", "start"]