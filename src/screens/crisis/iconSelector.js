import React from "react";
import { View, ScrollView, TouchableOpacity, Image, Text } from "react-native";
import { SingleIcon } from "../addSkill";
import { IconList } from "../../constants";

const IconData = Object.keys(IconList);

const IconSelector = props => (
  <ScrollView style={styles.container}>
    <View style={styles.iconList}>
      {IconData.map((icon, index) => (
        <SingleIcon
          name={icon}
          key={index}
          onChange={() => props.selectIcon(icon)}
        />
      ))}
    </View>
  </ScrollView>
);

const styles = {
  iconList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10
  }
};

export default IconSelector;
