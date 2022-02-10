# develop stage
FROM node:14-alpine as develop-stage
WORKDIR /app
COPY package*.json ./
RUN apk add --update python2 make g++\
    && rm -rf /var/cache/apk/*
RUN npm install
COPY . .

# build stage
FROM develop-stage as build-stage
# Custom build with / as the url
ENV BASE_URL=/
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
# Copy html files
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Use custom settings with hardened configuration
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
