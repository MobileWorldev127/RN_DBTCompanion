import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput
} from "react-native";
import Header from "../../components/Header";
import { IconList } from "../../constants";
import Icon from "react-native-vector-icons/Ionicons";
import {
  addActivityQuery,
  userPreferenceQuery,
  defaultVariables
} from "../../queries";
import { compose, graphql } from "react-apollo";
import styles from "./styles";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import { getEnvVars, getAmplifyConfig } from "../../constants";
import ThemeStyle from "../../styles/ThemeStyle";
import { withStore } from "../../utils/StoreUtils";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../../utils";
import { translate } from "../../utils/LocalizeUtils";
import gql from "graphql-tag";
import { client } from "../../App";

const IconData = Object.keys(IconList);

class AddActivityScreen extends Component {
  constructor(props) {
    super(props);
    const {
      navigation: {
        state: { params }
      }
    } = props;
    this.state = {
      current: null,
      iconName: "",
      isDirty: false,
      mode: "ADD"
    };
  }
  selectIcon = icon =>
    this.setState({
      current: icon,
      isDirty:
        this.state.mode === "ADD" && this.state.iconName === "" ? false : true
    });
  saveActivity = () => {
    const { id, current, iconName, isDirty, mode } = this.state;
    if (!isDirty) return;
    if (mode === "ADD") {
      let obj = {
        title: iconName,
        description: "empty",
        icon: current,
        msg: "",
        __typename: "Activity"
      };
      this.props.setLoading(true);
      this.props
        .onAddActivity(obj)
        .then(response => {
          this.props.navigation.state.params.onGoBack();
          this.props.navigation.goBack();
        })
        .finally(() => {
          this.props.setLoading(false);
        });
    } else if (mode === "EDIT") {
      let obj = {
        title: iconName,
        description: "empty",
        icon: current,
        id
      };
      this.props.setLoading(true);
      const editCustomActivity = gql`
        mutation editCustomActivity($input: ActivityInput!) {
          editCustomActivity(input: $input) {
            msg
          }
        }
      `;
      const editCustomActivityData = {
        input: obj
      };
      client
        .mutate({
          mutation: editCustomActivity,
          variables: editCustomActivityData
        })
        .then(response => {
          this.props.navigation.goBack();
          this.props.navigation.state.params.onGoBack();
        })
        .catch(e => {
          showMessage(errorMessage());
          console.log(e);
        })
        .finally(() => {
          this.props.setLoading(false);
        });
    }
  };

  componentDidMount() {
    const { navigation } = this.props;
    const mode = navigation.getParam("mode", "ADD");
    const data = navigation.getParam("data", {});
    if (mode && mode === "EDIT" && data !== {}) {
      this.setState({
        iconName: data.title,
        current: data.icon,
        mode: mode,
        id: data.id
      });
    }
  }

  render() {
    const { current, isDirty, iconName } = this.state;
    return (
      <Fragment>
        <Header
          title={translate(this.state.mode === "EDIT" ? "Edit Activity" : "Add Activity")}
          goBack={() => this.props.navigation.goBack()}
        />
        <View style={styles.topSection}>
          <Image
            source={IconList[current]}
            style={[styles.icon, styles.selected]}
          />
          <TextInput
            onChangeText={text => {
              let flag = false;
              if (this.state.iconName !== text && text !== "") {
                flag = true;
              }
              this.setState({
                iconName: text,
                isDirty:
                  this.state.mode === "ADD" && this.state.current === null
                    ? false
                    : flag
              });
            }}
            underlineColorAndroid="transparent"
            placeholder={translate("Enter Activity...")}
            style={styles.input}
            value={iconName}
          />
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={this.saveActivity}
            activeOpacity={isDirty ? 0.2 : 1}
          >
            <Icon
              name={
                isDirty
                  ? "ios-checkmark-circle"
                  : "ios-checkmark-circle-outline"
              }
              size={32}
              color={isDirty ? ThemeStyle.accentColor : "#ccc"}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.container}>
          <View style={styles.iconList}>
            {IconData.map((icon, index) => (
              <SingleIcon
                name={icon}
                key={index}
                current={current === icon}
                onChange={() => this.selectIcon(icon)}
              />
            ))}
          </View>
        </ScrollView>
      </Fragment>
    );
  }
}

const SingleIcon = props => (
  <TouchableOpacity style={styles.iconButton} onPress={props.onChange}>
    <Image
      source={IconList[props.name]}
      style={[styles.icon, props.current ? styles.selected : null]}
    />
  </TouchableOpacity>
);

export default compose(
  graphql(addActivityQuery, {
    props: props => ({
      onAddActivity: activity =>
        props.mutate({
          variables: {
            title: activity.title,
            description: activity.description,
            icon: activity.icon
          },
          optimisticResponse: () => ({ addCustomActivity: activity })
        })
    })
  })
)(withStore(AddActivityScreen));
