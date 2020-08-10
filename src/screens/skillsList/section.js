import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Card, ListItem } from "react-native-elements";
import styles from "./styles";
import { IconList as Icons, moduleColors } from "../../constants";
import DescriptionModal from "../../components/descriptionModal";
import ThemeStyle from "../../styles/ThemeStyle";
import Icon from "../../common/icons";

export default class Section extends Component {
  state = {
    showDescriptionModal: false,
    descriptionContent: ""
  };
  renderHelp = icon =>
    this.setState({ showDescriptionModal: true, descriptionContent: icon });
  showDescriptionModal = type => () =>
    this.setState({ showDescriptionModal: type });
  renderIcons = data =>
    data.map(item => (
      <TouchableOpacity
        key={item.id}
        onPress={() =>
          this.props.onClick ? this.props.onClick(item) : this.renderHelp(item)
        }
        activeOpacity={this.props.onClick ? 0.2 : 1}
      >
        <ListButton
          key={item.id}
          title={item.title}
          icon={Icons[item.icon.split(".")[0]]}
          onHelp={() => this.renderHelp(item)}
          showDescription={this.props.showDescription}
          color={this.props.color}
        />
      </TouchableOpacity>
    ));
  render() {
    const { data } = this.props;
    const { showDescriptionModal, descriptionContent } = this.state;
    return (
      <Card containerStyle={styles.container}>
        <View style={[styles.header, { backgroundColor: this.props.color }]}>
          <Text style={styles.headerText}>{this.props.title}</Text>
        </View>
        <View style={styles.content}>{this.renderIcons(data)}</View>
        <DescriptionModal
          visible={showDescriptionModal}
          onClose={this.showDescriptionModal(false)}
          content={descriptionContent}
        />
      </Card>
    );
  }
}

const ListButton = props => {
  return (
    <View style={[styles.list, props.style]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={props.icon}
          style={{
            width: 20,
            height: 20,
            marginRight: 10,
            tintColor: props.color
          }}
        />
        <Text style={styles.label}>{props.title}</Text>
        <Icon
          family="MaterialIcons"
          name="chevron-right"
          size={28}
          color={ThemeStyle.accentColor}
        />
      </View>
    </View>
  );
};
