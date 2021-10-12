FROM hayd/deno:alpine-1.9.0 as builder

WORKDIR /build
COPY src ./src
RUN deno compile --unstable --allow-all -o ./server src/server.ts 

# ===================

FROM debian:buster-slim

ARG VERSION="0.0.0"
ARG BUILD_INFO="Not set"

WORKDIR /app
COPY --from=builder /build/server .
COPY src/views ./views

ENV VERSION "$VERSION"
ENV BUILD_INFO "$BUILD_INFO"
ENV PORT 8000

EXPOSE 8000
ENTRYPOINT [ "./server" ]