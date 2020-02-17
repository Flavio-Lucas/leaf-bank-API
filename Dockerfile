FROM node:10-alpine

WORKDIR /var/www

RUN mkdir /var/www/storage -p

EXPOSE 3000

CMD ["node --with-intl=full-icu", "dist/main.js"]
