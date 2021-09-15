# alp - example implementation of chat service

relies:

- Rust
- GraphQL (async-graphql)
- actix-web
- Next.js
- Firebase Authentication
- PostgreSQL

## TODO

- error handling
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
