## Setup
1. Install all the project dependencies (Optional: fill in the environment variables):
```bash
npm install
```

2. Start the postgresql database:
```bash
docker compose up -d --build
```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

### Production Build

Compile TypeScript and build the production bundle:

```bash
npm run build
```

### Linting and Formatting

This project uses Husky to run pre-commit hooks via lint-staged.

Check code for linting errors with ESLint:

```bash
npm run lint
```

Automatically fix linting issues:

```bash
npm run lint:fix
```

Format code using Prettier:

```bash
npm run format
```
