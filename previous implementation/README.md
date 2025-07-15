# Music Game App

A React Native/Expo application that combines music and gaming elements to create an interactive music experience.

## 🚀 Features

### Authentication
- **Login Screen**: Secure user authentication with email/password
- **Signup Screen**: New user registration with validation
- **Profile Screen**: User profile management and settings

### Main Screens
1. **Home Screen** (`Home.tsx`)
   - Main dashboard of the application
   - Displays available tracks and games
   - Navigation to different game modes
   - User progress tracking

2. **Track Play Screen** (`TrackPlayScreen.tsx`)
   - Music playback interface
   - Game integration with music
   - Interactive controls
   - Progress tracking

3. **QR Code Screens** (`QRCode.tsx`, `QRCodeScreen2.tsx`)
   - QR code generation for sharing
   - QR code scanning functionality
   - Social sharing features

### Components
1. **Intro Screens** (`IntroScreens.tsx`)
   - Onboarding experience
   - App introduction and features showcase
   - Interactive tutorials

2. **UI Components**
   - `DotsIndicator.tsx`: Progress indicator for multi-step processes
   - Custom buttons and input fields
   - Loading states and animations

## 🛠 Technical Stack

- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **UI/Styling**: NativeWind (TailwindCSS for React Native)
- **Animations**: React Native Reanimated
- **Media**: Expo AV for audio handling
- **Authentication**: Expo Auth Session
- **QR Code**: Expo Barcode Scanner

## 📱 Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
- iOS: `npm run ios`
- Android: `npm run android`
- Web: `npm run web`

## 🔧 Project Structure

```
src/
├── screens/          # Main application screens
├── components/       # Reusable UI components
├── navigation/       # Navigation configuration
├── store/           # Redux store setup
├── features/        # Feature-specific logic
└── types/           # TypeScript type definitions
```

## 🎮 Game Features

### Music Integration
- Spotify integration for music playback
- Custom audio processing
- Beat detection and synchronization

### Game Mechanics
- Interactive gameplay synchronized with music
- Score tracking and leaderboards
- Multiplayer capabilities through QR code sharing

### Social Features
- Share game sessions via QR codes
- Friend system integration
- Social media sharing

## 🔐 Authentication Flow

1. **User Registration**
   - Email/password validation
   - Profile creation
   - Initial preferences setup

2. **Login Process**
   - Secure authentication
   - Session management
   - Remember me functionality

3. **Profile Management**
   - User information updates
   - Game statistics
   - Achievement tracking

## 🎨 UI/UX Features

- Modern and intuitive interface
- Smooth animations and transitions
- Responsive design for various screen sizes
- Dark/Light mode support
- Loading states and error handling

## 📈 Performance Optimizations

- Efficient state management
- Optimized asset loading
- Caching strategies
- Memory management

## 🔄 Development Workflow

1. **Code Style**
   - TypeScript for type safety
   - ESLint for code quality
   - Prettier for code formatting

2. **Testing**
   - Component testing
   - Integration testing
   - Performance testing

3. **Deployment**
   - Expo build process
   - App store submission guidelines
   - Version management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- [Your Name/Team] - Lead Developer
- [Other Team Members]

## 🙏 Acknowledgments

- Expo team for the amazing framework
- React Native community
- All contributors and supporters 