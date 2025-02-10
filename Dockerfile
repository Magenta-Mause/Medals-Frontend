FROM nginx:1.27.3
WORKDIR /usr/src/app

COPY /dist/ /usr/share/nginx/html
COPY local.nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
