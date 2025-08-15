# Console Shared Types

A TypeScript package containing shared types and classes for console applications.

## Project Structure

```
console-shared-types/
├── src/
│   ├── types/          # Type definitions
│   │   └── index.ts    # Types barrel export
│   ├── classes/        # Class definitions
│   │   └── index.ts    # Classes barrel export
│   └── index.ts        # Main entry point
├── build/               # Compiled JavaScript (generated)
├── tsconfig.json       # TypeScript configuration
├── package.json        # Package configuration
└── README.md          # This file
```

## Usage

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Watch for changes during development:
   ```bash
   npm run dev
   ```

### Adding Types

Create new type files in the `src/types/` directory and export them from `src/types/index.ts`:

```typescript
// src/types/example-types.ts
export interface ExampleType {
  id: string;
  name: string;
}

// src/types/index.ts
export * from './example-types';
```

### Adding Classes

Create new class files in the `src/classes/` directory and export them from `src/classes/index.ts`:

```typescript
// src/classes/example-class.ts
export class ExampleClass {
  constructor(private name: string) {}
  
  getName(): string {
    return this.name;
  }
}

// src/classes/index.ts
export * from './example-class';
```

## Building

The project uses TypeScript's compiler to generate JavaScript files and type definitions in the `build/` directory. The build process:

1. Cleans the `build/` directory
2. Compiles TypeScript to JavaScript
3. Generates type definition files (`.d.ts`)

## Exports

The package exports all types and classes through the main entry point at `src/index.ts`. When importing from this package, you can access all exported types and classes:

```typescript
import { ExampleType, ExampleClass } from 'akub-types';
``` 