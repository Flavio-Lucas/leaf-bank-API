FROM node:13.6.0-alpine
RUN apk add --no-cache nano sqlite

COPY package.json /var/www/package.json
COPY package-lock.json /var/www/package-lock.json

RUN cd /var/www; npm i

WORKDIR /var/www

COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json
COPY tslint.json tslint.json
COPY src src

RUN npm run build:prod

RUN rm -r -f src tsconfig.json tsconfig.build.json tslint.json

ENV API_PORT=3000

EXPOSE ${API_PORT}

ENTRYPOINT ["npm", "run", "start:prod"]
