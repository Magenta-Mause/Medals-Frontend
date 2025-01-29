FROM node:lts-alpine
WORKDIR /usr/src/app

COPY /dist/ ./

EXPOSE 3000

# Running the app
CMD [ "npx", "serve", "-l", "3000" ]
