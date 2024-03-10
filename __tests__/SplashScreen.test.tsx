import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import ExploreScreen from '../screens/ExploreScreen';
import '@testing-library/jest-native/extend-expect';

const Stack = createStackNavigator();

const MockNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const mockNavigate = jest.fn();

// Mock navigation object with a type assertion to `StackNavigationProp<any>`
const mockNavigation = {
  navigate: mockNavigate,
} as unknown as StackNavigationProp<any>;
describe('Splash', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockNavigate.mockClear();
  });

  it('navigates to Explore screen after 3 seconds', () => {
    render(<SplashScreen navigation={mockNavigation} />);

    // Fast-forward time by 3 seconds to trigger the timeout
    jest.advanceTimersByTime(3000);

    // Expect the navigate function to have been called with 'Explore'
    expect(mockNavigate).toHaveBeenCalledWith('Explore');
  });

  it('displays logo and developer name', () => {
    const { getByTestId } = render(
      <SplashScreen navigation={mockNavigation} />,
    );

    expect(getByTestId('logoImage')).toBeTruthy();
    expect(getByTestId('byText')).toHaveTextContent('Sandra Hnaidy');
  });
});
