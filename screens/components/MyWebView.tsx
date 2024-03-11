import React, { useEffect } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface MyWebViewProps {
  uri: string | null;
  isVisible: boolean;
  onClose: () => void;
}

const MyWebView: React.FC<MyWebViewProps> = ({ uri, isVisible, onClose }) => {
  useEffect(() => {
    console.log(uri, isVisible);
  }, [uri, isVisible]);

  return (
    <Modal visible={isVisible} onRequestClose={onClose} animationType="slide">
      <View
        style={{
          backgroundColor: '#444445',
          flex: 1,
        }}
      >
        <View style={{ alignItems: 'flex-end', width: '100%', height: 31 }}>
          <TouchableOpacity
            style={{
              width: '100%',
              backgroundColor: '#444445',
              justifyContent: 'center',
              alignItems: 'center',
              height: 31,
            }}
            onPress={onClose}
          ></TouchableOpacity>
        </View>
        <WebView
          originWhitelist={['*']}
          source={uri ? { uri } : { html: '<h1><center>Website</center></h1>' }}
          style={{ flex: 0.99 }}
        />
      </View>
    </Modal>
  );
};

export default MyWebView;
