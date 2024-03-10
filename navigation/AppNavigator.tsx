import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ExploreScreen from '../screens/ExploreScreen';
import SplashScreen from '../screens/SplashScreen';
import LogoTitle from './LogoTitle';
const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }} // Hide the header for the splash screen
      />
      <Stack.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          headerStyle: { backgroundColor: '#191A28', height: 90 },
          headerLeft: () => <LogoTitle />,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
