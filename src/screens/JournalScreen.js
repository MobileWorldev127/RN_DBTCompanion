import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  FlatList,
  TextInput,
  Platform,
  Image,
  ActivityIndicator
} from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import ImagePicker from "react-native-image-picker";
import textStyles from "./../common/TextStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ThemeStyle from "../styles/ThemeStyle";
import Icon from "../common/icons";
import Header from "./../components/Header";
import { Transition } from "react-navigation-fluid-transitions";
import { ApolloConsumer } from "react-apollo";
import { addEntryQuery, getEntriesQuery } from "../queries";
import { withStore } from "../utils/StoreUtils";
import { translate } from "../utils/LocalizeUtils";
import {
  omitDeep,
  getAttachments,
  convertAssetsToAttachments
} from "../utils/ExerciseUtils";
import RNFetchBlob from "rn-fetch-blob";
import { Storage } from "aws-amplify";
let moment = require("moment");
import DocumentPicker from "react-native-document-picker";
import { clearState } from "../actions/RecordActions";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../utils";
import { editEntryQuery } from "../queries/editEntry";
import { APP } from "../constants";
import { recordScreenEvent, screenNames } from "../utils/AnalyticsUtils";
import { performNetworkTask } from "../utils/NetworkUtils";
import Card from "../components/Card";
import Button from "../components/Button";
import * as Animatable from "react-native-animatable";
import { client } from "../App";

const { width, height } = Dimensions.get("window");

class JournalScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaListData: [
        {
          iconName: "md-photos",
          family: "Ionicons",
          source: require("../assets/images/redesign/image-icon.png"),
          media: "Photos"
        },
        {
          iconName: "camera",
          family: "MaterialIcons",
          source: require("../assets/images/redesign/camera-icon.png"),
          media: "Camera"
        },
        {
          iconName: "audiotrack",
          family: "MaterialIcons",
          source: require("../assets/images/redesign/music-icon.png"),
          media: "Audio"
        }
        // {
        //   iconName: "microphone",
        //   family: "MaterialCommunityIcons",
        //   media: "Microphone"
        // }
      ],
      description:
        props.dataObj && props.dataObj.journal
          ? props.dataObj.journal.text
          : "",
      attachedFiles:
        props.dataObj && props.dataObj.journal
          ? convertAssetsToAttachments(props.dataObj.journal.assets)
          : [],
      isModalVisible: false
    };
  }

  renderAttachedFile(rowData) {
    return (
      <TouchableOpacity
        key={rowData.item.media}
        style={{}}
        onPress={() => {
          // Share.open({
          //   url: rowData.item.id,
          //   title: "Open using:"
          // })
          //   .then(res => {
          //     console.log(res);
          //   })
          //   .catch(err => console.log(err));
          if (rowData.item.type === "image" && rowData.item.id) {
            this.props.navigation.navigate("ImageViewer", {
              uri: rowData.item.id
            });
          }
        }}
      >
        <View
          style={{
            width: width / 2.1,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            backgroundColor: "#fff",
            borderRadius: 4,
            paddingHorizontal: 24,
            paddingVertical: 12,
            margin: 4
          }}
        >
          <Icon name="attachment" family="Entypo" size={22} />
          <Text
            style={[
              textStyles.GeneralText,
              { fontSize: 14, color: "#000", paddingLeft: 12 }
            ]}
          >
            {rowData.item.media}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderMediaList(rowData) {
    return (
      <TouchableOpacity
        key={rowData.item.id}
        style={styles.listContainer}
        onPress={() => {
          performNetworkTask(
            () => {
              const options = {
                storageOptions: {
                  skipBackup: true,
                  path: "images"
                }
              };
              this.setState({
                loading: true
              });
              if (rowData.item.media == "Camera") {
                ImagePicker.launchCamera(options, response => {
                  // Same code as in above section!
                  if (!response.didCancel && response.data) {
                    let fileName = response.fileName || `Camera photo`;
                    Storage.put(fileName, new Buffer(response.data, "base64"), {
                      contentType: response.type,
                      level: "private"
                      // customPrefix: { private: APP.s3BucketPrefix }
                    })
                      .then(data => {
                        console.log(data);
                        let attachedFiles = this.state.attachedFiles;
                        attachedFiles.push({
                          id: response.uri,
                          media: fileName,
                          type: "image"
                        });
                        this.setState({
                          attachedFiles,
                          loading: false
                        });
                      })
                      .catch(error => {
                        console.log(error);
                        this.setState({
                          loading: false
                        });
                      });
                  } else {
                    this.setState({
                      loading: false
                    });
                  }
                });
              } else if (rowData.item.media == "Photos") {
                ImagePicker.launchImageLibrary(options, response => {
                  console.log(response);
                  if (!response.didCancel && response.data) {
                    let fileName = response.fileName || `Gallery image`;
                    Storage.put(fileName, new Buffer(response.data, "base64"), {
                      contentType: "image/png",
                      level: "private"
                      // customPrefix: { private: APP.s3BucketPrefix }
                    }).then(data => {
                        console.log(data);
                        let attachedFiles = this.state.attachedFiles;
                        attachedFiles.push({
                          id: response.uri,
                          media: fileName,
                          type: "image"
                        });
                        this.setState({
                          attachedFiles,
                          loading: false
                        });
                      })
                      .catch(error => {
                        console.log(error);
                        this.setState({
                          loading: false
                        });
                      });
                  } else {
                    this.setState({
                      loading: false
                    });
                  }
                });
              } else if (rowData.item.media == "Audio") {
                DocumentPicker.pick({
                  type: [DocumentPicker.types.audio]
                })
                  .then(res => {
                    // Android
                    if (res) {
                      let fileUri = res.uri;
                      console.log(res);
                      if (Platform.OS === "ios") {
                        let arr = fileUri.split("/");
                        const dirs = RNFetchBlob.fs.dirs;
                        filePath = `${dirs.DocumentDir}/${arr[arr.length - 1]}`;
                      } else {
                        filePath = fileUri;
                      }
                      console.log(filePath);
                      RNFetchBlob.fs
                        .readFile(filePath, "base64")
                        .then(data => {
                          let fileName = res.name || `Audio file`;
                          console.log(data);
                          Storage.put(fileName, new Buffer(data, "base64"), {
                            level: "private",
                            // customPrefix: { private: APP.s3BucketPrefix }
                            contentType: res.type
                          })
                            .then(data => {
                              console.log(data);
                              let attachedFiles = this.state.attachedFiles;
                              attachedFiles.push({
                                id: res.uri,
                                media: fileName,
                                type: "audio"
                              });
                              this.setState({
                                attachedFiles,
                                loading: false
                              });
                              // this.props.setLoading(false);
                            })
                            .catch(error => {
                              console.log(error);
                              this.setState({
                                loading: false
                              });
                              showMessage(errorMessage());
                            });
                        })
                        .catch(err => {
                          console.log(err);
                          this.setState({
                            loading: false
                          });
                          showMessage(errorMessage());
                        });
                    } else {
                      showMessage({
                        message: translate("Please select a file"),
                        type: "danger"
                      });
                      this.setState({
                        loading: false
                      });
                    }
                  })
                  .catch(err => {
                    showMessage({
                      message: translate("Please select a file"),
                      type: "danger"
                    });
                  });
              }
            },
            "Attaching files is only allowed when online. Please check your internet connection and try again",
            true
          );
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Image
            source={rowData.item.source}
            style={{ width: 32 }}
            resizeMode="contain"
          />
          {/* <Icon
            name={rowData.item.iconName}
            family={rowData.item.family}
            size={32}
            color={ThemeStyle.disabled}
          /> */}
        </View>
      </TouchableOpacity>
    );
  }

  next = () => {
    this.props.next("journal", {
      text: this.state.description,
      assets: [getAttachments(this.state.attachedFiles)]
    });
  };

  prev = () => {
    const data = {
      text: this.state.description,
      assets: [getAttachments(this.state.attachedFiles)]
    };
    console.log("JOURNAL ENTRY", data);
    this.props.prev("journal", data);
  };

  componentDidMount() {
    recordScreenEvent(screenNames.journal);
  }

  render() {
    console.log(this.props);
    return (
      <View style={[ThemeStyle.pageContainer]}>
        <StatusBar
          translucent={false}
          backgroundColor={"#122ACC"}
          barStyle={"light-content"}
          hidden={false}
        />
        <Header title={translate("Journal")} goBack={this.prev} />

        <KeyboardAwareScrollView
          contentContainerStyle={{ paddingBottom: 72, paddingHorizontal: 20 }}
        >
          <Animatable.View animation="slideInDown">
            <Card
              style={{
                marginVertical: 10,
                backgroundColor: "#fff",
                paddingBottom: 24
              }}
            >
              <TextInput
                style={[textStyles.GeneralText, styles.inputBox]}
                placeholder={translate("Describe what happened")}
                multiline={true}
                placeholderTextColor="lightgrey"
                underlineColorAndroid="transparent"
                defaultValue={this.state.description}
                //value={this.state.description}
                onChangeText={description => this.setState({ description })}
              />
              <FlatList
                contentContainerStyle={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 24
                }}
                data={this.state.mediaListData}
                renderItem={this.renderMediaList.bind(this)}
                keyExtractor={(item, index) => index.toString()}
              />
            </Card>
            {/* <View style={styles.addMedia}>
            <Icon name="attachment" family="Entypo" size={22} />
            <Text style={[textStyles.SubHeaderBold, { paddingHorizontal: 15 }]}>
              Add Media
            </Text>
          </View> */}

            <FlatList
              contentContainerStyle={{
                // flexWrap: "wrap",
                flexDirection: "row"
              }}
              data={this.state.attachedFiles}
              renderItem={this.renderAttachedFile.bind(this)}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.state.attachedFiles.length}
            />
          </Animatable.View>
        </KeyboardAwareScrollView>
        {this.state.loading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#000a",
              zIndex: 20,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <ActivityIndicator animating={this.state.loading} size="large" />
          </View>
        )}
        <ApolloConsumer
        // mutation={addEntryQuery}
        // onCompleted={data => {
        //   console.log(data);
        //   this.props.setLoading(false);
        //   this.props.clearState();
        //   this.props.navigation.navigate("HomeScreen");
        // }}
        // onError={error => {
        //   this.props.setLoading(false);
        //   console.log(error);
        // }}
        // update={(cache, fetchedObject) => {
        //   console.log(fetchedObject);
        //   const query = cache.readQuery({
        //     query: getEntriesQuery,
        //     variables: getMonthRange()
        //   });
        //   console.log(query);
        //   let response = fetchedObject.data.addEntry;

        //   let isInserted = false;
        //   for (let i = 0; i < query.getEntriesFromTo.entries.length; i++) {
        //     let record = query.getEntriesFromTo.entries[i];
        //     if (record.entryDate === response.entryDate) {
        //       isInserted = true;
        //       query.getEntriesFromTo.entries[i].entries.unshift(response);
        //     }
        //   }
        //   if (!isInserted) {
        //     query.getEntriesFromTo.entries.unshift({
        //       entries: [response],
        //       entryDate: response.entryDate
        //     });
        //   }
        //   console.log(query.getEntriesFromTo);
        //   cache.writeQuery({
        //     query: getEntriesQuery,
        //     variables: getMonthRange(),
        //     data: { getEntriesFromTo: query.getEntriesFromTo }
        //   });
        // }}
        >
          {client => (
            <Animatable.View animation="zoomIn" style={{ margin: 20 }}>
              <Button
                name={translate("DONE")}
                onPress={() => {
                  this.next();
                }}
              />
            </Animatable.View>
          )}
        </ApolloConsumer>
      </View>
    );
  }

  completeFlow = () => {
    this.props.setLoading(false);
    this.props.clearState();
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "DrawerRoutes" })]
    });
    this.props.navigation.dispatch(resetAction);
  };

  getEntryInputFromRecordFlow = () => {
    let entry = {
      ...this.props.recordFlow.sleep
    };
    let timestamp = moment(this.props.recordFlow.timestamp);
    entry.entryDate = timestamp.format("YYYY-MM-DD");
    entry.dateTime = this.props.recordFlow.timestamp;
    // if (this.props.recordFlow.isEdit) {
    //   entry.id = this.props.recordFlow.entryID;
    // }
    entry.emotions = this.props.recordFlow.emotions;
    entry.mood = this.props.recordFlow.mood.value;
    if (this.state.description) {
      entry.journal = {
        text: this.state.description,
        assets: getAttachments(this.state.attachedFiles)
      };
    }
    console.log(this.props.recordFlow);
    console.log(entry);
    return entry;
  };
}

export default withStore(
  JournalScreen,
  state => ({
    recordFlow: state.record,
    isEdit: state.record.isEdit,
    editEntry: state.record.editEntry
  }),
  dispatch => ({
    clearState: () => dispatch(clearState())
  })
);

var styles = StyleSheet.create({
  inputBox: {
    //flex:3,
    height: 240,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
    margin: 16,
    fontSize: 16,
    textAlignVertical: "top",
    color: "#000",
    borderRadius: 4,
    backgroundColor: "#fff"
  },
  addMedia: {
    paddingTop: 20,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
    flexDirection: "row"
  },
  listContainer: {
    backgroundColor: ThemeStyle.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40
  },
  modalContainer: {
    backgroundColor: "#fff",
    height: null,
    width: width - 40,
    borderRadius: 10,
    overflow: "hidden"
  },
  modalHeader: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 0.5,
    borderColor: "lightgrey"
  }
});
