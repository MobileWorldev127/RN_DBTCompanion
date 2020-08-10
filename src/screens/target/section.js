import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { sectionStyle as styles } from "./styles";
import SingleTarget from "./singleTarget";
import { performNetworkTask } from "../../utils/NetworkUtils";
import ThemeStyle from "../../styles/ThemeStyle";

export default class Section extends Component {
  constructor(props) {
    super(props);
    const { data, customData, module, hide } = props;
    this.state = {
      data,
      customData,
      module,
      hide
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    );
  }
  isHidden = id =>
    this.props.hide &&
    this.props.hide.length > 0 &&
    this.props.hide.indexOf(id) > -1;

  getValue = id => {
    let value = 0;
    this.props.selectedTargets.map((item, i) => {
      if (item.target.id === id) {
        value = item.value;
      }
      console.log("VALUE", item, id, value);
    });
    return value;
  };

  renderTargets = data =>
    data
      .filter(item => !this.isHidden(item.id))
      .map(item => (
        <SingleTarget
          value={this.getValue(item.id)}
          onSelect={this.props.onSelect}
          onClear={this.props.onClear}
          key={item.id}
          item={item}
        />
      ));

  render() {
    const { data, customData, module, hide } = this.props || [];
    return (
      <Card containerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{this.props.title}</Text>
          <TouchableOpacity
            onPress={() =>
              performNetworkTask(
                () => {
                  this.props.navigation.navigate("EditTargetsScreen", {
                    data,
                    customData,
                    module,
                    hide: this.props.hide
                  });
                },
                "Editing targets is only allowed when online. Please check your internet connection and try again.",
                true
              )
            }
          >
            <Icon name="ios-create" size={25} color={ThemeStyle.disabled} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {this.renderTargets(data)}
          {customData && this.renderTargets(customData)}
        </View>
      </Card>
    );
  }
}
