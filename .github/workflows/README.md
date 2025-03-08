# GitHub Actions Workflow for Firebase App Distribution

This directory contains GitHub Actions workflow configurations for automating the deployment of the Android app to Firebase App Distribution.

## Firebase Deploy Workflow

The `firebase-deploy.yml` workflow automatically builds and deploys the Android app to Firebase App Distribution when changes are pushed to the `main` branch.

### Required Secrets

Before the workflow can run successfully, you need to set up the following secrets in your GitHub repository:

1. **KEYSTORE_BASE64**: The release.keystore file encoded in base64

   ```bash
   # Generate this value with:
   base64 -w 0 android/app/release.keystore
   ```

2. **FIREBASE_APP_ID**: Your Firebase App ID

   - This is the same value as in your .env file: `1:379368428708:android:74255229f37c30958ac231`

3. **FIREBASE_CLI_TOKEN**: Your Firebase CLI token

   - This is the same value as in your .env file

4. **FIREBASE_GROUPS**: Firebase distribution groups
   - This is the same value as in your .env file: `justmeonly`

### Setting Up Secrets

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add each of the secrets listed above

### Workflow Details

The workflow performs the following steps:

1. Sets up the build environment (Java, Ruby, Android SDK, Node.js)
2. Installs dependencies and Fastlane plugins
3. Decodes the keystore file from the KEYSTORE_BASE64 secret
4. Creates the necessary .env files with the GitHub secrets
5. Runs the Fastlane deploy_to_firebase lane
6. Uploads the built APK as an artifact for easy download

### Customizing the Workflow

You can customize the workflow by editing the `firebase-deploy.yml` file:

- Change the branch that triggers the workflow by modifying the `branches` section
- Adjust the Java, Ruby, or Node.js versions if needed
- Add additional steps or modify existing ones to suit your needs
