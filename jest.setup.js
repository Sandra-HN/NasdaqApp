jest.mock('react-native-webview', () =>
  require('./__mocks__/reactNativeWebview'),
);
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
