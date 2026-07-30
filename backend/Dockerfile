FROM node:20-alpine

# Install Docker CLI so we can run Docker commands from inside the container
RUN apk add --update docker openrc

WORKDIR /app

# Copy package files (we'll just use npm install inside the container for simplicity)
COPY package.json package-lock.json* ./

RUN npm install

# Copy application files
COPY . .

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "run", "dev"]
