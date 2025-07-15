# Use Node 18 (Debian-based instead of Alpine)
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY .npmrc ./

# Install dependencies with explicit rollup native dependency
RUN npm install --no-audit --no-fund && \
    npm install @rollup/rollup-linux-x64-gnu --save-optional --no-audit --no-fund

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"] 