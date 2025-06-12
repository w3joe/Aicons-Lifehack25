import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image } from 'react-native';
import CourseScreen from './screens/CourseScreen';
import HomeScreen from './screens/HomeScreen';


const Tab = createBottomTabNavigator();

export default function App() {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconSource;

            if (route.name === 'Home') {
              iconSource = require('../assets/images/home.png');
            }

            return (
              <Image
                source={iconSource}
                style={{
                  width: size,
                  height: size,
                  tintColor: focused ? '#007AFF' : 'gray',
                }}
              />
            );
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Course" component={CourseScreen} />
      </Tab.Navigator>
  );
}
