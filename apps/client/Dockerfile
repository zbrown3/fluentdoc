# Stage 1: Build the Angular app
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire Angular project to the container
COPY . .

# Build the Angular project for production or test
ARG BUILD_ENV=prod
RUN if [ "$BUILD_ENV" = "prod" ]; then npm run build:prod; else npm run build:test; fi

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy built files from Stage 1 to Nginx's default serving directory
COPY --from=builder /app/dist/fluentdoc-client/browser /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx server by default
CMD ["nginx", "-g", "daemon off;"]
