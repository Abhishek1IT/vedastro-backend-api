FROM node:22-alpine

WORKDIR /app

ARG NEXT_PUBLIC_API_URL=http://localhost:5000/api
ARG NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm","start"]