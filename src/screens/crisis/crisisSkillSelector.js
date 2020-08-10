import React, { Component } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { graphql, compose } from "react-apollo";
import { defaultItemsQuery } from "../../queries";
import { IconList as Icons } from "../../constants";
import styles from "./styles";
import Loader from "../../components/loader";

class CrisisSkillSelector extends Component {
  renderIcons = icons => {
    return icons.map((data, i) => (
      <ListButton
        key={i}
        title={data.title}
        icon={Icons[data.icon.split(".")[0]]}
        onPress={() => this.props.selectIcon(data)}
      />
    ));
  };
  render() {
    const { skills, loading } = this.props;
    if (loading) return <Loader />;
    return <ScrollView>{this.renderIcons(skills)}</ScrollView>;
  }
}

const ListButton = props => {
  return (
    <TouchableOpacity
      style={[styles.list, props.style]}
      onPress={props.onPress}
    >
      <View style={{ flexDirection: "row" }}>
        <Image source={props.icon} style={styles.icon} />
        <Text style={styles.label}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default compose(
  graphql(defaultItemsQuery, {
    options: {
      fetchPolicy: "cache-first"
    },
    props: props => ({
      skills:
        props.data.getDefaultItems && props.data.getDefaultItems[0].skills,
      loading: props.data.loading
    })
  })
)(CrisisSkillSelector);
