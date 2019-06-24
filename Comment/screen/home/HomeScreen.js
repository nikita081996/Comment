import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Modal,
  ToastAndroid
} from "react-native";
import { ListItem, Card, Icon, Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import { fetchUser } from "./HomeActionCreators";
import HeaderComponentWithIcon from "../../common/HeaderComponentWithIcon";

class HomeScreen extends Component {
  static navigationOptions = {
    title: "Login",
    tabBarIcon: ({ tintColor, focused }) => (
      <Icon
        name="sign-in"
        type="font-awesome"
        size={24}
        iconStyle={{ color: tintColor }}
      />
    )
  };

  componentWillMount() {
    console.log("mount");

    this.setState({ comments: [] });
    if (this.state.uploading === false) {
      this.setState({ uploading: true });
    }
    this.fetchUser();
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.errMess === null) {
      let myData = [];
      let i = 0;
      const json = nextprops.data.val();

      Object.values(json).map(item => {
        const myObj = {
          key: Object.keys(json)[i],
          name: item.name,
          img_url: item.user_img_url,
          date: item.date,
          comment: item.comment
        };
        myData.push(myObj);
        i++;
      });
      this.setState({ comments: myData });
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      uploading: true,
      showModal: false,
      caption: "",
      name: "Neha",
      parentCommentId: ""
    };
  }

  async fetchUser() {
    await this.props.fetchUser();
  }

  postComment = async () => {
    if (this.state.caption == "") {
      ToastAndroid.show(
        "Please write something in comment box",
        ToastAndroid.SHORT
      );
      return;
    }
    const firebase = require("firebase");
    const name = this.state.name;
    const comment = this.state.caption;
    const user_img_url =
      "https://firebasestorage.googleapis.com/v0/b/amfeed-cd030.appspot.com/o/3f2acbe4-8e82-443d-88de-cb3ac274022b?alt=media&token=d6fbcfe9-5e35-4252-9515-7940c4cc0322";
    const date = new Date().toLocaleString();
    const parentCommentId = this.state.parentCommentId;
    this.toggleModal();

    firebase
      .database()
      .ref("comment/")
      .push({
        name,
        comment,
        date,
        user_img_url,
        parentCommentId
      })
      .then(() => {
        console.log("success");
        if (this.state.uploading) {
          this.setState({ uploading: false });
        }
        //
      });
  };
  maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ActivityIndicator animating size="large" />
        </View>
      );
    }
  };

  reply(key) {
    this.setState({ parentCommentId: key, showModal: true });
    // this.toggleModal();
  }
  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
      caption: "",
      parentCommentId: ""
    });
  }
  render() {
    const RenderData = data => {
      // console.log("data", data);
      if (data != null && data.length != 0) {
        if (this.state.uploading) this.setState({ uploading: false });
        console.log(data);
        return (
          <FlatList
            style={styles.root}
            data={data}
            extraData={this.state}
            renderItem={renderUserCard}
            ItemSeparatorComponent={() => {
              return <View style={styles.separator} />;
            }}
            keyExtractor={item => item.key}
          />
        );
      }
    };
    const renderUserCard = ({ item }) => {
      console.log("data", item.comment);

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
              <TouchableOpacity onPress={() => this.reply(item.key)}>
                <Text>Reply</Text>
              </TouchableOpacity>
              <Icon
                raised
                reverse
                name="heart"
                size={10}
                type="font-awesome"
                color="#f50"
                onPress={() => {
                  getUpdatedSelectedItemsArray(item.key);
                }}
              />
            </View>
          </View>
        </View>
      );
    };

    // const RenderData = data => {
    //   console.log(data);
    // };
    return (
      <ScrollView>
        <HeaderComponentWithIcon headerText="Comment" />
        <View style={styles.container1}>
          {this.maybeRenderUploadingOverlay()}
          {RenderData(this.state.comments)}
        </View>
        <Button
          title="Post new comment"
          onPress={() => this.toggleModal()}
          buttonStyle={{
            backgroundColor: "#00BCD4",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            alignSelf: "baseline",
            marginBottom: 5
          }}
        />
        <Modal
          animationType={"slide"}
          transparent
          visible={this.state.showModal}
          onDismiss={() => this.toggleModal()}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal}>
            <View style={styles.dialog}>
              <Input
                multiline
                inputStyle={{ color: "white", height: 100 }}
                style={styles.modalText}
                placeholder="Add Comment"
                onChangeText={caption => this.setState({ caption })}
                leftIcon={
                  <Icon
                    name="user-o"
                    type="font-awesome"
                    size={24}
                    color="white"
                  />
                }
              />
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "column",
                  marginRight: 10,
                  marginLeft: 10
                }}
              >
                <Button
                  style={styles.modalText}
                  onPress={
                    this.postComment
                    //  this.postNewComment(dishId);
                  }
                  buttonStyle={{
                    backgroundColor: "#ffffff"
                  }}
                  titleStyle={{
                    color: "#00BCD4"
                  }}
                  title="Post Comment"
                />
              </View>
              <View
                style={{
                  marginTop: 30,
                  flexDirection: "column",
                  marginRight: 10,
                  marginLeft: 10
                }}
              >
                <Button
                  style={styles.modalText}
                  onPress={() => {
                    this.toggleModal();
                    // this.resetCommentDetails();
                  }}
                  buttonStyle={{
                    backgroundColor: "#ffffff"
                  }}
                  titleStyle={{
                    color: "#00BCD4"
                  }}
                  title="Close"
                />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 19,
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
  },
  modal: {
    justifyContent: "center",
    marginTop: 100,
    marginLeft: 20,
    marginRight: 20
  },
  dialog: {
    padding: 20,
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#00BCD4",
    textAlign: "center",
    color: "white"
  },
  modalText: {
    fontSize: 18,
    margin: 10,
    color: "white"
  }
});
const mapStateToProps = state => {
  const { isLoading, errMess, data, likeImagesKey, noOfLikes } = state.user;
  return { isLoading, errMess, data, likeImagesKey, noOfLikes };
};

export default connect(
  mapStateToProps,
  { fetchUser }
)(HomeScreen);
