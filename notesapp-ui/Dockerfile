# this is a Dockerile for notesapp-ui
FROM node:20.11.0 as builder
WORKDIR /app
COPY ./package*.json ./
RUN npm i
COPY . .
RUN npm run ec2-build

EXPOSE 3000
CMD ["npm", "run",  "ec2-start"]
#RUN npm run ec2-start

#FROM nginx

#COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
#COPY --from=builder /app/build /usr/share/nginx/html