# Code Standards & Conventions

## Project Structure

```
src/
├── api/                    # API functions and endpoints
│   ├── index.ts           # API exports
│   └── brand.ts           # Brand-related API calls
├── app/                   # Next.js app router pages
├── components/            # React components
│   ├── tool/             # Page-specific components (Page1, Page2, etc.)
│   ├── ui/               # Reusable UI components
│   │   └── common/       # Shared common components
│   └── layout/           # Layout components
├── config/               # Configuration files
├── constants/            # Application constants
│   ├── index.ts         # Constants exports
│   ├── apiUrls.ts       # API endpoint URLs
│   └── page2.ts         # Page2-specific constants
├── hooks/                # Custom React hooks
├── interfaces/           # TypeScript interfaces
│   ├── index.ts         # Interfaces exports
│   └── discovery.ts     # Discovery stream interfaces
├── props/                # Component props interfaces
│   ├── index.ts         # Props exports
│   └── [ComponentName].ts
├── styles/               # Global styles
├── theme/                # Theme configuration
├── types/                # Type definitions
└── utils/                # Utility functions
```

## Naming Conventions

### Files & Folders
- **Components**: PascalCase (e.g., `Page2Analysing.tsx`, `AgentThoughtsPopup.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useDiscoveryStream.ts`)
- **Constants**: camelCase files, UPPER_CASE exports (e.g., `apiUrls.ts`, `API_ENDPOINTS`)
- **Interfaces**: PascalCase (e.g., `DiscoveryStreamResult`)
- **Props files**: Match component name (e.g., `Page2Analysing.ts` for `Page2Analysing.tsx`)

### Variables & Functions
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Functions**: camelCase
- **React Components**: PascalCase
- **Custom Hooks**: `use` + PascalCase/camelCase (e.g., `useDiscoveryStream`)

### CSS Classes (Tailwind)
- Use Tailwind utility classes directly in JSX
- For custom animations, define in `<style jsx global>` blocks

## Component Structure

### File Organization
Each component should follow this structure:

```tsx
"use client";  // If using hooks/state

// 1. React imports
import { useState, useEffect } from "react";

// 2. Third-party libraries
import { Box, Flex } from "@chakra-ui/react";
import { Icon } from "lucide-react";

// 3. Project imports (in order: hooks, constants, props, interfaces, components)
import { useDiscoveryStream } from "@/hooks/useDiscoveryStream";
import { STATUS_COLORS } from "@/constants/page2";
import { ComponentNameProps } from "@/props/ComponentName";
import { DiscoveryStatus } from "@/interfaces/discovery";
import ChildComponent from "./ChildComponent";

// 4. Props interface (imported from separate file)
// interface ComponentNameProps { ... }

// 5. Component definition
export default function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // Component logic
  return <JSX />;
}
```

### Props Definition
- **Always** define props in a separate file under `src/props/`
- Import props interface in the component
- Use destructuring in function signature

```typescript
// src/props/MyComponent.ts
export interface MyComponentProps {
  title: string;
  count?: number;
  onClick: () => void;
}
```

```tsx
// src/components/tool/MyComponent.tsx
import { MyComponentProps } from "@/props/MyComponent";

export default function MyComponent({ title, count = 0, onClick }: MyComponentProps) {
  return <button onClick={onClick}>{title}: {count}</button>;
}
```

## Constants Management

### When to Create Constants
- Values used in multiple places
- Configuration values (API URLs, feature flags)
- Status/state enums
- Color schemes
- Static labels/text

### Constants File Structure
```typescript
// src/constants/page2.ts
export const STATUS_COLORS = {
  idle: "gray",
  browsing: "emerald",
  generating: "violet",
  finished: "blue",
  error: "red",
} as const;

export const ANALYSIS_STEPS = [
  "Scraping website content",
  "Extracting brand signals",
  // ...
] as const;
```

## API Management

### URL Constants
All API URLs must be defined in `src/constants/apiUrls.ts`:

```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
export const API_VERSION = "/api/v1";

export const API_ENDPOINTS = {
  BRANDS: `${API_BASE_URL}${API_VERSION}/data/brands`,
  CONTENT: `${API_BASE_URL}${API_VERSION}/content`,
} as const;
```

### API Functions
All API calls must be in `src/api/`:

