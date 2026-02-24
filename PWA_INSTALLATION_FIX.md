# PWA Installation Fix - Mobile Install Prompt

## Problem Identified

The PWA install prompt was showing on **desktop** but **not on mobile**.

### Root Cause

Mobile browsers (especially Android Chrome) are **much stricter** about PWA manifest requirements than desktop browsers. The issue was in the manifest configuration:

```json
❌ BEFORE (Broken on Mobile):
{
  "start_url": "/",           // Root path
  "scope": "/sprout/"         // Scoped to /sprout/
}
```

**Problem**: The `start_url` was **not within the scope**. According to PWA specification, the start URL must be within the scope for the app to be installable.

- Desktop browsers: Lenient, show install prompt anyway
- Mobile browsers: Strict, **refuse to show install prompt**

### Solution

```json
✅ AFTER (Fixed):
{
  "start_url": "/sprout/",    // Now within scope ✓
  "scope": "/sprout/"         // Matching scope ✓
}
```

## Files Changed

**vite.config.ts** - Updated manifest configuration:
- ✅ `start_url: '/sprout/'` (was `/`)
- ✅ `scope: '/sprout/'` (explicitly set)
- ✅ Updated app name and description

## Testing PWA Installation on Mobile

### Prerequisites for PWA Install

For a PWA install prompt to appear, ALL these requirements must be met:

1. ✅ **HTTPS or localhost** - Must be served securely
2. ✅ **Valid manifest** - With correct paths, icons, name, etc.
3. ✅ **Service Worker** - Must be registered and active
4. ✅ **Engagement** - User must interact with the site (varies by browser)
5. ✅ **Icons** - At least one icon 192x192 or larger
6. ✅ **start_url within scope** - Fixed in this PR!

### Testing on Mobile - Development

#### Option 1: Use Your Local Network IP

**Your computer's IP addresses:**
- `http://10.12.55.235:5173/sprout/` (main WiFi)
- `http://192.168.139.3:5173/sprout/` (alternative)
- `http://192.168.215.0:5173/sprout/` (alternative)

**Steps:**
1. Make sure your **phone is on the same WiFi** as your computer
2. Open Chrome on your Android phone
3. Navigate to: `http://10.12.55.235:5173/sprout/`
4. Interact with the page (scroll, click timer, etc.)
5. Wait 30-60 seconds for engagement threshold
6. Look for **"Add to Home Screen"** prompt or check menu (⋮)

⚠️ **Note**: Install prompts may not appear on non-HTTPS localhost connections from mobile. For best testing, use the deployed version (GitHub Pages).

#### Option 2: Use ngrok or Similar Tunnel

If local IP doesn't work (firewall/network restrictions):

```bash
# Install ngrok: https://ngrok.com/
npx ngrok http 5173

# Use the HTTPS URL it provides on your mobile
```

### Testing on Mobile - Production (Recommended)

**Best way to test**: Deploy to GitHub Pages (which has HTTPS):

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages:**
   ```bash
   # Your repo is already set up for GitHub Pages
   git add .
   git commit -m "Fix PWA manifest for mobile installation"
   git push origin main
   ```

3. **Access from mobile:**
   - Open `https://YOUR_USERNAME.github.io/sprout/` on your phone
   - Wait 30 seconds, interact with the page
   - Install prompt should appear!

### How to Trigger Install Prompt

Different browsers have different triggers:

#### Android Chrome
- Automatically shows install banner after engagement criteria met
- Or tap menu (⋮) → "Add to Home Screen" or "Install app"
- Criteria: Visit at least twice, with at least 5 minutes between visits (can be overridden)

#### Android Firefox
- Tap menu (⋮) → "Install"
- Shows house icon with + in address bar

#### iOS Safari
- No automatic prompt
- Tap share button → "Add to Home Screen"
- **Note**: iOS has limited PWA support

## Verification Steps

### 1. Check Manifest is Valid

Open Chrome DevTools on desktop:
1. Open `http://localhost:5173/sprout/`
2. Open DevTools (F12)
3. Go to **Application** tab
4. Click **Manifest** in left sidebar
5. Check for errors

