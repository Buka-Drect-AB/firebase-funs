# Server Functions

A comprehensive TypeScript package containing Firebase utilities, HTTP client utilities, and helper classes for server applications, with a focus on Firebase Admin operations and HTTP communication.

## Project Structure

```
server-funs/
├── src/
│   ├── firebase/       # Firebase utilities
│   │   ├── firestore/  # Firestore utilities
│   │   │   └── index.ts # FirestoreUtil class
│   │   ├── storage/    # Firebase Storage utilities
│   │   │   └── index.ts # FireStorageUtil class
│   │   └── index.ts    # Firebase barrel export
│   ├── http/           # HTTP client utilities
│   │   └── index.ts    # HttpClient class and utilities
│   ├── utils/          # General utilities
│   │   └── index.ts    # Utility functions
│   └── index.ts        # Main entry point
├── tsconfig.json       # TypeScript configuration
├── package.json        # Package configuration
└── README.md          # This file
```

## Features

### Firebase Utilities

#### FirestoreUtil Class

The `FirestoreUtil` class provides comprehensive Firestore operations with support for:

- **Document Management**: Create, read, update, and delete documents
- **Compound Paths**: Handle nested collections and subcollections
- **Query Operations**: Advanced querying with where clauses, ordering, and pagination
- **Upsert Operations**: Smart document creation/update logic
- **Type Safety**: Full TypeScript support with generics

#### FireStorageUtil Class

The `FireStorageUtil` class provides Firebase Storage operations:

- **File Upload**: Upload local files to Firebase Storage
- **Download URLs**: Generate download URLs for stored files
- **Metadata Support**: Custom metadata for uploaded files
- **Gzip Compression**: Automatic compression for uploaded files

### HTTP Utilities

#### HttpClient Class

A robust HTTP client with enhanced features:

- **Standardized Responses**: Consistent response format across all requests
- **Error Handling**: Comprehensive error handling with custom error handlers
- **Type Safety**: Full TypeScript support with generics
- **Request Methods**: Support for GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
- **Configuration**: Base URL, default headers, timeout, and authentication support
- **Response Types**: Support for JSON, array buffer, blob, document, text, and stream responses

### Utility Functions

- **Timestamp Utilities**: Unix timestamp generation functions

## Installation

```bash
npm install git+https://github.com/Buka-Drect-AB/server-funs.git
```

## Usage

### Basic Setup

```typescript
import { FirestoreUtil, FireStorageUtil, HttpClient } from '@akub/server-funs';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
const firestore = admin.firestore();
const storage = admin.storage();

// Create utility instances
const firestoreUtil = new FirestoreUtil(firestore);
const storageUtil = new FireStorageUtil(storage);
const httpClient = new HttpClient({ baseUrl: 'https://api.example.com' });
```

### Firestore Operations

#### Document Management

```typescript
// Create/set documents
const result = await firestoreUtil.setCompoundedDocument(
  'users',
  null,
  { name: 'John Doe', email: 'john@example.com' }
);

// Get documents
const user = await firestoreUtil.getDocument('users', 'user123');
const allUsers = await firestoreUtil.getDocuments('users');

// Update documents
await firestoreUtil.editDocument(
  'users',
  'user123',
  { name: 'John Updated' }
);

// Delete documents
await firestoreUtil.deleteDocument('users', 'user123');

// Upsert operations
await firestoreUtil.upsertDocument(
  firestore.collection('users').doc('user123'),
  { name: 'John', lastUpdated: new Date() }
);
```

#### Advanced Querying

```typescript
const results = await firestoreUtil.queryDocuments('users', {
  where: [
    { field: 'age', operator: '>=', value: 18 },
    { field: 'active', operator: '==', value: true }
  ],
  orderBy: { field: 'createdAt', direction: 'desc' },
  limit: 10
});
```

### Firebase Storage Operations

```typescript
// Upload local file to storage
const destination = await storageUtil.uploadLocalFileToStorage(
  'uploads/',
  '/local/path/file.jpg',
  'image.jpg',
  { contentType: 'image/jpeg' }
);

// Get download URL
const downloadUrl = await storageUtil.getStorageLink(destination);
```

