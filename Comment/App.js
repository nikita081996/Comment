import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { AppLoading, Asset, Font, Icon } from "expo";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import reducers from "./src/common/CombineReducers";
import RouterComponent from "./RouterComponent";
//const { persistor, store } = ConfigureStore();

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  componentWillMount() {
    const firebase = require("firebase");

    firebase.initializeApp({
      apiKey: "AIzaSyDaEsmd8Z8jVAEEoI0ji6QEWMchRsYm6wQ",
      authDomain: "amfeed-cd030.firebaseapp.com",
      databaseURL: "https://amfeed-cd030.firebaseio.com",
      projectId: "amfeed-cd030",
      storageBucket: "amfeed-cd030.appspot.com",
      messagingSenderId: "912337230931"
    });
  }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    // return (
    //   <Provider store={store}>
    //     <PersistGate persistor={persistor}>
    //       <View style={styles.container}>
    //         <AppNavigator />
    //       </View>
    //     </PersistGate>
    //   </Provider>

    // );
    console.disableYellowBox = true;

    return (
      <Provider store={store}>
        <View style={styles.container}>
          {Platform.OS === "ios" && (
            <StatusBar barStyle="light-content" backgroundColor="#00BCD4" />
          )}
          <RouterComponent />
        </View>
      </Provider>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
