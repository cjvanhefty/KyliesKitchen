# Kylie's Kitchen

A cookbook web app for storing recipes with photos and videos. Built with React, TypeScript, Vite, and Dexie (IndexedDB). The same app runs as a native iOS app via Capacitor.

## Development (web)

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build
```

Output is in `dist/`. For iOS, sync the build into the native project:

```bash
npx cap sync ios
```

## Running on iPhone

You need a **Mac with Xcode** and your iPhone connected.

1. **Install Xcode** from the Mac App Store (free).
2. **Install CocoaPods** (if not already installed):
   ```bash
   sudo gem install cocoapods
   ```
3. **Build the web app** (on any machine):
   ```bash
   npm run build
   ```
4. **Sync to iOS** (on the Mac, in this repo):
   ```bash
   npx cap sync ios
   ```
5. **Open the iOS project in Xcode**:
   ```bash
   open ios/App/App.xcworkspace
   ```
   (Do not open `App.xcodeproj`; use the `.xcworkspace` file.)
6. **Select your iPhone** as the run target (top toolbar), connect the phone via USB, and tap **Run** (or press Cmd+R).
7. **Trust the developer** on the iPhone: if the app won’t open, go to Settings → General → VPN & Device Management and trust your Apple ID.

**Signing:** Use your Apple ID (free) for development. In Xcode: select the **App** project → **Signing & Capabilities** → choose your Team (your Apple ID). With a free account, the app will need to be reinstalled from Xcode about every 7 days.

**Common issues:**
- **“Skipping pod install because CocoaPods is not installed”** – Install CocoaPods (step 2) and run `npx cap sync ios` again.
- **Code signing errors** – Ensure you’ve selected a valid Team and that the bundle ID is unique.
- **“Untrusted developer” on device** – Trust your developer certificate in Settings → General → VPN & Device Management.

## Tech stack

- React 18, TypeScript, Vite
- React Router
- Dexie (IndexedDB) for recipes and media
- Capacitor for iOS (Camera plugin for native photo capture)
