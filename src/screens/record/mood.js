import React, { Component } from "react";
import { TouchableOpacity, Image, Text } from "react-native";
import styles from "./styles";
import { moodColors, moodImages, moodImagesDark } from "../../constants";
import * as Animatable from "react-native-animatable";

export default class Mood extends Component {
  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }
  render() {
    const { mood, onPress, selected } = this.props;
    return (
      <TouchableOpacity onPress={onPress} style={styles.moodButton}>
        <Animatable.View
          ref={this.handleViewRef}
          animation="bounceIn"
          duration={1200}
        >
          <Image
            source={selected ? moodImagesDark[mood.id] : moodImages[mood.id]}
            style={[styles.emotion, { tintColor: moodColors[mood.id] }]}
          />
          <Text style={[styles.moodText, { color: moodColors[mood.id] }]}>
            {mood.name}
          </Text>
        </Animatable.View>
      </TouchableOpacity>
    );
  }
}
