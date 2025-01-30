FROM denoland/deno:alpine-2.1.7

ENV DENO_DIR=/deno
ENV PORT=8000

WORKDIR /app

RUN mkdir -p /app/data

COPY . .

USER root

EXPOSE 8000

CMD ["sh", "-c", "deno run --allow-read --allow-write migrate.ts && deno run --allow-net --allow-read --allow-write --allow-env --import-map=deno.json server.ts"]
