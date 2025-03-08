# Android Build Configuration

This directory contains the Android-specific configuration for the React Native app.

## Release Keystore

A release keystore has been created for signing the release builds. The keystore is located at:

- `app/release.keystore`

The keystore password is: `t3b3l8a1`

## Fastlane Setup

Fastlane is configured to automate the build and deployment process. See the [Fastlane README](fastlane/README.md) for more details.

### Quick Setup

Run the setup script to install all required dependencies:

```bash
setup_fastlane.bat
```

### Manual Deployment

To manually deploy to Firebase App Distribution:

```bash
cd android
bundle exec fastlane android deploy_to_firebase
```

## GitHub Actions Integration

A GitHub Actions workflow is set up to automatically build and deploy the app to Firebase App Distribution when changes are pushed to the `main` branch.

### Setting Up GitHub Actions

1. Generate the base64-encoded keystore:

   ```bash
   generate_keystore_base64.bat
   ```

2. Add the required secrets to your GitHub repository:

   - `KEYSTORE_BASE64`: The base64-encoded keystore (from step 1)
   - `FIREBASE_APP_ID`: Your Firebase App ID (from .env file)
   - `FIREBASE_CLI_TOKEN`: Your Firebase CLI token (from .env file)
   - `FIREBASE_GROUPS`: Firebase distribution groups (from .env file)

3. Push changes to the `main` branch to trigger the workflow.

See the [GitHub Actions README](.github/workflows/README.md) for more details.
