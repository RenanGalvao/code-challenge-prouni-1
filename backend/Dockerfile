###################
# BASE IMAGE
###################
FROM node:21.7-alpine AS base-image

# Node-gyp should be able to find and use Python.
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python

# Create APP directory
# be aware WORKDIR creates directories as root instead of USER 
# https://github.com/moby/moby/issues/36677
WORKDIR /usr/src/app

# Install Dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

# Copy Necessary Files
COPY . . 

# Creates Production Bundle
RUN npm run build && npm prune --production


###################
# PROD IMAGE
###################
FROM node:21.7-alpine AS prod-image
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV TZ=America/Sao_Paulo

# Needed Files
COPY --from=base-image --chown=node:node /usr/src/app/package.json ./
COPY --from=base-image --chown=node:node /usr/src/app/dist ./dist
COPY --from=base-image --chown=node:node /usr/src/app/migrations ./migrations
COPY --from=base-image --chown=node:node /usr/src/app/node_modules ./node_modules

USER node:node
EXPOSE 3000
CMD ["node", "dist/index.js"]
