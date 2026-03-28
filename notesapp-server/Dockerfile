FROM node:22.22.2-alpine

WORKDIR /app
COPY ./package*.json ./
RUN npm i

COPY . .
COPY ./prisma ./prisma

RUN npx prisma migrate deploy
RUN npx prisma generate
RUN npx prisma migrate status

EXPOSE 5000
RUN npm run build
CMD ["npm", "run",  "start"]
