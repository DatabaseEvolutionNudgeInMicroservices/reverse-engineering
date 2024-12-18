FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get -y update

RUN npm install

COPY .env ./

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
