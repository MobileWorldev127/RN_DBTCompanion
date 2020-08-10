import React, { Component, Fragment } from "react";
import {
  View,
  ScrollView,
  Platform,
  Text,
  TouchableOpacity
} from "react-native";
import Header from "../../components/Header";
import { translate } from "../../utils/LocalizeUtils";
import { graphql, compose } from "react-apollo";
import { defaultItemsQuery } from "../../queries";
import { groupByModules } from "../../utils";
import Section from "./section";
import { moduleColors } from "../../constants";
import ThemeStyle from "../../styles/ThemeStyle";

class SkillsList extends Component {
  static defaultProps = {
    showHeader: true,
    showDescription: true
  };
  render() {
    const { skills, showHeader, onItemClick, showDescription } = this.props;
    return (
      <Fragment>
        {showHeader && (
          <Header
            title={translate("Skills")}
            goBack={() => this.props.navigation.goBack()}
          />
        )}

        <ScrollView style={{ flex: 1 }}>
          {skills &&
            Object.keys(skills).map(module => {
              return (
                <Section
                  key={module}
                  onSelect={this.onSelect}
                  title={module}
                  module={module}
                  data={skills[module]}
                  onClick={onItemClick}
                  showDescription={showDescription}
                  color={
                    moduleColors[module]
                      ? moduleColors[module]
                      : ThemeStyle.mainColor
                  }
                />
              );
            })}
          <View style={{ height: 30 }} />
        </ScrollView>
      </Fragment>
    );
  }
}

export default compose(
  graphql(defaultItemsQuery, {
    options: {
      fetchPolicy: "cache-first"
    },
    props: props => ({
      skills:
        props.data.getDefaultItems &&
        groupByModules(props.data.getDefaultItems[0].skills),
      loading: props.data.loading
    })
  })
)(SkillsList);
