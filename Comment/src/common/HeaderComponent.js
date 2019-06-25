import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default class HeaderComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ paddingTop: 24 }}>
        <View style={styles.viewStyle}>
          <Text style={styles.textStyle}>{this.props.headerText} </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  }
});
