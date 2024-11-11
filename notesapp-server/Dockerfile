FROM node:lts-alpine

WORKDIR /app
COPY ./package*.json ./
RUN npm i

COPY . .

RUN npx prisma migrate deploy

EXPOSE 5000
RUN npm run build
CMD ["npm", "run",  "start"]
