import React, { Component } from "react";
import {
  View,
  Text,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import { IconList as Icons } from "./../../constants";
import Icon from "react-native-vector-icons/Ionicons";
import styles from "./styles";
import HTML from "react-native-render-html";
import ThemeStyle from "../../styles/ThemeStyle";

export default class DescriptionModal extends Component {
  static defaultProps = {
    visible: false,
    onClose: () => {}
  };
  renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>No Description Available</Text>
    </View>
  );
  render() {
    const { content, visible, onClose } = this.props;
    if (!visible) return null;
    return (
      <Modal visible={visible} onRequestClose={onClose} animationType="slide">
        <SafeAreaView style={styles.topContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon
              name="ios-close-circle-outline"
              size={30}
              color={ThemeStyle.accentColor}
            />
          </TouchableOpacity>
          <View style={styles.iconWrapper}>
            <Image
              source={Icons[content.icon ? content.icon.split(".")[0] : ""]}
              style={styles.icon}
            />
          </View>
          <Text style={styles.iconTitle}>{content.title}</Text>
        </SafeAreaView>
        {!content.description || content.description.length === 0 ? (
          this.renderEmpty()
        ) : (
          <ScrollView style={styles.content}>
            <HTML
              html={content.description}
              baseFontStyle={styles.description}
            />
            <View style={{ height: 30 }} />
          </ScrollView>
        )}
      </Modal>
    );
  }
}
