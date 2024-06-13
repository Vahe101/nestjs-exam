FROM node:18.16.0-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install --legacy-peer-deps

RUN npm run build

CMD ["npm", "run", "start:dev"]
