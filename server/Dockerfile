FROM rust:1.75 as builder
WORKDIR /usr/src/myapp
COPY . .
RUN cargo install --path .

FROM debian:buster-slim
#RUN apt-get update && apt-get install -y extra-runtime-dependencies && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/alp /usr/local/bin/alp
CMD ["alp"]
