# this is a Dockerile for notesapp-server
FROM node:lts-alpine
WORKDIR /app
COPY ./package*.json ./
RUN npm i
COPY . .
RUN npx prisma generate
RUN npx prisma db push
EXPOSE 5000
RUN npm run build
CMD ["npm", "run",  "start"]
