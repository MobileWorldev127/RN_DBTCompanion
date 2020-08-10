import React, { Component, Fragment } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Header from "../../components/Header";
import Section from "./section";
import CustomButton from "../../components/Button";
import { translate } from "../../utils/LocalizeUtils";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import * as Animatable from "react-native-animatable";
export default class TargetScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.getSelectedTargets()
    };
  }
  getSelectedTargets = () => {
    const {
      dataObj: { targets }
    } = this.props;
    return (targets && targets) || [];
  };
  onSelect = data => {
    let selected = [...this.state.selected];
    let index = selected.map(x => x.target.id).indexOf(data.target.id);
    index > -1 ? (selected[index].value = data.value) : selected.push(data);
    this.setState({ selected });
  };
  onClear = id => {
    let selected = [...this.state.selected];
    let index = selected.map(x => x.target.id).indexOf(id);
    if (index > -1) {
      selected.splice(index, 1);
      this.setState({ selected });
    }
  };
  next = () => {
    let obj = [
      ...this.state.selected.map(item => ({
        target: item.target,
        value: item.value
        // __typename: "TargetEntry"
      }))
    ];
    this.props.next("targets", obj);
  };
  prev = () => {
    this.props.prev("targets", {});
  };

  componentDidMount() {
    recordScreenEvent(screenNames.targets);
  }

  render() {
    const { targets, navigation, userTargets, hide } = this.props;
    const isDirty = this.state.selected.length > 0;
    // console.log("gegg", this.props);
    console.log("RENDERING TARGETS", targets, this.getSelectedTargets());
    return (
      <Fragment>
        <Header title={translate("Targets")} goBack={this.prev} />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {targets &&
            Object.keys(targets).map((module, index) => {
              return (
                <Animatable.View animation="slideInUp" delay={index * 200}>
                  <Section
                    key={module}
                    selectedTargets={this.getSelectedTargets()}
                    onSelect={this.onSelect}
                    onClear={this.onClear}
                    title={module}
                    module={module}
                    navigation={navigation}
                    data={targets[module]}
                    customData={userTargets[module]}
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
          name={translate("Next")}
          onPress={this.next}
        />
      </Fragment>
    );
  }
}
