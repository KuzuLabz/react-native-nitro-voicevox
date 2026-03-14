# Example App

## Getting Started

Before building/running the example app, some additional setup is required.

### Dictionary
1. Download OpenJTalk and create a zip containing the dict files called "OpenJTalk.zip"
2. Place the zip in /assets

### Voice Model
1. Download a vvm model. `0.vvm` is used in this example.
2. Place the model file in /assets/models
3. If not using `0.vvm`, change the require import in `/src/utils/model.ts -> getLocalModel()` to the correct filename.

## Building
### Android
```bash
bun run android
```

### iOS
```bash
bun run ios
```