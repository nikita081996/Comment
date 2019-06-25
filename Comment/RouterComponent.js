import React from "react";
import { Scene, Router } from "react-native-router-flux";
import HomeScreen from "./src/screen/home/HomeScreen";
import ReplyScreen from "./src/screen/home/ReplyScreen";

const RouterComponent = () => (
  <Router>
    <Scene key="main">
      <Scene
        key="HomeScreen"
        component={HomeScreen}
        title="HomeScreen"
        initial
        hideNavBar
      />
      <Scene key="ReplyScreen" component={ReplyScreen} title="Reply" />
    </Scene>
  </Router>
);

export default RouterComponent;