### HTTP Operations

#### Basic HTTP Requests

```typescript
// GET request
const response = await httpClient.get('/users');

// POST request
const newUser = await httpClient.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT request
const updatedUser = await httpClient.put('/users/123', {
  name: 'John Updated'
});

// DELETE request
await httpClient.delete('/users/123');
```

#### Advanced HTTP Configuration

```typescript
// Create client with custom configuration
const customClient = new HttpClient({
  baseUrl: 'https://api.example.com',
  defaultHeaders: {
    'Authorization': 'Bearer token',
    'X-API-Version': '2.0'
  },
  errorHandler: async (error) => {
    console.error('HTTP Error:', error);
    // Custom error handling logic
  }
});

// Make request with custom config
const response = await customClient.request('POST', '/webhook', {
  headers: { 'X-Custom-Header': 'value' },
  timeout: 5000,
  body: { data: 'payload' }
});
```

#### Standardized Response Format

All HTTP responses follow this structure:

```typescript
interface StandardResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string | number;
    details?: unknown;
  };
  metadata?: {
    statusCode: number;
    headers?: Record<string, string>;
    [key: string]: unknown;
  };
}
```

### Utility Functions

```typescript
import { unixTimeStampNow } from '@akub/server-funs';

// Get current Unix timestamp
const timestamp = unixTimeStampNow();
```

## API Reference

### FirestoreUtil Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `setCompoundedDocument` | Create/set documents with compound path support | `path`, `docId`, `data`, `merge?` |
| `getDocument` | Retrieve single document | `path`, `docId?` |
| `getDocuments` | Get single or multiple documents | `path`, `docId?` |
| `editDocument` | Update existing document | `path`, `docId?`, `data` |
| `deleteDocument` | Delete document | `path`, `docId?` |
| `upsertDocument` | Upsert with smart create/update logic | `docRef`, `data` |
| `upsertDocumentWithDifferentData` | Upsert with different create/update data | `docRef`, `updateData`, `createData?` |
| `queryDocuments` | Advanced querying with conditions | `path`, `options` |

### FireStorageUtil Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `uploadLocalFileToStorage` | Upload local file to Firebase Storage | `path`, `filePath`, `fileName`, `metadata?` |
| `getStorageLink` | Get download URL for stored file | `location` |

### HttpClient Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `request` | Make HTTP request with full configuration | `method`, `endpoint`, `config?` |
| `get` | GET request | `endpoint`, `config?` |
| `post` | POST request | `endpoint`, `body?`, `config?` |
| `put` | PUT request | `endpoint`, `body?`, `config?` |
| `patch` | PATCH request | `endpoint`, `body?`, `config?` |
| `delete` | DELETE request | `endpoint`, `config?` |

### QueryOptions Interface

```typescript
interface QueryOptions {
  where?: QueryCondition[];
  orderBy?: {
    field: string;
    direction?: OrderByDirection;
  };
  limit?: number;
  startAfter?: any;
  startAt?: any;
  endAt?: any;
}
```

### HttpRequest Interface

```typescript
interface HttpRequest {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
  auth?: { username: string; password: string };
  responseType?: 'json' | 'arraybuffer' | 'blob' | 'document' | 'text' | 'stream';
  body?: unknown;
  [key: string]: unknown;
}
```

## Development

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Clean Build

```bash
npm run clean
npm run build
```

## Dependencies

- **firebase-admin**: Firebase Admin SDK for server-side operations
- **axios**: HTTP client for making requests
- **bcryptjs**: Password hashing utilities
- **nanoid**: Unique ID generation
- **typescript**: TypeScript compiler and types

## Exports

The package exports all utilities through the main entry point:

```typescript
import { 
  FirestoreUtil, 
  FireStorageUtil, 
  HttpClient, 
  createHttpClient,
  apiRequest,
  unixTimeStampNow,
  type StandardResponse,
  type HttpRequest,
  type QueryOptions 
} from '@akub/server-funs';
```

## License

MIT License - see LICENSE file for details.

## Author

Jackmay Confidence

## Repository

https://github.com/Buka-Drect-AB/server-funs 