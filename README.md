# AdvancedML Testing Metrics Mobile App

A comprehensive mobile application for testing and tracking ML learning and personalization in the Deacons chat system. This app provides tools to measure, visualize, and verify that the AI is getting smarter over time through structured testing methodologies.

## Features

- **Baseline Testing**: Establish initial AI performance metrics
- **Progressive Information Sharing**: Share personal information with the AI in structured sessions
- **Recall Testing**: Test AI's ability to remember shared information
- **Cross-Session Persistence**: Verify information retention across sessions
- **Contextual Understanding**: Test AI's ability to understand context and make inferences
- **Comprehensive Metrics**: Track personalization, recall, relevance, and naturalness
- **Analytics Dashboard**: Visualize learning progress over time
- **Data Export**: Export test results and metrics for further analysis

## Technical Stack

- **Framework**: React Native with Expo
- **State Management**: React Context API
- **Storage**: Expo SecureStore
- **API Integration**: Axios
- **Authentication**: Firebase
- **UI Components**: Custom components with gradient styling
- **Charts**: Victory Native

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/advancedmlappreactnative.git
   cd advancedmlappreactnative
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Download the required font files:

   - Download Poppins font files (Light, Regular, Medium, SemiBold) from Google Fonts
   - Place them in the `assets/fonts` directory

4. Start the development server:

   ```
   npm start
   ```

5. Run on a device or emulator:
   - Press `a` to run on Android
   - Press `i` to run on iOS
   - Scan the QR code with Expo Go app on your device

## Project Structure

- `/app`: Main application screens and navigation
- `/components`: Reusable UI components
- `/constants`: Theme, colors, and other constants
- `/contexts`: React Context for state management
- `/services`: API services and data management
- `/utils`: Utility functions
- `/assets`: Static assets like fonts and images

## Testing Methodology

The app implements a structured testing methodology to measure AI learning:

1. **Baseline Testing**: Establish initial performance metrics
2. **Progressive Information Sharing**: Share information in structured sessions
3. **Recall Testing**: Test direct and indirect recall of shared information
4. **Cross-Session Persistence**: Test information retention across sessions
5. **Contextual Understanding**: Test inference and context awareness
6. **Quantitative Measurement**: Track metrics over time

## API Integration

The app integrates with the following API endpoints:

- Chat API: `/api/Chat/send`, `/api/Chat/history/{conversationId}`, etc.
- ML API: `/api/ML/sentiment`, `/api/ML/classify`, `/api/ML/analyze-conversation`

## License

This project is licensed under the 0BSD License.

## Acknowledgements

- Deacons Ministry for the chat system
- Expo team for the excellent React Native tooling
- The React Native community for their support and contributions
