import React, { Component, Fragment } from "react";
import { View, ScrollView } from "react-native";
import Header from "./../../components/Header";
import Section from "./section";
import CustomButton from "../../components/Button";
import Icon from "react-native-vector-icons/Ionicons";
import ThemeStyle from "../../styles/ThemeStyle";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import * as Animatable from "react-native-animatable";
import RateSkillModal from "./RateSkillModal";

export default class SkillScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.getSelectedSKills()
    };
  }

  onSelect = (icon, onSelected) => {
    this.state.selected.forEach(skill => {
      if (skill.id === icon.id) {
        icon.intValue = skill.intValue;
      }
    });
    this.rateSkillModal.open({ skill: icon, onSelected });
  };

  onSkillRatingDone = skill => {
    let selected = [...this.state.selected];
    let index = selected.map(item => item.id).indexOf(skill.id);
    if (index > -1) {
      selected.splice(index, 1);
    }
    if (skill.intValue) {
      selected.push(skill);
    }
    this.setState({ selected });
  };

  getSelectedSKills = () => {
    const {
      dataObj: { skills }
    } = this.props;
    return (
      (skills &&
        skills.map(item => ({ ...item.skill, intValue: item.intValue }))) ||
      []
    );
  };

  next = () => {
    let obj = [
      ...this.state.selected.map(item => ({
        skill: {
          ...item,
          intValue: undefined
        },
        value: true,
        intValue: item.intValue
      }))
    ];
    console.log("SELECTED SKILLS", obj);
    this.props.next("skills", obj);
  };

  prev = () => {
    this.props.prev("skills", {});
  };

  componentDidMount() {
    recordScreenEvent(screenNames.skills);
  }

  render() {
    const { navigation, skills, userSkills, hide } = this.props;
    const isDirty = this.state.selected.length > 0;
    return (
      <Fragment>
        <Header
          title="Skills"
          backButton
          goBack={this.prev}
          rightIcon={() => (
            <Icon name="md-bulb" size={25} color={ThemeStyle.mainColor} />
          )}
          onRightIconClick={() =>
            this.props.navigation.navigate("SkillsListScreen")
          }
        />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {skills &&
            Object.keys(skills).map((module, index) => {
              {
                /* console.log("MODULE", module); */
              }
              {
                /* console.log("CUSTOM DATA", userSkills[module]); */
              }
              return (
                <Animatable.View animation="slideInUp" delay={index * 200}>
                  <Section
                    key={module}
                    onSelect={this.onSelect}
                    selectedSkills={this.getSelectedSKills()}
                    title={module}
                    module={module}
                    navigation={navigation}
                    data={skills[module]}
                    customData={userSkills[module]}
                    hide={hide}
                  />
                </Animatable.View>
              );
            })}
          <View style={{ height: 30 }} />
        </ScrollView>
        <CustomButton
          style={{
            position: "absolute",
            bottom: 0,
            right: 24,
            marginBottom: 24,
            alignSelf: "flex-end"
          }}
          name={"Next"}
          onPress={this.next}
        />
        <RateSkillModal
          ref={ref => {
            this.rateSkillModal = ref;
          }}
          onSkillRatingDone={this.onSkillRatingDone}
        />
      </Fragment>
    );
  }
}
