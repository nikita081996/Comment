import React from "react";
import { Scene, Router, Actions } from "react-native-router-flux";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from "react-native-popup-menu";
import HomeScreen from "./screen/home/HomeScreen";

const RouterComponent = () => (
  <MenuProvider>
    <Router>
      <Scene key="main">
        <Scene
          key="HomeScreen"
          component={HomeScreen}
          title="HomeScreen"
          initial
          hideNavBar
        />
      </Scene>
    </Router>
  </MenuProvider>
);

export default RouterComponent;
