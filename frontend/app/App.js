/*import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import React from 'react';

import { Image } from 'react-native';
import CourseScreen from './screens/CourseScreen';
import HomeScreen from './screens/HomeScreen';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


export default function App() {
  return (
      <NavigationContainer
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
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Course" component={CourseScreen} />
      </NavigationContainer>
  );
}*/
