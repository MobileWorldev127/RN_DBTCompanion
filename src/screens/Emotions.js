import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions
} from "react-native";
import CustomButton from "./../components/Button";
import ThemeStyle from "../styles/ThemeStyle";
import Header from "./../components/Header";
import textStyles from "./../common/TextStyles";
import { Transition } from "react-navigation-fluid-transitions";
import { Query } from "react-apollo";
import { getLookupValuesQuery } from "../queries/getLookupValues";
import { withStore } from "./../utils/StoreUtils";
import { setEmotions } from "../actions/RecordActions";
import ModalSlider from "../components/ModalSlider";
import { showMessage } from "react-native-flash-message";
import { recordScreenEvent, screenNames } from "../utils/AnalyticsUtils";
import { translate } from "../utils/LocalizeUtils";
import { client } from "../App";
import { errorMessage } from "../utils";
var _ = require("lodash");

const { width, height } = Dimensions.get("window");
class Emotions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: [],
      modalVisible: false,
      currentEmotion: {
        id: 6,
        name: "Grateful",
        color: "#68ee2e"
      }
    };
  }

  setEmotionAndOpenModal = emotion => {
    this.setState({
      modalVisible: true,
      currentEmotion: emotion
    });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false
    });
  };

  sliderOneValuesChangeStart = () => {
    this.setState({
      sliderOneChanging: true
    });
  };

  componentDidMount() {
    recordScreenEvent(screenNames.emotions, {
      mood: this.props.navigation.state.params.mood.name
    });
    this.fetchEmotionList();
  }

  fetchEmotionList = () => {
    this.props.setLoading(true);
    client
      .query({
        query: getLookupValuesQuery,
        variables: {
          keyname: "Emotion List"
        },
        fetchPolicy: "no-cache"
      })
      .then(res => {
        console.log("---EMOTION LIST---", res.data.getLookupValues.value);
        console.log("ELEMENT LIST", this.state.elements);
        this.props.setLoading(false);
        this.setState(
          {
            elements: _.cloneDeep(res.data.getLookupValues.value)
          },
          () => {
            if (this.props.isEdit) {
              this.selectEmotionsFromEntry();
            }
          }
        );
      })
      .catch(err => {
        console.log(err);
        showMessage(errorMessage(translate("Failed to fetch emotions. Please try again")));
      });
  };

  renderEmotionList = () => {
    let elementsList = [];
    this.state.elements.map(data => {
      elementsList.push(
        <TouchableOpacity
          key={data.id}
          style={{
            paddingHorizontal: 15,
            borderWidth: 1,
            marginHorizontal: 8,
            marginBottom: 12,
            borderRadius: 25,
            paddingVertical: 7,
            borderColor: data.color,
            backgroundColor: data.percentage ? data.color : "#fff"
          }}
          onPress={() => {
            this.setEmotionAndOpenModal(data);
          }}
        >
          <Text
            style={[
              {
                fontSize: 14,
                color: data.percentage ? "#fff" : data.color
              },
              textStyles.GeneralText
            ]}
          >
            {data.percentage
              ? data.name + ": " + data.percentage + "%"
              : data.name}
          </Text>
        </TouchableOpacity>
      );
    });
    return elementsList.length > 0 ? (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          paddingHorizontal: 16
        }}
      >
        {elementsList}
      </View>
    ) : null;
  };

  render() {
    let elementsList = [];
    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          title={translate("Emotions")}
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <ScrollView>
          <View
            style={{
              flex: 1,
              paddingTop: 10,
              paddingBottom: 60,
              backgroundColor: "#fff"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 24,
                paddingVertical: 12,
                alignItems: "center"
              }}
            >
              <Transition shared={this.props.navigation.state.params.mood.name}>
                <Image
                  source={this.props.navigation.state.params.mood.src}
                  style={{ width: 32, height: 32 }}
                />
              </Transition>
              <Text
                style={[
                  textStyles.GeneralText,
                  { paddingHorizontal: 16, fontSize: 16 }
                ]}
              >
                {"You are feeling " +
                  this.props.navigation.state.params.mood.name.toLowerCase()}
              </Text>
            </View>
            <Text
              style={[
                {
                  fontSize: 16,
                  color: ThemeStyle.mainColor,
                  paddingVertical: 24,
                  paddingHorizontal: 24
                },
                textStyles.SubHeaderBold
              ]}
            >
                {translate("Lets know more about the emotions you are feeling.")}
            </Text>
            {this.state.elements.length > 0 && this.renderEmotionList()}
          </View>
        </ScrollView>
        <CustomButton
          style={{
            position: "absolute",
            bottom: 0,
            right: 24,
            marginBottom: 24,
            alignSelf: "flex-end"
          }}
          name={translate("Next")}
          onPress={() => {
            let selectedEmotions = this.getSelectedEmotions();
            if (selectedEmotions.length != 0) {
              this.props.setEmotion(this.getSelectedEmotions());
              this.props.navigation.navigate("MedicationScreen");
            } else {
              showMessage({
                type: "danger",
                message: translate("Please select an emotion first")
              });
            }
          }}
        />
        <ModalSlider
          closeModal={this.closeModal}
          currentEmotion={this.state.currentEmotion}
          visible={this.state.modalVisible}
        />
      </View>
    );
  }

  selectEmotionsFromEntry = () => {
    _.forEach(this.state.elements, value => {
      _.forEach(this.props.editEntry.emotions, data => {
        if (value.id === data.emotion.id) {
          value.percentage = data.intensity;
        }
      });
    });
    this.setState({
      elements: this.state.elements
    });
  };

  getSelectedEmotions = () => {
    let selectedEmotions = [];
    _.forEach(this.state.elements, value => {
      if (value.percentage) {
        selectedEmotions.push({
          emotion: {
            id: value.id,
            color: value.color,
            name: value.name
          },
          intensity: value.percentage
        });
      }
    });
    return selectedEmotions;
  };
}

export default withStore(
  Emotions,
  state => ({}),
  dispatch => ({
    setEmotion: emotions => dispatch(setEmotions(emotions))
  })
);

const styles = StyleSheet.create({
  sliderValue: {
    fontSize: 14,
    textAlign: "center",
    color: "red"
  }
});
