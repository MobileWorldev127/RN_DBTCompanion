import React, { Component, Fragment } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import Header from "../../components/Header";
import styles from "./styles";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import * as Animatable from "react-native-animatable";
import { Moods, moodImages } from "../../constants";
import CircularSlider from "../../components/CircularSliderGradient";
import LinearGradient from "react-native-linear-gradient";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
import CustomButton from "../../components/Button";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
// import CircularSlider from "../../components/CircularSlider";

export default class RecordScreen extends Component {
  constructor(props) {
    super(props);
    let timestamp = (props.dataObj && props.dataObj.timestamp) || null;
    this.state = {
      isDateTimePickerVisible: false,
      // date: moment().format("dddd, D MMMM"),
      // time: moment().format('h:mm A'),
      datetime: (timestamp && moment(timestamp)) || undefined,
      mood: props.dataObj.mood
        ? Moods[5 - props.dataObj.mood].name
        : Moods[0].name,
      circleValue: 0,
      moodImage: props.dataObj.mood
        ? moodImages[6 - props.dataObj.mood]
        : moodImages[1],
      moodIndex: props.dataObj.mood ? 5 - props.dataObj.mood : 0
    };
  }
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = datetime =>
    this.setState({
      datetime: moment(datetime),
      isDateTimePickerVisible: false
    });

  clearSelectedDate = timestamp => {
    console.log("CLEAR DATE", timestamp);
    this.setState({
      datetime: (timestamp && moment(timestamp)) || undefined
    });
  };

  componentDidMount() {
    recordScreenEvent(screenNames.record);
    console.log("RECORD SCREEN MOUNT", this.state);
  }

  selectMood = mood => {
    const { datetime } = this.state;
    let entryDate = datetime || moment();
    let date = entryDate.format("YYYY-MM-DD");
    let time = entryDate.format();
    const obj = {
      EntryDate: date,
      entry: {
        mood: mood.value,
        timestamp: time
      }
    };
    this.props.next("record", obj);
  };

  getValueForSlider = () => {
    let angle = 0;
    switch (this.state.moodIndex) {
      case 0:
        angle = 36;
        break;
      case 1:
        angle = 108;
        break;
      case 2:
        angle = 180;
        break;
      case 3:
        angle = 252;
        break;
      case 4:
        angle = 324;
        break;
    }
    return angle;
  };

  onCircleMove(value, moodname, index) {
    // console.log("onCircleMove", value);
    // console.log("onCircleMove1", moodname);

    var oldValue = this.state.circleValue;
    if (oldValue != value) {
      this.setState({
        circleValue: value,
        mood: moodname,
        moodImage: moodImages[index],
        moodIndex: index - 1
      });
    }
  }
  
  render() {
    const { dataObj, mode } = this.props;
    let datetime = this.state.datetime;
    let date =
      mode === "edit"
        ? moment(dataObj.timestamp).format("dddd, D MMMM")
        : moment(datetime).format("dddd, D MMMM");
    let time =
      mode === "edit"
        ? moment(dataObj.timestamp).format("h:mm A")
        : moment(datetime).format("h:mm A");

    return (
      <View style={ThemeStyle.pageContainer}>
        <LinearGradient
          colors={ThemeStyle.gradientColor}
          start={{
            x: 0.2,
            y: 0
          }}
          end={{ y: 1.4, x: 0.2 }}
          style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
        >
          <Header
            title={`${mode === "edit" ? "Edit " : ""}Record Entry`}
            backButton
            goBack={() => this.props.navigation.goBack("")}
            isLightContent
            navBarStyle={{ backgroundColor: "transparent" }}
          />
          <Animatable.View animation="fadeInDown">
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                marginHorizontal: 24,
                marginVertical: 12,
                fontFamily: TextStyles.HeaderBold.fontFamily
              }}
            >
              {"Hi, " + this.props.userName + "\nHow are you?"}
            </Text>
            <TouchableOpacity
              onPress={this._showDateTimePicker}
              style={{
                flexDirection: "row",
                marginBottom: 16,
                marginTop: 12,
                paddingVertical: 8,
                marginHorizontal: 32,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#fff",
                borderRadius: 24
              }}
              disabled={mode === "edit"}
            >
              <Icon
                name="md-calendar"
                size={22}
                color="#fff"
                style={styles.pickerIcon}
              />
              <Text
                style={[styles.pickerText, { color: "#fff", fontSize: 12 }]}
              >
                {date}
              </Text>
              <View
                style={{
                  width: 1,
                  backgroundColor: "#fff",
                  height: "80%",
                  marginHorizontal: 8
                }}
              />
              <Text
                style={[styles.pickerText, { color: "#fff", fontSize: 12 }]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </LinearGradient>
        <View style={styles.moodCircleContainer}>
          <View
            style={{
              flex: 1,
              position: "absolute",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Image
              source={this.state.moodImage}
              style={{ width: 100, height: 100 }}
            />
          </View>

          <CircularSlider
            ref={ref => {
              this.circularSlider = ref;
            }}
            value={this.getValueForSlider()}
            dialWidth={20}
            dialRadius={100}
            meterColor={ThemeStyle.mainColor}
            bgColor="red"
            backgroundColor={ThemeStyle.pageContainer.backgroundColor}
            textColor="transparent"
            onValueChange={(value, moodname, index) =>
              this.onCircleMove(value, moodname, index)
            }
          />

          {/* <CircularSlider /> */}
        </View>
        <Text
          style={{
            fontSize: 24,
            fontFamily: TextStyles.SubHeaderBold.fontFamily,
            paddingBottom: 120,
            textAlign: "center",
            alignSelf: "center"
          }}
        >
          {this.state.mood}
        </Text>
        {/* </PanGestureHandler> */}
        <CustomButton
          style={{
            position: "absolute",
            bottom: 0,
            right: 24,
            marginBottom: 24,
            alignSelf: "flex-end"
          }}
          name={"Next"}
          onPress={() => this.selectMood(Moods[this.state.moodIndex])}
        />

        <DateTimePicker
          mode="datetime"
          date={
            this.state.datetime
              ? new Date(this.state.datetime.toISOString())
              : new Date()
          }
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
        />
      </View>
    );
  }
}
