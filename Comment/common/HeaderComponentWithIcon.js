import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Icon } from "expo";

export default class HeaderComponentWithIcon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ paddingTop: 20 }}>
        <View style={styles.viewStyle}>
          <Text style={styles.textStyle}>{this.props.headerText} </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#33cc33",
    flex: 1,
    paddingTop: 20,
    alignItems: "center",
    padding: 10
  },
  viewStyle: {
    backgroundColor: "#00BCD4",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 15,
    height: 55,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    marginTop: 0
  },
  textStyle: {
    fontSize: 20,
    color: "#ffffff"
  },
  modal: {
    width: 150,
    position: "absolute",
    right: 35,
    top: 20,
    backgroundColor: "#00BCD4"
  },
  outsideModel: {
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  dialog: {
    fontWeight: "bold"
    //mariginTop: 20
  },
  modalText: {
    color: "white",
    fontSize: 18,
    padding: 10
  }
});
