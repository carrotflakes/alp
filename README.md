# alp - example implementation of chat service

relies:

- Rust
- GraphQL (async-graphql)
- actix-web v3
- Next.js
- Firebase Authentication
- diesel
- PostgreSQL
- Redis

## TODO

- error handling
- n+1 problem
- logging
- transaction
- scalable
- test

## Usage

```sh
$ docker-compose up
```

Then open localhost:3000 in your browser.

## Development

``` sh
$ cargo install diesel_cli --no-default-features --features postgres
$ diesel migration generate <migration_name>
```

## Author

* carrotflakes (carrotflakes@gmail.com)

## Copyright

Copyright (c) 2021 carrotflakes (carrotflakes@gmail.com)

## License

Licensed under the MIT License.
