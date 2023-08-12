FROM node:20.5.1

# Create app directory
WORKDIR /app

# Use wildcard to ensure both package.json and package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Generate the Prisma client
RUN npx prisma generate

EXPOSE 8080
CMD [ "npm", "start" ]