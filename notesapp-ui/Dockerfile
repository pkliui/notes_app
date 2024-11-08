FROM node:lts-alpine as build

WORKDIR /app
COPY ./package*.json ./
RUN npm i

COPY . .

RUN npm run build

# second part with nginx
FROM nginx:1.21.4-alpine

COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/default.conf /etc/nginx/conf.d

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]