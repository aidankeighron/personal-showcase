# Personal Showcase

A comprehensive gallery application for organizing and displaying your favorite photos, videos, and websites. This app serves as a centralized hub for your media, allowing for easy access and elegant presentation without the clutter of a standard camera roll. It supports adding content from your device library or via URL for websites.

## Features

- **Media Gallery**: View your photos and videos in a clean, masonry-style grid layout.
- **Website Bookmarks**: Add and access your favorite websites directly within the app.
- **Fullscreen Viewing**: Seamless fullscreen support for detailed viewing of images and playback of videos.
- **Persistent Storage**: Your selected media and links are saved locally, ensuring your gallery remains curated between sessions.
- **Cross-Platform**: Designed to work smoothly on both Android and iOS devices.

## Setup

To get this project up and running on your local machine, follow these steps:

1. **Install dependencies**:
   ```bash
   npm install
   ```

## How to Run

You can run the application on your preferred platform using the following commands:

- **Start the development server**:
  ```bash
  npm start
  ```
  This will launch the Expo development server, allowing you to run the app on a connected device or simulator.

- **Run on Android**:
  ```bash
  npm run android
  ```
  (Ensure you have an Android emulator running or a device connected via USB with USB debugging enabled).

- **Run on iOS**:
  ```bash
  npm run ios
  ```
  (Requires a Mac with Xcode and an iOS simulator or device).

- **Run on Web**:
  ```bash
  npm run web
  ```

## Build

To build the application for distribution (e.g., Android APK):

```bash
eas build -p android --profile preview
```
