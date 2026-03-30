FROM node:22.22.2-alpine

WORKDIR /app
COPY ./package*.json ./
RUN npm i

COPY . .
COPY .env ./

RUN npx prisma migrate deploy
RUN npx prisma generate

RUN npm run build
CMD ["npm", "run",  "start"]
