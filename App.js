import {
  View,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Text,
  Dimensions,
} from 'react-native';
import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {WebView} from 'react-native-webview';

const App = () => {
  StatusBar.setBarStyle('light-content', true);
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  const ActivityIndicatorElement = () => {
    //making a view to show to while loading the webpage
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}>
        <ActivityIndicator color="#fed034" size="large" />
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#000',
      }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <WebView
        source={{uri: 'https://fritochicken.com/'}}
        javaScriptEnabled={true}
        //For the Cache
        domStorageEnabled={true}
        //View to show while loading the webpage
        renderLoading={() => <ActivityIndicatorElement />}
        //Want to show the view or not
        startInLoadingState={true}
        // style={{
        //   marginTop: 20,
        //   width: Dimensions.get('window').width,
        //   height: Dimensions.get('window').height,
        // }}
      />
    </SafeAreaView>
  );
};

export default App;
