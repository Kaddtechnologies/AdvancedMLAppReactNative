@echo off
echo Setting up Fastlane for Firebase App Distribution...

echo Installing Bundler...
gem install bundler

echo Installing dependencies...
bundle install

echo Installing Firebase App Distribution plugin...
fastlane add_plugin firebase_app_distribution

echo Setup complete!
echo.
echo To deploy to Firebase App Distribution, run:
echo bundle exec fastlane android deploy_to_firebase
echo.
echo To build only without deploying, run:
echo bundle exec fastlane android build
echo.
pause
