import {View, ActivityIndicator, SafeAreaView} from 'react-native';
import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {WebView} from 'react-native-webview';

const App = () => {
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
        <ActivityIndicator color="#35d1fd" size="large" />
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        source={{uri: 'https://zooptie.com/'}}
        javaScriptEnabled={true}
        //For the Cache
        domStorageEnabled={true}
        //View to show while loading the webpage
        renderLoading={() => <ActivityIndicatorElement />}
        //Want to show the view or not
        startInLoadingState={true}
      />
    </SafeAreaView>
  );
};

export default App;
