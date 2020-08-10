import React, { Component } from "react";
import { Modal, View, Text } from "react-native";
import CustomButton from "../../components/Button";
import { translate } from "../../utils/LocalizeUtils";
import CustomMarker from "../../screens/CustomMarker";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";

export default class RateSkillModal extends Component<{}, {}> {
  constructor(props) {
    super(props);
    this.state = {
      multiSliderValue: [3, 0],
      visible: false
    };
  }

  open({ skill, onSelected }) {
    this.setState({
      visible: true,
      currentSkill: skill,
      onSelected
    });
    this.multiSliderValuesChange(skill.intValue ? [skill.intValue, 0] : [3, 0]);
  }

  close() {
    this.setState({
      visible: false
    });
  }

  multiSliderValuesChange = values => {
    let sliderText = "Barely ";
    switch (values[0]) {
      case 0:
        sliderText = translate("Didn't think about it or use it");
        break;
      case 1:
        sliderText = translate("Thought about, but didn't want to use it");
        break;
      case 2:
        sliderText = translate("Thought about it, didn't use it although I wanted it use it");
        break;
      case 3:
        sliderText = translate("Tried, but couldn't use it");
        break;
      case 4:
        sliderText = translate("Tried, could do it, but didn't help");
        break;
      case 5:
        sliderText = translate("Tried, could use it and it helped");
        break;
      case 6:
        sliderText = "Didn't have to try, used it, but it didn't help";
        break;
      case 7:
        sliderText = translate("Didn't have to try, used it, and it helped");
        break;
    }
    this.setState({
      multiSliderValue: values,
      sliderText
    });
  };

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => {
          alert("Modal has been closed.");
        }}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.42)" }}>
          <View
            style={{
              flex: 1,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                shadowColor: "grey",
                shadowOffset: { width: 15, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                paddingHorizontal: 24,
                paddingVertical: 24
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Text
                  style={[
                    TextStyles.Header2,
                    {
                      marginBottom: 16
                    }
                  ]}
                >
                  {`How useful was ${
                    this.state.currentSkill
                      ? this.state.currentSkill.title
                      : "this skill"
                  }`}
                </Text>
              </View>

              <MultiSlider
                selectedStyle={{
                  backgroundColor: ThemeStyle.mainColor
                }}
                unselectedStyle={{ backgroundColor: "#ddddea" }}
                trackStyle={{ height: 22, borderRadius: 20 }}
                values={[this.state.multiSliderValue[0]]}
                onValuesChange={this.multiSliderValuesChange}
                customMarker={() => (
                  <CustomMarker value={`${this.state.multiSliderValue[0]}`} />
                )}
                touchDimensions={{
                  height: 32,
                  width: 300,
                  slipDisplacement: 40
                }}
                min={0}
                max={7}
                step={1}
                sliderLength={300}
              />
              <Text style={[TextStyles.GeneralText]}>
                {this.state.sliderText}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <CustomButton
                  style={{
                    flex: 1,
                    marginTop: 32,
                    backgroundColor: "#fff",
                    borderColor: ThemeStyle.accentColor,
                    borderWidth: 1,
                    marginRight: 12
                  }}
                  noGradient
                  onPress={() => {
                    this.state.currentSkill.intValue = 0;
                    this.setState({
                      multiSliderValue: [3, 0],
                      sliderText: "Barely "
                    });
                    this.props.onSkillRatingDone(this.state.currentSkill);
                    this.state.onSelected(false);
                    this.close();
                  }}
                  textStyle={{
                    color: ThemeStyle.accentColor
                  }}
                  name="Clear"
                />
                <CustomButton
                  style={{ flex: 1, marginTop: 32, marginLeft: 12 }}
                  onPress={() => {
                    this.state.currentSkill.intValue = this.state.multiSliderValue[0];
                    this.props.onSkillRatingDone(this.state.currentSkill);
                    if (this.state.currentSkill.intValue) {
                      this.state.onSelected(true);
                    }
                    this.close();
                  }}
                  name="Okay"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
