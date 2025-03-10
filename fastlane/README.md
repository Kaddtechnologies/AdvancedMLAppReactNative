fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android determine_release_name

```sh
[bundle exec] fastlane android determine_release_name
```

Determine release name and increment version

### android build

```sh
[bundle exec] fastlane android build
```

Build the Android app using gradlew

### android deploy_to_firebase

```sh
[bundle exec] fastlane android deploy_to_firebase
```

Deploy to Firebase App Distribution

### android simple_build

```sh
[bundle exec] fastlane android simple_build
```

Simple build without deployment - for testing build configuration

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
