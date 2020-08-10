import React, { Component } from "react";
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View,
  Dimensions
} from "react-native";
import * as Animatable from "react-native-animatable";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";

class IconSelector extends Component {
  static defaultProps = {
    onLongPress: () => {}
  };
  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }
  handleViewRef = ref => (this.view = ref);

  bounce = () => this.view.bounceIn(900);

  onPress = () => {
    this.bounce();
    this.props.onPress();
  };

  render() {
    const props = this.props;
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={this.onPress}
        // onLongPress={props.onLongPress}
      >
        <Animatable.View
          ref={this.handleViewRef}
          style={[
            styles.iconWrapper,
            props.selected ? { backgroundColor: "#3992B6" } : null
          ]}
        >
          <Image
            source={props.image}
            style={[
              {
                width: 25,
                height: 25,
                tintColor: "#3992B6"
              },
              props.selected ? styles.selectedIcon : null
            ]}
          />
        </Animatable.View>
        <Text style={styles.name} numberOfLines={2}>
          {props.name}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 5,
    minWidth: 60,
    minHeight: 94,
    alignItems: "center"
  },
  iconWrapper: {
    borderWidth: 1,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    borderColor: "#3992B6"
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: ThemeStyle.accentColor
  },
  selectedIcon: {
    tintColor: "white"
  },
  selectedWrapper: {
    backgroundColor: ThemeStyle.accentColor
  },
  name: {
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    color: TextStyles.GeneralText.color,
    marginTop: 5,
    fontSize: 12,
    width: Dimensions.get("window").width / 5.5,
    flexDirection: "row",
    flexWrap: "wrap",
    textAlign: "center"
  }
});

export default IconSelector;
