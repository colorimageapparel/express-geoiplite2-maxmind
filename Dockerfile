FROM node:8-alpine
WORKDIR /app
COPY package.json /app
COPY index.js /app
RUN npm install --only=production
CMD node index.js
EXPOSE 3000
