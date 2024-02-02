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
  Linking,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useLayoutEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {WebView} from 'react-native-webview';
import RNRestart from 'react-native-restart';
import NetInfo from '@react-native-community/netinfo';
import {Colors} from './assets/Colors';

const App = () => {
  const [isConnected, setConnected] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [onError, setOnError] = useState(false);
  const [initialLink, setInitialLink] = useState('https://gethooptie.com/');
  const [isLoading, setIsLoading] = useState(true);
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
    // SplashScreen.hide();
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
  useLayoutEffect(() => {
    DeepLinking();
    let isUnmounted = false;
    SplashScreen.hide();
    const timer = setTimeout(() => {
      if (!isUnmounted) {
        setConnected(false);
      }
    }, 5000);
    const netInfroSubscribe = NetInfo.addEventListener(state => {
      clearTimeout(timer);
      if (!isUnmounted) {
        if (state.isConnected && state.isInternetReachable) {
          setConnected(true);
        } else if (state.isConnected && state.isInternetReachable == null) {
          setConnected(true);
        } else {
          setConnected(false);
        }
      }
    });

    return () => {
      isUnmounted = true;
      netInfroSubscribe();
      clearTimeout(timer);
    };
  }, [refresh]);
  const DeepLinking = () => {
    Linking.addEventListener('url', event => {
      Linking.canOpenURL(event.url).then(supported => {
        setInitialLink(event.url);
      });
    });
    //
    Linking.getInitialURL()
      .then(url => {
        if (url) {
          Linking.canOpenURL(url).then(supported => {
            setInitialLink(url);
          });
        }
      })
      .catch(e => console.log('linkerrrr', e));
  };
  const ActivityIndicatorElement = () => {
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
  const onRestart = () => {
    RNRestart.Restart();
    setRefresh(!refresh);
    setOnError(!onError);
  };
  const NoInternet = () => {
    return (
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
              onPress={() => onRestart()}>
              <Text style={styles.btnText}>Try again</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  };
  const OnError = () => {
    return (
      <View style={styles.noNetView}>
        <ImageBackground
          imageStyle={styles.iconBg}
          source={require('./assets/no_internet.png')}
          style={styles.imageStye}>
          <View style={styles.noConnectView}>
            <View style={styles.noConnectTextView}>
              <Text style={styles.noConnectText}>Ooops!</Text>
              <Text style={styles.noConnectSimpleText}>
                {`There was a problem`}
              </Text>
              <Text style={styles.noConnectSimpleText}>
                {`Please contact us.`}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.btnStyle}
              onPress={() => onRestart()}>
              <Text style={styles.btnText}>Try again</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
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
        {isLoading && <ActivityIndicatorElement />}
        {onError ? (
          <OnError />
        ) : !isConnected ? (
          <NoInternet />
        ) : (
          <WebView
            source={{uri: initialLink}}
            javaScriptEnabled={true}
            ref={webViewRef}
            mediaPlaybackRequiresUserAction={false}
            onContentProcessDidTerminate={() => webViewRef.current.reload()}
            domStorageEnabled={true}
            renderLoading={() => <ActivityIndicatorElement />}
            geolocationEnabled={true}
            scalesPageToFit
            allowsInlineMediaPlayback={true}
            javaScriptEnabledAndroid={true}
            allowFileAccess={true}
            originWhitelist={['*']}
            onError={() => setOnError(true)}
            onLoad={() => setIsLoading(false)}
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
