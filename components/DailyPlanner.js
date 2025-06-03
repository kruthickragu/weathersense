import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function DailyPlannerScreen() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hydration, setHydration] = useState(0);
  const [uvIndex, setUvIndex] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [sunTimes, setSunTimes] = useState(null);
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    fetchWeatherData();
  }, []);
    // Added hydration goal alert effect
  useEffect(() => {
    if (hydration >= 2000) {
      Alert.alert(
        "Hydration Goal Achieved!",
        "Great job! You've reached your daily water intake goal. Stay hydrated!",
        [
          {
            text: "OK",
            onPress: () => resetHydration()
          }
        ]
      );
    }
  }, [hydration]);


  const fetchWeatherData = async () => {
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
      
      // Reverse geocoding to get city name
      const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (reverseGeocode[0]?.city) {
        setLocationName(reverseGeocode[0].city);
      } else if (reverseGeocode[0]?.region) {
        setLocationName(reverseGeocode[0].region);
      } else {
        setLocationName("Your Location");
      }
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto`
      );
      const data = await response.json();
      
      if (!data.current || !data.daily) throw new Error('Invalid weather data');
      
      setWeatherData(data);
      setUvIndex(data.daily.uv_index_max[0]);
      
      // Calculate Air Quality Index based on weather data
      const humidity = data.current.relative_humidity_2m;
      const windSpeed = data.current.wind_speed_10m;
      const pressure = data.current.pressure_msl;
      
      // Simple AQI calculation based on meteorological factors
      let aqi = 50; // Base moderate level
      
      // Humidity factor (higher humidity can trap pollutants)
      if (humidity > 80) aqi += 20;
      else if (humidity < 30) aqi += 10;
      
      // Wind factor (higher wind disperses pollutants)
      if (windSpeed < 5) aqi += 15;
      else if (windSpeed > 15) aqi -= 10;
      
      // Pressure factor (low pressure can increase pollution concentration)
      if (pressure < 1010) aqi += 10;
      else if (pressure > 1020) aqi -= 5;
      
      // Keep AQI in realistic range
      aqi = Math.max(10, Math.min(150, aqi));
      setAirQuality(Math.round(aqi));
      
      setSunTimes({
        sunrise: data.daily.sunrise[0],
        sunset: data.daily.sunset[0]
      });
      
    } catch (err) {
      console.error(err);
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

 const addHydration = (amount) => {
    setHydration(prev => Math.min(prev + amount, 2000));
  };

  const resetHydration = () => {
    setHydration(0);
  };

  const getUvRisk = (index) => {
    if (index <= 2) return { level: 'Low', color: '#4CAF50' };
    if (index <= 5) return { level: 'Moderate', color: '#FFEB3B' };
    if (index <= 7) return { level: 'High', color: '#FF9800' };
    if (index <= 10) return { level: 'Very High', color: '#F44336' };
    return { level: 'Extreme', color: '#9C27B0' };
  };

  const getAirQualityRisk = (aqi) => {
    if (aqi <= 50) return { level: 'Good', color: '#4CAF50', desc: 'Air quality is satisfactory' };
    if (aqi <= 100) return { level: 'Moderate', color: '#FFEB3B', desc: 'Air quality is acceptable' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive', color: '#FF9800', desc: 'Sensitive people may experience symptoms' };
    return { level: 'Unhealthy', color: '#F44336', desc: 'Everyone may experience health effects' };
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <LinearGradient colors={['#1a237e', '#311b92', '#4527a0']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading daily planner...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#1a237e', '#311b92', '#4527a0']} style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchWeatherData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const uvRisk = uvIndex !== null ? getUvRisk(uvIndex) : null;
  const airQualityRisk = airQuality !== null ? getAirQualityRisk(airQuality) : null;

  return (
    <LinearGradient colors={['#1a237e', '#311b92', '#4527a0']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Added location name display */}
        <View style={styles.locationHeader}>
          <Text style={styles.title}>Daily Planner</Text>
          {locationName ? (
            <View style={styles.locationContainer}>
              <MaterialIcons name="location-on" size={18} color="#bb86fc" />
              <Text style={styles.locationText}>{locationName}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.subtitle}>Plan your day with weather insights</Text>
        
        {/* Sun Times */}
        {sunTimes && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sun Times</Text>
            <View style={styles.sunTimes}>
              <View style={styles.sunTime}>
                <MaterialIcons name="wb-sunny" size={30} color="#FFD700" />
                <Text style={styles.sunTimeLabel}>Sunrise</Text>
                <Text style={styles.sunTimeValue}>{formatTime(sunTimes.sunrise)}</Text>
              </View>
              <View style={styles.sunTime}>
                <MaterialIcons name="nights-stay" size={30} color="#1E90FF" />
                <Text style={styles.sunTimeLabel}>Sunset</Text>
                <Text style={styles.sunTimeValue}>{formatTime(sunTimes.sunset)}</Text>
              </View>
            </View>
          </View>
        )}
        
        {/* UV Index */}
        {uvRisk && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>UV Index</Text>
            <View style={styles.uvContainer}>
              <Text style={[styles.uvValue, { color: uvRisk.color }]}>{uvIndex.toFixed(1)}</Text>
              <Text style={[styles.uvLevel, { color: uvRisk.color }]}>{uvRisk.level} Risk</Text>
            </View>
            <Text style={styles.recommendation}>
              {uvIndex <= 2 
                ? "UV exposure is low. No protection needed." 
                : uvIndex <= 5 
                  ? "Moderate UV exposure. Seek shade during midday hours." 
                  : uvIndex <= 7 
                    ? "High UV exposure. Wear sunscreen and protective clothing."
                    : "Very high UV exposure. Avoid sun exposure between 10am-4pm."}
            </Text>
          </View>
        )}
        
        {/* Air Quality Index */}
        {airQualityRisk && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Air Quality Index</Text>
            <View style={styles.airQualityContainer}>
              <Text style={[styles.airQualityValue, { color: airQualityRisk.color }]}>{airQuality}</Text>
              <View>
                <Text style={[styles.airQualityLevel, { color: airQualityRisk.color }]}>{airQualityRisk.level}</Text>
                <Text style={styles.airQualityDesc}>{airQualityRisk.desc}</Text>
              </View>
            </View>
            <Text style={styles.recommendation}>
              {airQuality <= 50 
                ? "Great day for outdoor activities and exercise." 
                : airQuality <= 100 
                  ? "Good day for most outdoor activities." 
                  : airQuality <= 150 
                    ? "Sensitive individuals should limit prolonged outdoor activities."
                    : "Consider limiting outdoor activities, especially for sensitive groups."}
            </Text>
          </View>
        )}
        
        {/* Hydration Tracker */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hydration Tracker</Text>
          <View style={styles.hydrationContainer}>
            <Text style={styles.hydrationValue}>{hydration}ml</Text>
            <Text style={styles.hydrationGoal}>Goal: 2000ml</Text>
          </View>
          <View style={styles.hydrationProgress}>
            <LinearGradient
              colors={['#64b5f6', '#bb86fc']}
              style={[styles.hydrationFill, { width: `${(hydration / 2000) * 100}%` }]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </View>
          <View style={styles.hydrationButtons}>
            <TouchableOpacity 
              style={styles.hydrationButton} 
              onPress={() => addHydration(250)}
            >
              <Text style={styles.buttonText}>+250ml</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.hydrationButton} 
              onPress={() => addHydration(500)}
            >
              <Text style={styles.buttonText}>+500ml</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={resetHydration}
            >
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Daily Tips */}
        {weatherData && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today's Recommendations</Text>
            <View style={styles.tip}>
              <MaterialIcons name="wb-sunny" size={24} color="#FFD700" />
              <Text style={styles.tipText}>
                UV index is {uvRisk.level.toLowerCase()}. {uvIndex > 5 ? "Apply" : "Consider applying"} sunscreen SPF 30+.
              </Text>
            </View>
            <View style={styles.tip}>
              <MaterialIcons name="local-drink" size={24} color="#64b5f6" />
              <Text style={styles.tipText}>
                Drink plenty of water to stay hydrated in {weatherData.current.temperature_2m > 25 ? "warm" : "cool"} temperatures.
              </Text>
            </View>
            <View style={styles.tip}>
              <MaterialIcons name="air" size={24} color="#ffffff" />
              <Text style={styles.tipText}>
                Air quality is {airQualityRisk.level.toLowerCase()}. {airQuality > 100 ? "Consider indoor activities if you're sensitive to air pollution." : "Good conditions for outdoor activities."}
              </Text>
            </View>
            <View style={styles.tip}>
              <MaterialIcons name="cloud" size={24} color="#ffffff" />
              <Text style={styles.tipText}>
                {weatherData.daily.precipitation_sum[0] > 0 
                  ? `Expect ${weatherData.daily.precipitation_sum[0]}mm of rain today. Don't forget your umbrella!`
                  : "No precipitation expected. Enjoy the dry weather!"}
              </Text>
            </View>
          </View>
        )}
        
        <TouchableOpacity style={styles.refreshButton} onPress={fetchWeatherData}>
          <MaterialIcons name="refresh" size={28} color="#ffffff" />
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
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
  title: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '800',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#bbbbff',
    marginBottom: 25,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    color: '#bb86fc',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  sunTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sunTime: {
    alignItems: 'center',
    width: '45%',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
  },
  sunTimeLabel: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
  },
  sunTimeValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 5,
  },
  uvContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  uvValue: {
    fontSize: 32,
    fontWeight: '700',
    marginRight: 15,
  },
  uvLevel: {
    fontSize: 18,
    fontWeight: '600',
  },
  airQualityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  airQualityValue: {
    fontSize: 32,
    fontWeight: '700',
    marginRight: 15,
  },
  airQualityLevel: {
    fontSize: 18,
    fontWeight: '600',
  },
  airQualityDesc: {
    fontSize: 14,
    color: '#bbbbff',
    marginTop: 2,
  },
  recommendation: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
  },
  hydrationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  hydrationValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
  },
  hydrationGoal: {
    color: '#bbbbff',
    fontSize: 16,
  },
  hydrationProgress: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  hydrationFill: {
    height: '100%',
    borderRadius: 5,
  },
  hydrationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hydrationButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: '30%',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#bb86fc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  resetText: {
    color: '#bb86fc',
    fontWeight: '600',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  tipText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
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
   locationHeader: {
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    color: '#bb86fc',
    fontSize: 16,
    marginLeft: 5,
  },
});