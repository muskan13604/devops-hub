# Build stage
FROM node:20-alpine as builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine

# The default Nginx config will be overridden by our custom one in docker-compose
# But we copy the built React static files to Nginx's default serving directory
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
