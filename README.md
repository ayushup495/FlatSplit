# 🏠 FlatSplit PWA — Progressive Web App

> FlatSplit as a fully installable Progressive Web App — works offline, sends real notifications, installs to phone home screen like a native app.

---

## 📁 Files in This Folder

```
FlatSplit-PWA/
│
├── index.html       ← Main app (your full FlatSplit app)
├── manifest.json    ← Tells browser this is an installable app
├── sw.js            ← Service Worker (offline + notifications)
├── icon-192.png     ← App icon (Android, Chrome)
├── icon-512.png     ← App icon (splash screen, high res)
└── README.md        ← This file
```

---

## 🚀 HOW TO DEPLOY — Step by Step

### Step 1 — Create GitHub Repository

1. Go to [github.com](https://github.com) → Sign in
2. Click **"+"** → **"New repository"**
3. Name it exactly: `FlatSplit`
4. Set to **Public** ✅ (required for free GitHub Pages)
5. Click **"Create repository"**

---

### Step 2 — Upload All Files

1. On your new repo page click **"uploading an existing file"**
2. Drag and drop ALL 6 files:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
   - `README.md`
3. Scroll down → click **"Commit changes"**

---

### Step 3 — Enable GitHub Pages

1. In your repo → click **"Settings"** tab
2. Scroll down to **"Pages"** section (left sidebar)
3. Under **"Source"** → select **"Deploy from a branch"**
4. Under **"Branch"** → select **"main"** → folder **"/ (root)"**
5. Click **"Save"**
6. Wait 2-3 minutes
7. Your app is live at: `https://YOUR-USERNAME.github.io/FlatSplit/`

---

### Step 4 — Open on Phone and Install

**Android (Chrome):**
1. Open `https://YOUR-USERNAME.github.io/FlatSplit/` in Chrome
2. A banner appears at the bottom — tap **"Install"**
3. OR tap menu ⋮ → "Add to Home Screen"
4. App icon appears on your home screen ✅

**iPhone (Safari):**
1. Open the URL in **Safari** (must be Safari, not Chrome)
2. Tap the **Share button** (box with arrow)
3. Tap **"Add to Home Screen"**
4. Tap **"Add"**
5. App icon appears ✅

---

### Step 5 — Enable Notifications

When you open the app it will ask for notification permission.
Tap **"Allow"** → notifications will now work! ✅

---

## ✅ What Works After Hosting

| Feature | Before (local file) | After (GitHub Pages) |
|---|---|---|
| Install to home screen | ❌ | ✅ |
| Real app icon | ❌ | ✅ |
| Full screen (no browser bar) | ❌ | ✅ |
| Notifications | ❌ Blocked | ✅ Works |
| Works offline | ❌ | ✅ |
| Shareable link | ❌ | ✅ |
| Firebase sync | ✅ | ✅ |

---

## 🔗 Share With Flatmates

Once deployed, just share the link:
```
https://YOUR-USERNAME.github.io/FlatSplit/
```

Anyone who opens it can:
- Install it to their phone
- Log in with their PIN
- See all expenses in real time

---

## 🔔 How Notifications Work Now

With HTTPS hosting notifications work fully:

| Notification type | When it fires |
|---|---|
| New expense added | Immediately when admin adds one |
| Due reminder | When admin taps "🔔 Remind" |
| Reminder alarm | At the exact date+time you set |
| Weekly summary | Every Monday |
| Monthly summary | Every 1st of month |

---

## ⚙️ Technical Details

**manifest.json** — Tells the browser:
- App name and short name
- Icons to use
- Open in standalone mode (no browser bar)
- Theme color

**sw.js** — Service Worker:
- Caches all files for offline use
- Handles push notification display
- Wakes up in background for periodic checks
- Serves cached files when offline

---

## 💡 Tips

- GitHub Pages takes 2-5 minutes to go live after first upload
- If you update files, changes appear in 1-2 minutes
- The URL is permanent and free forever
- Firebase still syncs in real time across all devices
