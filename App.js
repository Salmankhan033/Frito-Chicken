import {
  View,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  BackHandler,
  Platform,
  ImageBackground,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {WebView} from 'react-native-webview';

import NetInfo from '@react-native-community/netinfo';
import {Colors} from './assets/Colors';

const App = () => {
  const [isConnected, setConnected] = useState(true);
  const [refresh, setRefresh] = useState(false);

  StatusBar.setBarStyle('light-content', true);
  const webViewRef = useRef(null);
  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true; // prevent default behavior (exit app)
    }
    return false;
  };

  useEffect(() => {
    SplashScreen.hide();
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onAndroidBackPress,
        );
      };
    }
  }, []);
  useEffect(() => {
    const netInfroSubscribe = NetInfo.addEventListener(state => {
      setConnected(state.isConnected);
      // if (!state.isConnected) {
      //   alert('No connection');
      // }
    });
    return netInfroSubscribe;
  }, [refresh]);
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
        <ActivityIndicator color={Colors.App_Color} size="large" />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 0, backgroundColor: Colors.App_Color}} />
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={isConnected ? 'light-content' : 'dark-content'}
          backgroundColor={isConnected ? Colors.App_Color : Colors.white}
        />
        {!isConnected && (
          <View style={styles.noNetView}>
            <ImageBackground
              imageStyle={styles.iconBg}
              source={require('./assets/no_internet.png')}
              style={styles.imageStye}>
              <View style={styles.noConnectView}>
                <View style={styles.noConnectTextView}>
                  <Text style={styles.noConnectText}>Ooops!</Text>
                  <Text style={styles.noConnectSimpleText}>
                    No internet connection found.
                  </Text>
                  <Text style={styles.noConnectSimpleText}>
                    Check your connection and try again
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.btnStyle}
                  onPress={() => setRefresh(!refresh)}>
                  <Text style={styles.btnText}>Try again</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        )}
        {isConnected && (
          <WebView
            // source={{uri: 'https://app.socar.dev/'}}
            source={{uri: 'https://gethooptie.com/'}}
            javaScriptEnabled={true}
            ref={webViewRef}
            mediaPlaybackRequiresUserAction={false}
            //For the Cache
            domStorageEnabled={true}
            //View to show while loading the webpage
            renderLoading={() => <ActivityIndicatorElement />}
            //Want to show the view or not
            startInLoadingState={true}
            geolocationEnabled={true}
            scalesPageToFit
            allowsInlineMediaPlayback={true}
            javaScriptEnabledAndroid={true}
            allowFileAccess={true}
            originWhitelist={['*']}
          />
        )}
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  noNetView: {
    backgroundColor: Colors.white,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStye: {
    height: '100%',
    width: '100%',
  },
  iconBg: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  noConnectView: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1,
  },
  noConnectTextView: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noConnectText: {
    color: Colors.textColor,
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: '2%',
  },
  noConnectSimpleText: {
    color: Colors.textColor,
    fontSize: 18,
  },
  btnStyle: {
    backgroundColor: Colors.App_Color,
    paddingVertical: '3.5%',
    paddingHorizontal: '6%',

    marginTop: '30%',
  },
  btnText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default App;
