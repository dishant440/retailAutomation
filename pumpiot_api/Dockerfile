FROM node:16-alpine

RUN apk add --no-cache git

WORKDIR /usr/api

# Copy dependency definitions
COPY api/package.json api/yarn.lock* ./

# Install dependencies
RUN yarn install --production=false

# Copy API application source
COPY api/ .

ENV PORT=5001
ENV RETHINKDB_HOST=db
ENV RETHINKDB_PORT=28015

EXPOSE 5001

CMD ["node", "server.js"]