Should show:
```
✓ Name: Sprout Pomodoro
✓ Short name: Sprout
✓ Start URL: /sprout/
✓ Scope: /sprout/
✓ Display: standalone
✓ Icons: 8 icons (72x72 to 512x512)
```

### 2. Check Service Worker is Active

Still in DevTools Application tab:
1. Click **Service Workers** in left sidebar
2. Should show: "activated and is running"

If you see errors, try:
- Click "Unregister"
- Refresh page
- Should re-register automatically

### 3. Test Install on Desktop First

On desktop Chrome:
1. Open `http://localhost:5173/sprout/`
2. Look for install icon in address bar (⊕ or desktop icon)
3. Click it to install
4. App should open in standalone window

If this works on desktop but not mobile, it's likely:
- Network/HTTPS issue (use production URL)
- Engagement threshold not met (wait longer, interact more)
- Browser cache (clear cache, hard refresh)

## Mobile-Specific Requirements

### Android Chrome Requirements
- ✅ Manifest with name, short_name, start_url, display, icons
- ✅ Service Worker
- ✅ HTTPS (or localhost)
- ✅ User engagement (visit twice, 5 min apart - can bypass in DevTools)
- ⚠️ Install prompt can be delayed or may not show if criteria not met

### iOS Safari Requirements
- ✅ Manifest
- ✅ Must use "Add to Home Screen" manually (no automatic prompt)
- ✅ Limited service worker support when app not active
- ⚠️ Less reliable than Android for PWA features

## Debugging Tips

### PWA Not Installing on Mobile?

**1. Use Chrome Remote Debugging:**

On desktop Chrome:
- Go to `chrome://inspect`
- Connect your Android phone via USB
- Enable "USB debugging" in Android Developer Options
- Inspect your mobile browser tab
- Check Console/Application tabs for errors

**2. Check Network Panel:**
- Ensure manifest loads: `/sprout/manifest.webmanifest`
- Ensure icons load: `/sprout/icons/icon-192x192.png`
- Any 404 errors will prevent installation

**3. Clear Everything and Retry:**

On mobile:
- Settings → Apps → Chrome → Storage → Clear cache
- Or use incognito/private mode
- Close all tabs
- Reopen the app URL
- Interact for 30+ seconds

**4. Force Install via Menu:**

Don't wait for automatic prompt:
- Open app URL
- Tap menu (⋮)
- Look for "Install app" or "Add to Home Screen"
- Even if automatic prompt doesn't appear, manual install should work

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| No install option in menu | Manifest invalid | Check DevTools Application → Manifest |
| Icons not loading | Wrong paths | Verify in Network tab |
| "Not secure" warning | HTTP not HTTPS | Use production URL (GitHub Pages) |
| Install prompt never appears | Engagement threshold | Wait longer, interact more, or use menu |
| Service Worker failing | Old SW cached | Unregister in DevTools, refresh |

## Production Deployment Checklist

Before deploying to production:

- ✅ `start_url` matches your deployment path (`/sprout/`)
- ✅ `scope` matches your deployment path (`/sprout/`)
- ✅ All icon files exist in `public/icons/`
- ✅ Icons are at least 192x192 (one) and 512x512 (one)
- ✅ Service Worker builds without errors
- ✅ Manifest is accessible at `/sprout/manifest.webmanifest`
- ✅ Site is served over HTTPS

## Current Status

✅ **Fixed**: Manifest now has matching `start_url` and `scope`
✅ **Updated**: App name to "Sprout Pomodoro"
✅ **Updated**: Description to match actual functionality
✅ **Service Worker**: Using custom SW with notification support
✅ **Icons**: All 8 required icons present (72x72 to 512x512)

## Testing URLs

**Development (Local Network):**
- http://10.12.55.235:5173/sprout/

**Production (GitHub Pages):**
- https://YOUR_USERNAME.github.io/sprout/

---

The PWA should now install correctly on both desktop and mobile! 🎉
