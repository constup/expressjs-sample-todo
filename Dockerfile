FROM node:22-alpine AS npm_install_step
USER node
WORKDIR /home/node
COPY --chown=node:node ["package.json", "package-lock.json", "./"]
RUN ["npm", "install"]
COPY --chown=node:node ["src/", "./src/"]
COPY --chown=node:node ["html/", "./html/"]
RUN ["sh", "-c", "find . ! -name dist ! -name node_modules ! -name src  ! -name html -maxdepth 1 -mindepth 1 -exec rm -rf {} \\;"]

FROM node:22-alpine
RUN apk add dumb-init
USER node
WORKDIR /home/node
COPY --chown=node:node --from=npm_install_step /home/node ./
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["sh", "/usr/src/app/start.sh"]
EXPOSE 3000