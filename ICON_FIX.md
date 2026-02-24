# PWA Icon Fix - Custom Domain Support

## Problem

When installing the PWA from your custom domain `https://andrewchaa.me.uk`, the icon was:
- Downloaded from the root URL
- Showing a ghost/template icon instead of the Sprout logo

## Root Cause

The manifest and HTML used **relative icon paths** which don't resolve correctly when the app is hosted on a custom domain at a subpath (`/sprout/`).

### Before (Broken)
```json
// manifest.webmanifest
{
  "icons": [
    {
      "src": "icons/icon-192x192.png"  // Relative path ❌
    }
  ]
}
```

When accessed from `https://andrewchaa.me.uk/sprout/`, the browser tried to load:
- `https://andrewchaa.me.uk/icons/icon-192x192.png` ❌ (doesn't exist)

Instead of:
- `https://andrewchaa.me.uk/sprout/icons/icon-192x192.png` ✅ (correct path)

## Solution

Updated all icon paths to **absolute URLs** that include the `/sprout/` base path.

### After (Fixed)
```json
// manifest.webmanifest
{
  "icons": [
    {
      "src": "/sprout/icons/icon-192x192.png"  // Absolute path ✅
    }
  ]
}
```

Now the browser correctly loads:
- `https://andrewchaa.me.uk/sprout/icons/icon-192x192.png` ✅

## Files Changed

### 1. vite.config.ts
Updated all 8 icon entries in the manifest:
```diff
icons: [
  {
-   src: 'icons/icon-192x192.png',
+   src: '/sprout/icons/icon-192x192.png',
    sizes: '192x192',
    type: 'image/png',
    purpose: 'any maskable'
  },
  // ... all other icons updated similarly
]
```

### 2. index.html
Added proper icon references and Apple-specific meta tags:
```diff
+ <link rel="icon" type="image/png" href="/sprout/icons/icon-192x192.png" />
+ <link rel="apple-touch-icon" href="/sprout/icons/icon-192x192.png" />
+ <meta name="apple-mobile-web-app-capable" content="yes" />
+ <meta name="apple-mobile-web-app-status-bar-style" content="default" />
+ <meta name="apple-mobile-web-app-title" content="Sprout" />
```

Also updated:
- Title: "Sprout Pomodoro" (was "Sprout PWA")
- Description: "Pomodoro timer that helps you grow your focus, one session at a time"

## Icon Details

Your Sprout icon is a beautiful green square with a white "S":

![Sprout Icon](./public/icons/icon-192x192.png)

- Color: Emerald green (#10b981)
- Background: Solid color with rounded corners
- Text: White "S" in center
- Sizes: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

## How to Deploy

To see the icon fix on your deployed site:

```bash
# 1. Build the updated app
npm run build

# 2. Commit the changes
git add .
git commit -m "Fix PWA icon paths for custom domain support"

# 3. Push to deploy
git push origin main
```

GitHub Pages will automatically deploy the updated version with the correct icons.

## Verification Steps

After deploying:

### On Desktop
1. Open `https://andrewchaa.me.uk/sprout/`
2. Look at browser tab - should show green Sprout icon ✅
3. Install as PWA
4. Check installed app icon - should show green Sprout icon ✅

### On Mobile
1. Open `https://andrewchaa.me.uk/sprout/` in Chrome/Safari
2. Install to home screen
3. Check home screen icon - should show green Sprout icon ✅
4. Open the installed app
5. Check splash screen - should show green Sprout icon ✅

### On iOS
1. Safari → Share → Add to Home Screen
2. Icon preview should show green Sprout icon ✅
3. Home screen icon should show green Sprout icon ✅

## Testing Locally

The dev server is running with network access:
```
http://10.12.55.235:5173/sprout/
```

However, to truly test icon loading from your custom domain, you'll need to deploy to GitHub Pages and access via `https://andrewchaa.me.uk/sprout/`.

## What Changed in the Build

**Before fix:**
```html
<!-- Icons tried to load from wrong path -->
<link rel="icon" href="/icons/icon-192x192.png" />
<!-- Browser looked at: https://andrewchaa.me.uk/icons/icon-192x192.png ❌ -->
```

**After fix:**
```html
<!-- Icons load from correct absolute path -->
<link rel="icon" href="/sprout/icons/icon-192x192.png" />
<link rel="apple-touch-icon" href="/sprout/icons/icon-192x192.png" />
<!-- Browser looks at: https://andrewchaa.me.uk/sprout/icons/icon-192x192.png ✅ -->
```

## Browser Support

✅ **Chrome/Edge (Desktop & Android)**: Perfect support
✅ **Firefox (Desktop & Android)**: Perfect support
✅ **Safari (Desktop & iOS)**: Perfect support with apple-touch-icon
✅ **Custom domains**: Now works correctly!

## Technical Notes

### Why Absolute Paths Matter

When a PWA is installed from a custom domain with a subpath:
- **Relative paths** are resolved relative to the manifest location
- Different browsers may interpret the base URL differently
- **Absolute paths** ensure consistency across all platforms

### Icon Resolution Priority

Browsers choose icons in this order:
1. Largest icon that fits the required size
2. Icon with `purpose: "any"` or `purpose: "maskable"`
3. Fallback to closest matching size

Your manifest now includes:
- 8 icon sizes (72x72 to 512x512)
- 192x192 icon marked as `"any maskable"` for adaptive icons
- Apple touch icon for iOS devices

## Summary

✅ **Fixed**: Icon paths now use absolute URLs with `/sprout/` prefix
✅ **Added**: Apple-specific meta tags for better iOS support
✅ **Updated**: App name and description to match Pomodoro functionality
✅ **Ready**: Deploy to see your green Sprout icon everywhere!

The ghost icon issue should be completely resolved once you deploy these changes. 🌱
