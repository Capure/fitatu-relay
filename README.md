# fitatu-relay

## Development

To install dependencies:

```bash
bun install
```

To generate login data:

```bash
bun run login.ts --email={your_email} --password={your_password}
```

You can then use the generated data to login to the app.

Create a `.env` file with the following content:

```bash
SDK_DATA={your_sdk_data}
```

To run the app:

```bash
netlify dev
```

## Deployment

Set the `SDK_DATA` environment variable in Netlify to your SDK data.

## License

MIT
