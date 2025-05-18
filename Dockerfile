# Use Node.js LTS version with Debian-based image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Clean up build dependencies
RUN apt-get purge -y python3 make g++ && \
    apt-get autoremove -y && \
    apt-get clean

# Expose the port your app runs on
EXPOSE 4000

# Start the application
CMD ["npm", "run", "dev"]  