```typescript
// src/api/brand.ts
import { API_ENDPOINTS } from "@/constants/apiUrls";

export async function* createBrandStream(
  websiteUrl: string,
  name: string = ""
): AsyncIterableIterator<BrandStreamData> {
  const url = `${API_ENDPOINTS.BRANDS}?website_url=${encodeURIComponent(websiteUrl)}`;
  // ...
}
```

## TypeScript Guidelines

### Interfaces vs Types
- Use **interfaces** for object shapes (especially props, API responses)
- Use **types** for unions, primitives, or complex type manipulations

### Interface Location
- Component props → `src/props/[ComponentName].ts`
- API/Domain interfaces → `src/interfaces/[domain].ts`
- Shared types → `src/types/[category].ts`

### Type Safety
- Avoid `any` - use `unknown` if type is truly dynamic
- Use `as const` for constant objects to preserve literal types
- Prefer optional properties (`?`) over `undefined`

## Code Style

### Indentation
- 2 spaces for indentation
- Use Prettier for auto-formatting

### Quotes
- Use double quotes for strings
- Template literals for interpolation

### Semicolons
- Always use semicolons

### Line Length
- Max 100 characters per line
- Break long lines at logical points

### Imports Order
1. React imports
2. Third-party libraries
3. Project imports (absolute paths with `@/`)
4. Relative imports (sorted by proximity)

### Example Import Block
```typescript
import { useState, useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Sparkles } from "lucide-react";
import { useDiscoveryStream } from "@/hooks/useDiscoveryStream";
import { STATUS_COLORS } from "@/constants/page2";
import { ComponentProps } from "@/props/Component";
import ChildComponent from "./ChildComponent";
```

## React Best Practices

### Functional Components
- Always use functional components with hooks
- Use `export default function ComponentName()` pattern

### Hooks
- Custom hooks must be in `src/hooks/`
- Hook files should export a single hook function
- Hook return types should be defined as interfaces

### State Management
- Use `useState` for local component state
- Use custom hooks for shared state logic
- Avoid prop drilling - use context or state management for deep trees

### Event Handlers
- Use camelCase for event handlers (`onClick`, `onChange`)
- Define handlers inside component or as memoized callbacks

## Chakra UI Usage

### Component Props
Use Chakra's shorthand props consistently:
```tsx
<Box
  w="full"           // width
  h="400px"          // height
  p={4}              // padding
  m={2}              // margin
  bg="blue.500"      // background
  borderRadius="xl"  // border-radius
/>
```

### Responsive Design
```tsx
<Box
  w={{ base: "full", md: "50%", lg: "25%" }}
  p={{ base: 2, md: 4 }}
/>
```

## Documentation

### Component Documentation
Each component should have a JSDoc comment:
```tsx
/**
 * AgentThoughtsPopup Component
 * Displays real-time agent reasoning in a popup terminal
 * 
 * @param thoughts - Array of thought strings to display
 * @param status - Current discovery status
 * @param isOpen - Whether popup is visible
 * @param onClose - Callback to close popup
 */
export default function AgentThoughtsPopup({ thoughts, status, isOpen, onClose }: AgentThoughtsPopupProps) {
  // ...
}
```

### Function Documentation
Document complex functions:
```typescript
/**
 * Creates an SSE stream for brand discovery
 * @param websiteUrl - The brand website URL to analyze
 * @param name - Optional brand name
 * @returns AsyncIterableIterator of brand stream data
 */
export async function* createBrandStream(
  websiteUrl: string,
  name: string = ""
): AsyncIterableIterator<BrandStreamData> {
  // ...
}
```

## Testing

### Test Files
- Place tests alongside components: `ComponentName.test.tsx`
- Use React Testing Library for component tests
- Test hooks separately in `hooks/__tests__/`

## Git Conventions

### Commit Messages
```
feat: Add agent thoughts popup component
fix: Resolve SSE connection error in discovery stream
docs: Update code standards documentation
refactor: Extract constants to separate files
chore: Update dependencies
```

### Branch Naming
- `feature/description`
- `fix/description`
- `hotfix/description`

## Environment Variables

### Required Variables
- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL

### Naming
- Prefix client-side variables with `NEXT_PUBLIC_`
- Use UPPER_SNAKE_CASE for all environment variables
