FROM node:8-alpine
WORKDIR /app
COPY package.json /app
RUN npm install --only=production
ENV PORT 80
COPY index.js /app
CMD node index.js
EXPOSE ${PORT}
