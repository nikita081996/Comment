import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Modal,
  ToastAndroid,
  Alert,
  Keyboard
} from "react-native";
import { Icon, Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import { fetchComment } from "./HomeActionCreators";
import HeaderComponent from "../../common/HeaderComponent";
import { Actions } from "react-native-router-flux";

class HomeScreen extends Component {
  componentWillMount() {
    this.setState({ comments: [] });
    if (this.state.uploading === false) {
      this.setState({ uploading: true });
    }
    this.fetchComment();
  }

  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      uploading: true,
      showModal: false,
      showLoginModal: false,
      caption: "",
      name: "",
      parentCommentId: "",
      enterUserName: "",
      enterPassword: ""
    };
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

  async fetchComment() {
    await this.props.fetchComment();
  }

  handleLogin = async () => {
    if (this.state.enterUserName === "" || this.state.enterPassword === "") {
      ToastAndroid.show("Please enter all fields", ToastAndroid.SHORT);
      return;
    }
    const firebase = require("firebase");
    this.setState({ uploading: !this.state.uploading });
    const { enterUserName, enterPassword } = this.state;
    Keyboard.dismiss();

    firebase
      .auth()
      .signInWithEmailAndPassword(enterUserName, enterPassword)
      .then(() => this.onLoginSuccess())
      .catch(this.onLoginFailed.bind(this));
  };

  onLoginSuccess() {
    // console.log("success");
    this.setState({
      uploading: !this.state.uploading,
      name: this.state.enterUserName,
      showLoginModal: false,
      showModal: true
    });
  }
  onLoginFailed() {
    //  console.log("failure");
    this.setState({ uploading: !this.state.uploading });
    Alert.alert(
      "Authentication Failed",
      "Login Failed",
      [
        {
          text: "Ok"
        }
      ],
      {
        cancelable: true
      }
    );
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
        //  console.log("success");
        if (this.state.uploading) {
          this.setState({ uploading: false });
        }
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
    if (this.state.name === "") {
      this.setState({ parentCommentId: key, showLoginModal: true });
    } else {
      this.setState({ parentCommentId: key, showModal: true });
    }
  }
  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
      caption: "",
      parentCommentId: ""
    });
  }

  toggleLoginModal() {
    this.setState({
      showLoginModal: !this.state.showLoginModal,
      enterUserName: "",
      enterPassword: ""
    });
  }
  render() {
    const RenderData = data => {
      if (data != null && data.length != 0) {
        if (this.state.uploading) this.setState({ uploading: false });
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
                  // getUpdatedSelectedItemsArray(item.key);
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() =>
                showComments(
                  item.key,
                  item.name,
                  item.date,
                  item.img_url,
                  item.comment
                )
              }
            >
              <Text>show comments</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };
    const showComments = (key, name, date, img_url, comment) => {
      sendReplyData(key, name, date, img_url, comment);
    };

    const sendReplyData = async (key, name, date, img_url, comment) => {
      let myreplyData = [];
      const firebase = require("firebase");

      const commentRef = firebase.database().ref("comment/");

      await commentRef
        .orderByChild("parentCommentId")
        .equalTo(key)
        .on("value", data => {
          let i = 0;
          if (data.exists()) {
            const json = data.val();
            if (json != null) {
              Object.values(json).map(item => {
                const myObj = {
                  key: Object.keys(json)[i],
                  name: item.name,
                  img_url: item.user_img_url,
                  date: item.date,
                  comment: item.comment
                };
                myreplyData.push(myObj);
                i++;
              });
            }
            Actions.ReplyScreen({ myreplyData, name, date, img_url, comment });
          } else {
            ToastAndroid.show("No Comment for this post", ToastAndroid.SHORT);
          }
        });
    };

    return (
      <View>
        <HeaderComponent headerText="Comment" />
        <View style={styles.container1}>
          {this.maybeRenderUploadingOverlay()}
          {RenderData(this.state.comments)}
        </View>
        <Button
          title="Post new comment"
          onPress={
            this.state.name === ""
              ? () => this.toggleLoginModal()
              : () => this.toggleModal()
          }
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
                  onPress={this.postComment}
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
        <Modal
          animationType={"slide"}
          transparent
          visible={this.state.showLoginModal}
          onDismiss={() => this.toggleLoginModal()}
          onRequestClose={() => this.toggleLoginModal()}
        >
          <View style={styles.modal}>
            <View style={styles.dialog}>
              <Input
                placeholder="Email"
                leftIcon={{ type: "font-awesome", name: "user-o" }}
                onChangeText={username =>
                  this.setState({ enterUserName: username })
                }
                value={this.state.enterUserName}
                containerStyle={styles.formInput}
              />
              <Input
                placeholder="Password"
                secureTextEntry
                leftIcon={{ type: "font-awesome", name: "key" }}
                onChangeText={password =>
                  this.setState({ enterPassword: password })
                }
                value={this.state.enterPassword}
                containerStyle={styles.formInput}
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
                  onPress={this.handleLogin}
                  buttonStyle={{
                    backgroundColor: "#ffffff"
                  }}
                  titleStyle={{
                    color: "#00BCD4"
                  }}
                  title="Login"
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
                    this.toggleLoginModal();
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
      </View>
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
    height: "82%",
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
  },
  formInput: {
    margin: 20
  }
});
const mapStateToProps = state => {
  const { isLoading, errMess, data } = state.home;
  return { isLoading, errMess, data };
};

export default connect(
  mapStateToProps,
  { fetchComment }
)(HomeScreen);
