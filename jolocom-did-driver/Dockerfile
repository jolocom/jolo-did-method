FROM node:10.15

# Create Directory for the Container
WORKDIR /usr/src/app

# Only copy the package.json and yarn.lock to work directory
COPY package.json .
COPY yarn.lock .

# Install all Packages
RUN yarn install

# Copy all other source code to work directory
ADD . /usr/src/app

CMD [ "yarn", "server" ]
EXPOSE 8080