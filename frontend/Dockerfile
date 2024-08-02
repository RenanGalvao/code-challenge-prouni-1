###################
# BASE IMAGE
###################
FROM node:21.7-alpine AS base-image

# Create APP directory
WORKDIR /usr/src/app
ARG VITE_API_URL=http://localhost:3000
ARG VITE_APP_PORT=3010
ARG VITE_APP_ORIGIN=http://localhost:3010

# Install Dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

# Copy Necessary Files (static/src etc)
COPY . . 

# Creates Production Bundle
RUN npm run build && npm prune --production

# Remove html files from dist/server folder
RUN rm ./dist/server/*.html


###################
# PROD IMAGE
###################
FROM node:21.7-alpine AS prod-image

ENV NODE_ENV production
WORKDIR /usr/src/app

# Needed Files
COPY --from=base-image --chown=node:node /usr/src/app/package.json ./
COPY --from=base-image --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=base-image --chown=node:node /usr/src/app/dist ./dist

USER node:node
EXPOSE 3010
CMD ["node", "dist"]
