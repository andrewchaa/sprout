# Sprout PWA

A modern, production-ready Progressive Web App (PWA) skeleton built with React, TypeScript, TanStack Query, and Tailwind CSS.

## Features

- ⚡ **Vite** - Lightning-fast build tool and dev server
- ⚛️ **React 18** - Modern React with hooks and concurrent features
- 📘 **TypeScript** - Type-safe development throughout
- 🎨 **Tailwind CSS** - Utility-first styling with responsive design
- 🔄 **TanStack Query v5** - Powerful data fetching and state management
- 📱 **PWA Support** - Full offline capabilities and installability
- 🛠️ **Developer Tools** - React Query DevTools, ESLint, hot module replacement

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack Query (React Query)
- **PWA**: vite-plugin-pwa with Workbox
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd sprout
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

**Note**: Service workers are disabled in development mode by default. To test PWA features during development, set `devOptions.enabled: true` in `vite.config.ts`.

### Build for Production

Build the app:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The preview server allows you to test the PWA features locally before deployment.

## PWA Testing

### Testing Installability

1. Build the app: `npm run build`
2. Preview it: `npm run preview`
3. Open the app in a browser (Chrome recommended)
4. Look for the install prompt or check the browser's address bar for an install icon

### Testing Offline Support

1. Load the app in the browser
2. Open DevTools → Network tab
3. Check "Offline" to simulate offline mode
4. Reload the page
5. The app should load from the cache
6. Try navigating - the app shell should remain functional

### Lighthouse PWA Audit

1. Build and preview the app
2. Open Chrome DevTools → Lighthouse
3. Select "Progressive Web App" category
4. Run the audit
5. Aim for a 100% PWA score

### Service Worker Inspection

Open DevTools → Application tab:
- **Manifest**: Verify app name, icons, colors, and display mode
- **Service Workers**: Check registration status and update on reload
- **Cache Storage**: Inspect cached assets

## Project Structure

```
sprout/
├── public/
│   └── icons/              # PWA icons (72x72 to 512x512)
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components (Button, Card)
│   │   ├── Layout.tsx     # Main layout wrapper
│   │   ├── OfflineIndicator.tsx
│   │   └── InstallPrompt.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useOnlineStatus.ts
│   │   └── useInstallPrompt.ts
│   ├── queries/           # TanStack Query setup
│   │   ├── queryClient.ts
│   │   └── exampleQueries.ts
│   ├── services/          # API and services
│   │   └── api.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── styles/            # Global styles
│   │   └── index.css
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── vite-env.d.ts     # Vite types
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts         # Vite & PWA configuration
├── tailwind.config.js
└── postcss.config.js
```

## Key Files

### vite.config.ts

Configures Vite, React plugin, and PWA plugin with:
- App manifest (name, icons, colors, display mode)
- Workbox caching strategies
- Service worker generation

### src/main.tsx

Application entry point that sets up:
- QueryClient with default configuration
- Service worker registration
- React Query DevTools (dev mode only)

### src/queries/exampleQueries.ts

Demonstrates TanStack Query patterns:
- Simple queries with `useQuery`
- Parameterized queries
- Mutations with `useMutation`
- Cache invalidation strategies

### src/services/api.ts

API client abstraction with:
- Centralized fetch wrapper
- Error handling
- TypeScript type support

## TanStack Query Usage

### Basic Query

```typescript
import { useExampleData } from './queries/exampleQueries'

function MyComponent() {
  const { data, isLoading, error } = useExampleData()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>{/* render data */}</div>
}
```

### Mutation with Cache Invalidation

```typescript
import { useCreateItem } from './queries/exampleQueries'

function MyComponent() {
  const createMutation = useCreateItem()

  const handleCreate = () => {
    createMutation.mutate({ title: 'New Item', completed: false })
  }

  return (
    <button onClick={handleCreate} disabled={createMutation.isPending}>
      {createMutation.isPending ? 'Creating...' : 'Create Item'}
    </button>
  )
}
```

## Customization

### Change App Name and Colors

Edit `vite.config.ts`:

```typescript
manifest: {
  name: 'Your App Name',
  short_name: 'YourApp',
  theme_color: '#your-color',
  background_color: '#your-color',
  // ...
}
```

Also update in `index.html`:
```html
<meta name="theme-color" content="#your-color" />
<title>Your App Name</title>
```

### Add New API Endpoints

1. Define types in `src/types/index.ts`
2. Create query hooks in `src/queries/`
3. Use the `api` client from `src/services/api.ts`

Example:

```typescript
// src/queries/userQueries.ts
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get<User[]>('/users'),
  })
}
```

### Modify Tailwind Theme

Edit `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
      },
    },
  },
}
```

## Environment Variables

All environment variables must be prefixed with `VITE_` to be exposed to the client.

Create a `.env` file in the root directory:

```bash
VITE_API_BASE_URL=https://api.example.com
```

Access in code:

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

## Deployment

### Build Optimization

The production build is optimized with:
- Code splitting
- Asset optimization
- Service worker generation
- Precaching of static assets

### HTTPS Requirement

PWAs require HTTPS in production (localhost is exempt). Most hosting providers (Vercel, Netlify, Cloudflare Pages) provide HTTPS by default.

### Deployment Platforms

**Vercel**:
```bash
npm install -g vercel
vercel
```

**Netlify**:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**GitHub Pages** (requires configuration):
- Set `base` in `vite.config.ts` to your repo name
- Use GitHub Actions for deployment

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Chrome for Android (latest)
- Safari on iOS (latest)

## Troubleshooting

### Service Worker Not Updating

- Clear browser cache
- Unregister the service worker in DevTools → Application
- Hard refresh (Cmd/Ctrl + Shift + R)

### Icons Not Showing

- Verify icon files exist in `public/icons/`
- Check manifest configuration in `vite.config.ts`
- Clear cache and rebuild

### API Calls Failing

- Check CORS configuration on your API server
- Verify `VITE_API_BASE_URL` in `.env`
- Check Network tab in DevTools for errors

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
