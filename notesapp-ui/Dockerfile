# this is a Dockerile for notesapp-ui
FROM node:lts-alpine as build
WORKDIR /app
COPY ./package*.json ./
RUN npm i
COPY . .
RUN npm run ec2-build


#CMD ["npm", "run",  "ec2-start"]
#RUN npm run ec2-start

FROM nginx:1.21.4-alpine
COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/default.conf /etc/nginx/conf.d
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]