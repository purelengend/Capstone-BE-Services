FROM node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json yarn.lock ./
RUN yarn install

# Copy source files
COPY . .

EXPOSE 3000

# Compile TypeScript code
RUN yarn build

# Start the server
CMD ["yarn", "start"]