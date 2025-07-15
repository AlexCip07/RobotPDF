# Use Node 18 (Debian-based instead of Alpine)
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (skip .npmrc to avoid optional dependency conflicts)
RUN rm -f package-lock.json && \
    npm install --no-audit --no-fund

# Copy source code
COPY . .

# Build the application with placeholder DATABASE_URL
ENV DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder"
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"] 