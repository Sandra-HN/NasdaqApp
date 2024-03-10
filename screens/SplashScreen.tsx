import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface Props {
  navigation: StackNavigationProp<any>;
}

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Explore');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/nasdaq-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.developerContainer}>
        <Text style={styles.developerName}>By</Text>
        <Text style={styles.developerName}>Sandra Hnaidy</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F202F',
  },
  logo: {
    width: 158,
    height: 45,
    tintColor: '#FFFFFF',
  },
  developerContainer: {
    position: 'absolute',
    bottom: 37,
  },
  developerName: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 21,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'DMSans-Regular',
  },
});

export default SplashScreen;
