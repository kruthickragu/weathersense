import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WeatherScreen from './components/WeatherScreen';
import DailyPlannerScreen from './components/DailyPlanner';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

function AppWrapper() {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#1a237e', '#311b92', '#4527a0']}
      style={{ flex: 1, paddingBottom: insets.bottom }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: 'rgba(26, 35, 126, 0.8)',
                borderTopWidth: 0,
                height: 25 + insets.bottom, // ensure enough space at bottom
              },
              tabBarActiveTintColor: '#bb86fc',
              tabBarInactiveTintColor: '#a8a8d9',
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
              },
            }}
            sceneContainerStyle={{ backgroundColor: 'transparent' }}
          >
            <Tab.Screen
              name="Weather"
              component={WeatherScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialIcons name="wb-sunny" size={28} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Daily Planner"
              component={DailyPlannerScreen}
              options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="event-note" size={28} color={color} />
                  ),
                }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppWrapper />
    </SafeAreaProvider>
  );
}
