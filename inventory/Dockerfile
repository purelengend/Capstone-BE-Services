FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json yarn.lock ./
RUN yarn install

# Copy source files
COPY . .

EXPOSE 3002

# Compile TypeScript code
RUN yarn build

# RUN yarn typeorm migration:run -d ./src/data-source.ts

# Start the server
CMD ["yarn", "start"]