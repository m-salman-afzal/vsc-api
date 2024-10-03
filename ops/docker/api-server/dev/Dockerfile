FROM node:20
RUN apt-get update && apt-get -y install cron && apt-get install -y dos2unix
WORKDIR /build
COPY package*.json ./
RUN npm install

WORKDIR /corrections-api
RUN mkdir ./static
RUN cp -r /build/node_modules /corrections-api
COPY . .

COPY ops/docker/api-server/prod/cronjobs.cron /etc/cron.d/

RUN chmod 0644 /etc/cron.d/cronjobs.cron && dos2unix /etc/cron.d/cronjobs.cron

RUN crontab /etc/cron.d/cronjobs.cron && touch /var/log/cron.log

RUN npm run build

CMD service cron start && node ./build/bin/www.js

CMD node ./build/bin/www.js
