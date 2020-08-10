import React, { Component, Fragment } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput
} from "react-native";
import Header from "../../components/Header";
import { IconList, getAmplifyConfig } from "../../constants";
import Icon from "react-native-vector-icons/Ionicons";
import { compose, graphql } from "react-apollo";
import {
  addSkillQuery,
  userPreferenceQuery,
  defaultVariables
} from "../../queries";
import styles from "./styles";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import { getEnvVars } from "../../constants";
import ThemeStyle from "../../styles/ThemeStyle";
import { withStore } from "../../utils/StoreUtils";
import { translate } from "../../utils/LocalizeUtils";
import { getAllCustomPreferencesRequest } from "../../actions/customPreferencesAction";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../../utils";
import { client } from "../../App";
import gql from "graphql-tag";

// const IconData = ['briefcase', 'bed', 'travel', 'music', 'game', 'plus'];
const IconData = Object.keys(IconList);

class AddSkillScreen extends Component {
  constructor(props) {
    super(props);
    const {
      navigation: {
        state: { params }
      }
    } = props;
    this.state = {
      current: null,
      module: (params && params.module) || null,
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
  saveSkill = () => {
    const { id, current, iconName, module, isDirty, mode } = this.state;
    if (!isDirty) return;
    if (mode === "ADD") {
      let obj = {
        title: iconName,
        description: "empty",
        icon: current,
        msg: "",
        __typename: "Skill",
        module
      };
      this.props.setLoading(true);
      this.props
        .onAddSkill(obj)
        .then(response => {
          this.props.getAllCustomPreferencesRequest();
          // this.props.navigation.state.params.onGoBack();
          this.props.navigation.goBack(null);
        })
        .finally(() => {
          this.props.setLoading(false);
        });
    } else if (mode === "EDIT") {
      let obj = {
        title: iconName,
        description: "empty",
        icon: current,
        module,
        id
      };
      this.props.setLoading(true);
      const editCustomSkillData = {
        input: obj
      };
      console.log("EDIT SKILL", editCustomSkillData);
      const editCustomSkill = gql`
        mutation editCustomSkill($input: SkillInput!) {
          editCustomSkill(input: $input) {
            msg
          }
        }
      `;
      client
        .mutate({ mutation: editCustomSkill, variables: editCustomSkillData })
        .then(response => {
          this.props.navigation.state.params.onGoBack(obj.module);
          this.props.navigation.goBack(null);
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
          title={translate(this.state.mode === "EDIT" ? "Edit Skill" : "Add Skill")}
          goBack={() => this.props.navigation.goBack(null)}
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
            placeholder={translate("Enter Skill...")}
            style={styles.input}
            value={iconName}
          />
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={this.saveSkill}
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

export const SingleIcon = props => (
  <TouchableOpacity style={styles.iconButton} onPress={props.onChange}>
    <Image
      source={IconList[props.name]}
      style={[styles.icon, props.current ? styles.selected : null]}
    />
  </TouchableOpacity>
);

export default compose(
  graphql(addSkillQuery, {
    props: props => ({
      onAddSkill: skill =>
        props.mutate({
          variables: {
            title: skill.title,
            description: skill.description,
            module: skill.module,
            icon: skill.icon
          },
          optimisticResponse: () => ({ addCustomSkill: skill })
        })
    })
    // options: {
    //   refetchQueries: [
    //     { query: userPreferenceQuery, variables: defaultVariables }
    //   ],
    //   update: (dataProxy, fetchedObj) => {
    //     const query = userPreferenceQuery;
    //     const data = dataProxy.readQuery({
    //       query,
    //       variables: defaultVariables
    //     });

    //     let response = fetchedObj.data.addCustomSkill.msg;
    //     if (response.length) {
    //       let obj = JSON.parse(response);
    //       obj.__typename = "Skill";
    //       data.getPreferences.custom.skills.push(obj); // Requires id to push
    //       dataProxy.writeQuery({ query, data });
    //     }
    //   }
    // }
  })
)(
  withStore(AddSkillScreen, undefined, dispatch => ({
    getAllCustomPreferencesRequest: () =>
      dispatch(getAllCustomPreferencesRequest())
  }))
);
