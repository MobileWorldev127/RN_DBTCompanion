import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { IconList as Icons } from "../../constants";
import { listStyle as styles } from "./styles";
import Icon from "react-native-vector-icons/Ionicons";
import Slider from "react-native-slider";
import ThemeStyle from "../../styles/ThemeStyle";

export default class SingleTarget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
    this.rating = {};
  }
  ratingCompleted = value => {
    let { item } = this.props;
    let { __typename, description, ...rest } = item;
    value = Math.floor(value);
    let obj = {
      target: rest,
      value
    };
    this.props.onSelect(obj);
    this.setState({ value });
  };
  resetRating = () => {
    this.props.onClear(this.props.item.id);
    this.setState({ value: 0 });
  };
  render() {
    const { item, value } = this.props;
    return (
      <View style={styles.list}>
        <View style={styles.left}>
          <Image source={Icons[item.icon.split(".")[0]]} style={styles.icon} />
          <Text style={styles.label}>{item.title}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={this.resetRating}
            style={{ marginRight: 10, marginTop: 3, flex: 0.6 }}
          >
            <Image source={require("../../assets/images/redesign/reset.png")} />
          </TouchableOpacity>
          {/*<AirbnbRating
            size={20}
            ratingCount={5}
            showRating={false}
            defaultRating={value}
            onFinishRating={this.ratingCompleted}
            value={this.state.value}
          />*/}
          <View style={{ flex: 4 }}>
            <Slider
              value={Math.floor(this.state.value)}
              onValueChange={this.ratingCompleted}
              maximumValue={5}
              trackStyle={styles.track}
              thumbStyle={styles.thumb}
              minimumTrackTintColor={styles.thumb.backgroundColor}
            />
          </View>
        </View>
      </View>
    );
  }
}
