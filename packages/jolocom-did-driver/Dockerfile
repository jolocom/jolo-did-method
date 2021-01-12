FROM node:10.15

# Create Directory for the Container
WORKDIR /usr/src/app

# Only copy the package.json and yarn.lock to work directory
COPY package.json .

# lockfile is only available in root dir of monorepo, unresolved issue in yarn workspaces: https://github.com/yarnpkg/yarn/issues/5428
# COPY yarn.lock .

# Install all Packages
RUN yarn install

# Copy all other source code to work directory
ADD . /usr/src/app
RUN yarn build

CMD [ "yarn", "server" ]
EXPOSE 8080
