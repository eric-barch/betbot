FROM node:20.5.1

# Create app directory
WORKDIR /app

# Use wildcard to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Generate the Prisma client
RUN npx prisma generate

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]