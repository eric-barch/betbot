# Use the official Puppeteer image as the base
FROM ghcr.io/puppeteer/puppeteer:latest

# Create app directory
WORKDIR /app

# Copy package files and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Generate the Prisma client
RUN npx prisma generate

EXPOSE 8080

# Use the start script as the command
CMD [ "npm", "start" ]