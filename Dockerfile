# syntax=docker/dockerfile:1
FROM node:18.17
ENV NODE_OPTIONS=--max_old_space_size=4096
WORKDIR /app
EXPOSE 3000
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install 
COPY . .
RUN npm run build:prod
ENTRYPOINT ["npm","start"]
