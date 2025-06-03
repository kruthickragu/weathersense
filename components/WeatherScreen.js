import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image, ActivityIndicator, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import icon from '../assets/icon.png';

export default function WeatherScreen() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setLoading(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      
      // Reverse geocode to get city name
      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
      setCity(address.city || address.region || "Current Location");

      // Fetch weather data
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,apparent_temperature&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
      );
      const data = await response.json();
      
      if (!data.current) throw new Error('Invalid weather data');
      setWeather(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  // Get weather icon based on WMO code
  const getWeatherIcon = (code) => {
    switch (code) {
      case 0: return '☀️'; // Clear sky
      case 1: case 2: case 3: return '🌤️'; // Mainly clear, partly cloudy
      case 45: case 48: return '🌫️'; // Fog
      case 51: case 53: case 55: return '🌦️'; // Drizzle
      case 56: case 57: return '🌧️❄️'; // Freezing Drizzle
      case 61: case 63: case 65: return '🌧️'; // Rain
      case 66: case 67: return '🌧️🧊'; // Freezing Rain
      case 71: case 73: case 75: return '❄️'; // Snow
      case 77: return '🌨️'; // Snow grains
      case 80: case 81: case 82: return '⛈️'; // Rain showers
      case 85: case 86: return '❄️🌨️'; // Snow showers
      case 95: case 96: case 99: return '⛈️'; // Thunderstorm
      default: return '🌡️'; // Default
    }
  };

  // Get weather description
  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Heavy thunderstorm'
    };
    return descriptions[code] || 'Unknown weather';
  };

  // Format time
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <LinearGradient 
      colors={['#1a237e', '#311b92', '#4527a0']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!weather && !loading && (
          <View style={styles.welcomeContainer}>
            <Image source={icon} style={styles.icon} />
            <Text style={styles.title}> WeatherSense</Text>
            <Text style={styles.subtitle}>Your premium weather companion</Text>
            <Text style={styles.description}>
              Get accurate forecasts and real-time weather updates for your location
            </Text>
            <TouchableOpacity style={styles.button} onPress={fetchWeather}>
              <Text style={styles.buttonText}>Get Current Weather</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Detecting your location...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={48} color="#ff6b6b" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchWeather}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {weather && city && (
          <View style={styles.weatherContainer}>
            {/* Location Header */}
            <View style={styles.locationHeader}>
              <MaterialIcons name="location-on" size={24} color="#ffffff" />
              <Text style={styles.cityText}>{city}</Text>
            </View>

            {/* Current Weather */}
            <View style={styles.currentWeatherCard}>
              <Text style={styles.currentDate}>{formatDate(weather.current.time)}</Text>
              <Text style={styles.currentTemp}>{weather.current.temperature_2m}°</Text>
              <Text style={styles.feelsLike}>
                Feels like: {weather.current.apparent_temperature}°
              </Text>
              
              <View style={styles.weatherCondition}>
                <Text style={styles.weatherIcon}>
                  {getWeatherIcon(weather.current.weather_code)}
                </Text>
                <Text style={styles.weatherDesc}>
                  {getWeatherDescription(weather.current.weather_code)}
                </Text>
              </View>
              
              <View style={styles.weatherStats}>
                <View style={styles.statItem}>
                  <MaterialIcons name="air" size={20} color="#ffffff" />
                  <Text style={styles.statText}>{weather.current.wind_speed_10m} km/h</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialIcons name="opacity" size={20} color="#ffffff" />
                  <Text style={styles.statText}>{weather.current.relative_humidity_2m}%</Text>
                </View>
              </View>
            </View>

            {/* Today's Highlights */}
            <Text style={styles.sectionTitle}>Today's Highlights</Text>
            <View style={styles.highlightsContainer}>
              <View style={styles.highlightCard}>
                <Text style={styles.highlightTitle}>Sunrise & Sunset</Text>
                <View style={styles.sunTimes}>
                  <View style={styles.sunTime}>
                    <MaterialIcons name="wb-sunny" size={24} color="#FFD700" />
                    <Text style={styles.sunTimeText}>
                      {formatTime(weather.daily.sunrise[0])}
                    </Text>
                  </View>
                  <View style={styles.sunTime}>
                    <MaterialIcons name="nights-stay" size={24} color="#1E90FF" />
                    <Text style={styles.sunTimeText}>
                      {formatTime(weather.daily.sunset[0])}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.highlightCard}>
                <Text style={styles.highlightTitle}>Temperature Range</Text>
                <View style={styles.tempRange}>
                  <Text style={styles.tempMin}>{weather.daily.temperature_2m_min[0]}°</Text>
                  <View style={styles.tempBarContainer}>
                    <View style={styles.tempBar}>
                      <LinearGradient
                        colors={['#64b5f6', '#bb86fc']}
                        style={[styles.tempFill, { width: '70%' }]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                      />
                    </View>
                  </View>
                  <Text style={styles.tempMax}>{weather.daily.temperature_2m_max[0]}°</Text>
                </View>
              </View>
            </View>

            {/* Hourly Forecast */}
            <Text style={styles.sectionTitle}>Hourly Forecast</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hourlyContainer}
            >
              {weather.hourly.time.slice(0, 12).map((time, index) => (
                <View key={index} style={styles.hourlyCard}>
                  <Text style={styles.hourlyTime}>
                    {formatTime(time)}
                  </Text>
                  <Text style={styles.hourlyIcon}>
                    {getWeatherIcon(weather.hourly.weather_code[index])}
                  </Text>
                  <Text style={styles.hourlyTemp}>
                    {weather.hourly.temperature_2m[index]}°
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Daily Forecast */}
            <Text style={styles.sectionTitle}>7-Day Forecast</Text>
            <View style={styles.dailyContainer}>
              {weather.daily.time.slice(0, 7).map((time, index) => (
                <View key={index} style={styles.dailyItem}>
                  <Text style={styles.dailyDay}>{formatDate(time)}</Text>
                  <Text style={styles.dailyIcon}>
                    {getWeatherIcon(weather.daily.weather_code[index])}
                  </Text>
                  <View style={styles.dailyTemps}>
                    <Text style={styles.dailyTempHigh}>
                      {weather.daily.temperature_2m_max[index]}°
                    </Text>
                    <Text style={styles.dailyTempLow}>
                      {weather.daily.temperature_2m_min[index]}°
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {(weather || error) && (
          <TouchableOpacity style={styles.refreshButton} onPress={fetchWeather}>
            <MaterialIcons name="refresh" size={28} color="#ffffff" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#bbbbff',
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ccccff',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 18,
    marginVertical: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  weatherContainer: {
    marginTop: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cityText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '700',
    marginLeft: 8,
  },
  currentWeatherCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  currentDate: {
    color: '#e0e0ff',
    fontSize: 16,
    marginBottom: 5,
  },
  currentTemp: {
    fontSize: 80,
    color: '#ffffff',
    fontWeight: '200',
    marginVertical: 5,
  },
  feelsLike: {
    color: '#bbbbff',
    fontSize: 16,
    marginBottom: 15,
  },
  weatherCondition: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  weatherIcon: {
    fontSize: 40,
    marginRight: 10,
  },
  weatherDesc: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
  },
  weatherStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 5,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    marginLeft: 5,
  },
  highlightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  highlightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    width: '48%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  highlightTitle: {
    color: '#e0e0ff',
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '500',
  },
  sunTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sunTime: {
    alignItems: 'center',
  },
  sunTimeText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 5,
  },
  tempRange: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tempMin: {
    color: '#64b5f6',
    fontSize: 16,
    fontWeight: '500',
  },
  tempMax: {
    color: '#ff5252',
    fontSize: 16,
    fontWeight: '500',
  },
  tempBarContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  tempBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  tempFill: {
    height: '100%',
    borderRadius: 3,
  },
  hourlyContainer: {
    paddingBottom: 10,
  },
  hourlyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginRight: 12,
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  hourlyTime: {
    color: '#e0e0ff',
    fontSize: 14,
    marginBottom: 5,
  },
  hourlyIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  hourlyTemp: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
  },
  dailyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dailyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dailyDay: {
    color: '#ffffff',
    fontSize: 16,
    width: '40%',
  },
  dailyIcon: {
    fontSize: 24,
    width: '20%',
    textAlign: 'center',
  },
  dailyTemps: {
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'flex-end',
  },
  dailyTempHigh: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    width: 40,
    textAlign: 'right',
  },
  dailyTempLow: {
    color: '#bbbbff',
    fontSize: 16,
    width: 40,
    textAlign: 'right',
  },
  refreshButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#6200ee',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  icon: {
    width: 100,
    borderRadius: 15,
    height: 100,
  },
});