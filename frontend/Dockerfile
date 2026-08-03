# Build stage
FROM node:20-alpine as builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Serve stage
FROM nginx:alpine

# The default Nginx config will be overridden by our custom one in docker-compose
# But we copy the built React static files to Nginx's default serving directory
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
