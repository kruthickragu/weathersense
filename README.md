# WeatherSense 🌤️

Your premium weather companion - A beautiful React Native weather app that provides accurate forecasts, real-time weather updates, and daily planning insights for your location.

## Features

### 🌡️ Weather Screen
- **Real-time Weather Data**: Current temperature, humidity, wind speed, and weather conditions
- **Location-based Forecasts**: Automatic location detection with city name display
- **Hourly Forecast**: 12-hour detailed weather predictions
- **7-Day Forecast**: Weekly weather outlook with temperature ranges
- **Today's Highlights**: Sunrise/sunset times and temperature range visualization
- **Interactive UI**: Beautiful gradient design with weather icons and animations

### 📅 Daily Planner Screen
- **UV Index Monitoring**: Real-time UV risk assessment with safety recommendations
- **Air Quality Index**: Estimated air quality based on meteorological factors
- **Hydration Tracker**: Track daily water intake with goal achievement alerts
- **Sun Times**: Precise sunrise and sunset times for your location
- **Smart Recommendations**: Personalized daily tips based on weather conditions
- **Location Awareness**: Displays current city/region information

## Screenshots

The app features a stunning dark gradient design with:
- Modern glassmorphism UI elements
- Intuitive weather icons and visualizations
- Smooth animations and transitions
- Responsive layout for all screen sizes

## Technology Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and runtime
- **Open-Meteo API**: Free weather data service
- **Expo Location**: GPS and geocoding services
- **Expo Linear Gradient**: Beautiful gradient backgrounds
- **Material Icons**: Consistent icon design

## Prerequisites

Before running this application, make sure you have:

- Node.js (version 14 or higher)
- npm or yarn package manager
- Expo CLI installed globally: `npm install -g expo-cli`
- Expo Go app on your mobile device (for testing)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weathersense.git
   cd weathersense
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install required Expo packages**
   ```bash
   expo install expo-location expo-linear-gradient @expo/vector-icons
   ```

## Running the App

1. **Start the Expo development server**
   ```bash
   expo start
   # or
   npm start
   ```

2. **Run on your device**
   - Scan the QR code with Expo Go app (Android) or Camera app (iOS)
   - Or use an emulator: press `a` for Android or `i` for iOS

## Key Components

### WeatherScreen.js
- Main weather interface with current conditions
- Hourly and daily forecasts
- Location detection and weather data fetching
- Beautiful UI with gradient backgrounds

### DailyPlannerScreen.js
- Health and wellness insights
- UV index and air quality monitoring
- Hydration tracking with goal alerts
- Personalized daily recommendations

## API Integration

The app uses the **Open-Meteo API** for weather data:
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Data**: Temperature, humidity, precipitation, UV index, and more
- **Free**: No API key required
- **Coverage**: Global weather data

## Permissions

The app requires the following permissions:
- **Location Access**: To determine your current position for accurate weather data
- Permissions are requested automatically when the app starts

## Features in Detail

### Weather Monitoring
- Current temperature with "feels like" temperature
- Wind speed and direction
- Humidity levels
- Weather condition descriptions with emoji icons
- Precipitation forecasts

### Health & Wellness
- **UV Protection**: Real-time UV index with risk levels (Low, Moderate, High, Very High, Extreme)
- **Air Quality**: Estimated AQI based on meteorological conditions
- **Hydration Goals**: Track daily water intake up to 2000ml target
- **Activity Planning**: Smart recommendations for outdoor activities

### User Experience
- **Intuitive Design**: Clean, modern interface with glassmorphism effects
- **Real-time Updates**: Refresh button for latest weather data
- **Error Handling**: Graceful error messages and retry functionality
- **Loading States**: Smooth loading animations

## Customization

### Styling
The app uses StyleSheet for consistent styling:
- Gradient backgrounds: `['#1a237e', '#311b92', '#4527a0']`
- Glassmorphism cards: `rgba(255, 255, 255, 0.15)`
- Color scheme: Purple gradients with white text

### Weather Icons
Weather conditions are displayed using emoji icons:
- Clear sky: ☀️
- Partly cloudy: 🌤️
- Rain: 🌧️
- Snow: ❄️
- Thunderstorm: ⛈️

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Location Permission Denied**
   - Ensure location services are enabled on your device
   - Grant location permission when prompted

2. **Weather Data Not Loading**
   - Check your internet connection
   - Try refreshing the data using the refresh button

3. **App Not Starting**
   - Make sure all dependencies are installed: `npm install`
   - Clear Expo cache: `expo r -c`

## Future Enhancements

- [ ] Weather alerts and notifications
- [ ] Historical weather data
- [ ] Multiple location support
- [ ] Weather radar integration
- [ ] Clothing recommendations
- [ ] Pollen count monitoring
- [ ] Social sharing features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Open-Meteo](https://open-meteo.com/) for providing free weather API
- [Expo](https://expo.dev/) for the excellent development platform
- [Material Design Icons](https://materialdesignicons.com/) for beautiful icons

## Contact

For questions or support, please contact:
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

Made with ❤️ using React Native and Expo