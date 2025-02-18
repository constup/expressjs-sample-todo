FROM node:22-alpine

WORKDIR /usr/src/app
COPY . .

RUN apk update && \
    apk add \
        dumb-init \
        && \
    addgroup -g 11130 express &&\
    adduser -D -u 1130 -G express express && \
    chown -R express:express /usr/src/app

USER express

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["sh", "/usr/src/app/start.sh"]

EXPOSE 3000
