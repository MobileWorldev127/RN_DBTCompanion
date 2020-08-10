import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Animated,
  TouchableOpacity
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from "react-native-linear-gradient";
import Header from "./../../components/Header";
import Icon from "../../common/icons";
import ThemeStyle from "../../styles/ThemeStyle";
import Coverflow from "react-native-coverflow";
import textStyles from "./../../common/TextStyles";
import { Transition } from "react-navigation-fluid-transitions";
import { withStore } from "../../utils/StoreUtils";
import { setMood } from "../../actions/RecordActions";
import { Moods, asyncStorageConstants } from "../../constants";
let moment = require("moment");
import DateTimePicker from "react-native-modal-datetime-picker";
import { Auth } from "aws-amplify";
import { isOnline } from "../../utils/NetworkUtils";
import { translate } from "../../utils/LocalizeUtils";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.RotateValueHolder = new Animated.Value(0);
    this.moods = Moods;
    this.currentMood = this.moods[2];
    this.state = {
      isDatePickerVisible: false,
      currentDate: moment()
    };
    Auth.currentUserInfo().then(info => {
      console.log("user info", info);
      this.setState({
        userName: info.attributes.name
      });
    });
  }

  async componentDidMount() {
    this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
    if (!isOnline()) {
      userInfo = JSON.parse(
        await AsyncStorage.getItem(asyncStorageConstants.userInfo)
      );
      if (userInfo && userInfo.attributes) {
        this.setState({
          userName: userInfo.attributes.name
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
  }

  render() {
    console.log("Render home", this.state);
    let currentDate = this.props.isEdit
      ? moment(this.props.editEntry.dateTime)
      : this.state.currentDate;
    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          isDrawer={true}
          openDrawer={() => {
            this.props.navigation.openDrawer();
          }}
          title={translate("Mood")}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff"
          }}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            colors={ThemeStyle.gradientColor}
          >
            <TouchableOpacity
              onPress={() => {
                console.log("select date");
                if (!this.props.isEdit) {
                  this.setState({
                    isDatePickerVisible: true
                  });
                }
              }}
            >
              <View
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 24,
                  elevation: 24
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    name="date-range"
                    family="MaterialIcons"
                    size={24}
                    color={"#fff"}
                  />
                  <Text
                    style={[
                      textStyles.GeneralText,
                      {
                        fontSize: 20,
                        color: "#fff",
                        paddingHorizontal: 8
                      }
                    ]}
                  >
                    {currentDate.format("dddd, DD MMMM")}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 4
                  }}
                >
                  <Icon
                    name="access-time"
                    family="MaterialIcons"
                    size={24}
                    color={"#fff"}
                  />
                  <Text
                    style={[
                      textStyles.GeneralText,
                      {
                        fontSize: 20,
                        color: "#fff",
                        paddingHorizontal: 8
                      }
                    ]}
                  >
                    {currentDate.format("hh:mm A")}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </LinearGradient>
          <View style={{ paddingTop: 32, paddingHorizontal: 24 }}>
            <Text
              style={[
                { fontSize: 24, color: "#222", fontWeight: "800" },
                textStyles.HeaderBold
              ]}
            >
              {`${translate("Hi")} ${this.state.userName ? this.state.userName : ""},`}
            </Text>
            <Text
              style={[textStyles.GeneralText, { fontSize: 24, color: "#222" }]}
            >
                {translate("How are you?")}
            </Text>

            <Text
              style={[
                textStyles.SubHeaderBold,
                {
                  fontSize: 14,
                  color: "#222",
                  marginTop: 12
                }
              ]}
            >
                {translate("Please select how you are feeling.")}
            </Text>
          </View>
          <Coverflow
            style={{
              flex: 1,
              justifyContent: "center",
              paddingVertical: 64,
              marginTop: 32,
              marginBottom: 32
            }}
            onChange={index => {
              this.currentMood = this.moods[index];
            }}
            onPress={() => {
              this.props.setMood(
                this.currentMood,
                currentDate.toISOString(),
                this.isEdit,
                this.entryID
              );
              this.props.navigation.navigate("Emotions", {
                mood: this.currentMood
              });
            }}
            initialSelection={2}
            rotation={0}
            scaleFurther={0.5}
            scaleDown={0.6}
          >
            {this.moods.map(mood => (
              <View style={styles.imageContainer}>
                <Transition shared={mood.name}>
                  <Animated.Image source={mood.src} style={styles.imageStyle} />
                </Transition>
                <Text style={styles.textStyle}>{translate(mood.name)}</Text>
              </View>
            ))}
          </Coverflow>
        </View>
        <DateTimePicker
          isVisible={this.state.isDatePickerVisible}
          date={new Date(currentDate.toISOString())}
          mode="datetime"
          onCancel={() => {
            this.setState({
              isDatePickerVisible: false
            });
          }}
          onConfirm={date => {
            console.log(date);
            this.setState({
              isDatePickerVisible: false,
              currentDate: moment(date)
            });
          }}
          maximumDate={new Date()}
        />
      </View>
    );
  }
}

export default withStore(
  HomeScreen,
  state => ({
    isEdit: state.record.isEdit,
    editEntry: state.record.editEntry
  }),
  dispatch => ({
    setMood: (mood, timestamp, isEdit, entryID) =>
      dispatch(setMood(mood, timestamp, isEdit, entryID))
  })
);

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: "#fff",
    height: Platform.OS === "ios" ? 64 : 54,
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "lightgrey"
  },
  listContainer: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginVertical: 5,
    backgroundColor: "#BDBDBD"
  },
  imageContainer: {
    alignItems: "center",
    padding: 10
  },
  imageStyle: {
    width: 180,
    height: 180,
    resizeMode: "contain"
  },
  textStyle: {
    fontSize: 24,
    color: "#333",
    paddingVertical: 16,
    fontFamily: "AirbnbCerealApp-Medium"
  }
});
