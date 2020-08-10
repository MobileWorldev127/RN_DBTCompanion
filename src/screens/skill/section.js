import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import IconSelector from "../../components/iconSelector";
import { IconList as Icons, moduleColors } from "../../constants";
import { sectionStyle as styles } from "./styles";
import DescriptionModal from "../../components/descriptionModal";
import ThemeStyle from "../../styles/ThemeStyle";
import { performNetworkTask } from "../../utils/NetworkUtils";

export default class Section extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIds: props.selectedSkills.map(skill => skill.id) || [],
      selected: props.selectedSkills || [],
      showDescriptionModal: false,
      descriptionContent: ""
    };
  }
  showDescriptionModal = type => () =>
    this.setState({ showDescriptionModal: type });
  renderHelp = icon => {
    this.setState({ showDescriptionModal: true, descriptionContent: icon });
  };

  // onSelect duplicate to prevent re-render of all icons and prevent memory leak
  onSelect = icon => {
    let { __typename, description, ...rest } = icon;
    this.props.onSelect(rest, isSelected => {
      let selected = [...this.state.selected];
      let selectedIds = [...this.state.selectedIds];
      let index = selectedIds.indexOf(icon.id);
      if (index > -1) {
        selectedIds.splice(index, 1);
        selected.splice(index, 1);
      }
      if (isSelected) {
        selected.push(rest);
        selectedIds.push(icon.id);
      }
      this.setState({ selected, selectedIds });
    });
  };

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
  renderIcons = data =>
    data
      .filter(item => !this.isHidden(item.id))
      .map(item => (
        <IconSelector
          key={item.id}
          name={item.title}
          image={Icons[item.icon.split(".")[0]]}
          selected={this.state.selectedIds.indexOf(item.id) > -1}
          onPress={() => this.onSelect(item)}
          onLongPress={() => this.renderHelp(item)}
          color={moduleColors[this.props.module]}
        />
      ));
  render() {
    const { data, customData, module, hide } = this.props || [];
    const { showDescriptionModal, descriptionContent } = this.state;
    return (
      <Card containerStyle={styles.container}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: ThemeStyle.mainColor
            }
          ]}
        >
          <Text style={styles.headerText}>{this.props.title}</Text>
          <TouchableOpacity
            onPress={() =>
              performNetworkTask(
                () => {
                  this.props.navigation.navigate("EditSkillScreen", {
                    data,
                    customData,
                    module,
                    hide
                  });
                },
                "Editing skills is only allowed when online. Please check your internet connection and try again.",
                true
              )
            }
          >
            <Icon name="ios-create" size={25} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {this.renderIcons(data)}
          {customData && this.renderIcons(customData)}
        </View>
        <DescriptionModal
          visible={showDescriptionModal}
          onClose={this.showDescriptionModal(false)}
          content={descriptionContent}
        />
      </Card>
    );
  }
}
