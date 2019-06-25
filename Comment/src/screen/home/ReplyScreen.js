import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList
} from "react-native";
import { Icon } from "react-native-elements";
import HeaderComponent from "../../common/HeaderComponent";

class ReplyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: props.myreplyData
    };
  }
  componentWillReceiveProps(props) {
    this.setState({ comments: props.myreplyData });
  }

  render() {
    const RenderReplyDataList = data => {
      if (data != null && data.length != 0) {
        return (
          <FlatList
            style={styles.root}
            data={data}
            extraData={this.state}
            renderItem={renderReplyUserCard}
            ItemSeparatorComponent={() => {
              return <View style={styles.separator} />;
            }}
            keyExtractor={item => item.key}
          />
        );
      }
    };
    const renderReplyUserCard = ({ item }) => {
      return (
        <View style={styles.container}>
          <TouchableOpacity onPress={() => {}}>
            <Image style={styles.image} source={{ uri: item.img_url }} />
          </TouchableOpacity>
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.time}>{item.date}</Text>
            </View>
            <Text>{item.comment}</Text>
            <View style={{ flexDirection: "row", padding: 5 }}>
              <Icon
                raised
                reverse
                name="heart"
                size={10}
                type="font-awesome"
                color="#f50"
                onPress={() => {}}
              />
            </View>
          </View>
        </View>
      );
    };

    return (
      <View>
        <HeaderComponent headerText="Comment" />

        <View style={styles.container}>
          <TouchableOpacity onPress={() => {}}>
            <Image style={styles.image} source={{ uri: this.props.img_url }} />
          </TouchableOpacity>
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <Text style={styles.name}>{this.props.name}</Text>
              <Text style={styles.time}>{this.props.date}</Text>
            </View>
            <Text>{this.props.comment}</Text>
            <View style={{ flexDirection: "row", padding: 5 }}>
              <Icon
                raised
                reverse
                name="heart"
                size={10}
                type="font-awesome"
                color="#f50"
                onPress={() => {
                  // getUpdatedSelectedItemsArray(item.key);
                }}
              />
            </View>
          </View>
        </View>
        <View style={{ marginLeft: 25 }}>
          {RenderReplyDataList(this.state.comments)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  container1: {
    justifyContent: "center",
    width: "100%",
    backgroundColor: "white",
    paddingTop: 20
  },
  content: {
    marginLeft: 16,
    flex: 1
  },
  contentHeader: {
    flexDirection: "row",
    marginBottom: 6
  },

  image: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginLeft: 20
  },
  time: {
    fontSize: 11,
    color: "#808080",
    marginLeft: 5
  },
  name: {
    fontSize: 16,
    fontWeight: "bold"
  }
});

export default ReplyScreen;
