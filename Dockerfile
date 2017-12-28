FROM node:8

COPY server /server
COPY client /client

WORKDIR /client
RUN npm install

WORKDIR /server
RUN npm install

CMD [ "node", "server.js" ]
