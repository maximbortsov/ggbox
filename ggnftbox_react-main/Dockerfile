# build environment
FROM node:20.20.2-bookworm-slim AS builder

WORKDIR /app

ENV PATH=/app/node_modules/.bin:$PATH
ARG REACT_APP_API_SOURCE=http://localhost:3000
ENV REACT_APP_API_SOURCE=$REACT_APP_API_SOURCE

COPY package*.json ./

RUN npm ci --silent

COPY ./ ./

RUN npm run build

# production environment
FROM nginx:1.25-alpine AS prod

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*
# Add log files
RUN mkdir -p /www/wwwlogs/ && touch /www/wwwlogs/ggnftbox.log && touch /www/wwwlogs/ggnftbox.error.log

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
