# Service Worker Notifications Implementation

## What Changed

The Sprout Pomodoro app now uses **Service Worker notifications** instead of basic browser notifications. This provides better reliability for notifications, especially on Android devices when the phone is locked.

## How It Works

### Before (Basic Notifications)
- Used `new Notification()` API
- Notifications stopped when phone locked
- Only worked when browser tab was active

### After (Service Worker Notifications)
- Uses `ServiceWorkerRegistration.showNotification()` API
- **Works on Android when phone is locked** ✅
- Works when browser tab is in background
- Better battery efficiency
- Notification click opens/focuses the app

## Platform Support

| Platform | Locked Screen | Background Tab | Notes |
|----------|---------------|----------------|-------|
| **Android Chrome** | ✅ Works | ✅ Works | Best experience |
| **Android Firefox** | ✅ Works | ✅ Works | Best experience |
| **Desktop Chrome** | N/A | ✅ Works | Excellent |
| **Desktop Firefox** | N/A | ✅ Works | Excellent |
| **iOS Safari** | ⚠️ Limited | ⚠️ Limited | iOS restricts web notifications when locked |
| **iOS Chrome/Firefox** | ⚠️ Limited | ⚠️ Limited | Uses Safari engine, same limitations |

## Testing Instructions

### Desktop Testing

1. **Open the app**: http://localhost:5176/sprout/
2. **Grant notification permission** when prompted
3. **Start a focus session** (or set duration to 1 minute for quick testing)
4. **Switch to another tab or app** (don't close the browser)
5. **Wait for timer to complete**
6. **You should receive a notification** even though the tab was in background
7. **Click the notification** - it should focus the app tab

### Mobile Testing (Android)

1. **Open the app** in Chrome or Firefox on your Android phone
2. **Add to Home Screen** (recommended for best PWA experience)
   - Tap the menu (⋮) → "Add to Home Screen"
3. **Grant notification permission**
4. **Start a focus session**
5. **Lock your phone or switch to another app**
6. **Wait for timer to complete**
7. **You should receive a notification** even with phone locked 🎉
8. **Tap the notification** to open the app

### Mobile Testing (iOS)

⚠️ **Note**: iOS has limitations with web notifications when the phone is locked

1. **Open the app** in Safari
2. **Add to Home Screen** (required for notifications on iOS)
3. **Grant notification permission**
4. **Start a focus session**
5. **Keep app in foreground** or switch to another app (don't lock phone)
6. **Notification should work** when app is in background
7. **Locked screen**: Limited - may not receive notifications until unlock

## Technical Details

### Files Modified

1. **src/hooks/useNotification.ts**
   - Added Service Worker registration detection
   - Updated `showNotification()` to use `registration.showNotification()`
   - Fallback to basic notifications if Service Worker unavailable

2. **src/sw.ts** (new file)
   - Custom Service Worker with notification handling
   - Handles notification clicks (opens/focuses app)
   - Uses Workbox for caching

3. **vite.config.ts**
   - Changed strategy from `generateSW` to `injectManifest`
   - Configured to use custom service worker (`src/sw.ts`)

### Notification Features

- **Icon**: Sprout logo (192x192)
- **Badge**: Sprout logo for notification badge
- **Vibration**: 200ms-100ms-200ms pattern on mobile
- **Auto-dismiss**: Notifications auto-dismiss after browser default time
- **Click action**: Opens or focuses the Sprout app

## Development

### Enable/Disable PWA in Dev Mode

Edit `vite.config.ts`:

```typescript
devOptions: {
  enabled: true  // true = PWA works in dev, false = only in production build
}
```

### Build for Production

```bash
npm run build
```

The service worker will be generated at `dist/sw.js`

### Deploy

The app needs to be served over HTTPS for Service Workers to work in production (except localhost).

GitHub Pages (where this app is deployed) automatically provides HTTPS.

## Troubleshooting

### Notifications not working?

1. **Check permission**: Browser settings → Notifications → Allow for this site
2. **Check Service Worker**: Open DevTools → Application → Service Workers
   - Should show "activated and is running"
3. **iOS users**: Make sure app is "Added to Home Screen"
4. **Clear cache**: Unregister old service workers in DevTools

### Testing with shorter timers

Temporarily change focus duration to 1 minute in `src/hooks/useTimer.ts`:

```typescript
const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 1,  // 1 minute for testing
  breakDuration: 1,   // 1 minute for testing
}
```

## Future Enhancements

For even better notifications (especially on iOS when locked), consider:

1. **Web Push API** - Requires backend server, works on iOS when locked
2. **Native app wrapper** - Using Capacitor/React Native for full native notification support
3. **Background Sync** - For offline support

## Questions?

The timer already handles:
- ✅ Running in background (tracks time even when tab hidden)
- ✅ Detecting when tab becomes visible again
- ✅ Showing notification when timer completes
- ✅ Playing sound when timer completes
- ✅ Vibration on mobile devices

The Service Worker enhancement makes the notification delivery more reliable on supported platforms!
