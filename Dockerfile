FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./app
ENV PORT=4000
EXPOSE 4002
RUN npx prisma generate

CMD ["npm", "run", "dev"]