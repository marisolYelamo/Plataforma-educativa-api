FROM node:16.13.2-alpine
WORKDIR /api
COPY . .
RUN npm install
RUN npm run build
EXPOSE 4004
CMD npm start