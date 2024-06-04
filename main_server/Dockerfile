# Use an official Node.js Alpine image as base
FROM node:alpine

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json (if available)
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your server will run on
EXPOSE 5001

# Command to run your server
CMD ["npm", "run", "dev"]
