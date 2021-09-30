FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN mkdir -p ./data
RUN useradd tileboard && chown -R tileboard ./data
USER tileboard
VOLUME ./data

EXPOSE 7272 7273

CMD [ "npm", "run", "run-server" ]