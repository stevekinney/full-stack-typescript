## Fullstack TypeScript, v2 Course

This is a companion repository for the [Fullstack TypeScript, v2](https://frontendmasters.com/courses/fullstack-typescript-v2) course on Frontend Masters.
[![Frontend Masters](https://static.frontendmasters.com/assets/brand/logos/full.png)](https://frontendmasters.com/courses/fullstack-typescript-v2)

## Setup Instructions

This repo requires Node.js version 22 or higher. Clone the repo and install the dependencies:

```bash
git clone https://github.com/stevekinney/full-stack-typescript.git
cd full-stack-typescript
npm install
```

## Zod Exercises

To start the Zod exercise, `cd` into the `exercises/zod` directory and run the tests: `npm test zod-exercises.test`. Note: You'll need to remove the `todos` in the test when you begin the

## Todo API Application

To start the Todo application, both the client and server applications need to be started. VS Code users can use the provide `Start` task. Open the Command Palette > Run Task > Start. Alternatively, open two terminal tabs and run each project:

```bash
# Terminal 1: Client App
cd client
npm run dev

# Terminal 2: Server App
cd server
npm run dev

```
