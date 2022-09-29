FROM node:latest
WORKDIR /app
COPY  pong-nest/package.json ./nest/
RUN   cd ./nest && npm install
COPY  pong-react/package.json ./react/
RUN   cd react && npm install