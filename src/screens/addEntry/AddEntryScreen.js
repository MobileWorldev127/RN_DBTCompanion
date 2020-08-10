import React, { Component } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import RecordScreen from "../record";
import ActivityScreen from "../activity";
import TargetScreen from "../target";
import SkillScreen from "../skill";

// import JournalScreen from '../journal';
import JournalScreen from "../JournalScreen";
// import MedicationScreen from "../MedicationScreen";
import { NavigationActions, StackActions } from "react-navigation";
import _ from "lodash";
import moment from "moment";
import { defaultItemsQuery } from "../../queries";
import { Query } from "react-apollo";
import { groupByModules, errorMessage } from "../../utils";
import { Auth } from "aws-amplify";
import { showMessage } from "react-native-flash-message";
import { omitDeep } from "../../utils/ExerciseUtils";
import { isOnline } from "../../utils/NetworkUtils";
import ThemeStyle from "../../styles/ThemeStyle";
import AsyncStorage from "@react-native-community/async-storage";
import { asyncStorageConstants } from "../../constants";
import bugsnagClient from "../../utils/Bugsnag";

var screens = [
  "record",
  "skill",
  "target",
  "activity",
  "journal"
];

// export function setScreens(userScreens) {
//   screens = userScreens;
// }

class AddEntryScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      tabBarVisible: navigation.getParam("tabBarVisible", true)
    };
  };
  constructor(props) {
    super(props);
    console.log("PROPS", props);
    this.state = {
      current: 0,
      mode: props.mode || "add",
      userName: "",
      dataObj: props.entry
    };
    this.resetResultObj();
  }

  componentWillReceiveProps(nextProps, nextState) {
    console.log("ADD ENTRY PROPS", nextProps, this.state);
    if (
      nextProps.mode !== this.state.mode ||
      !this.state.dataObj ||
      nextProps.entry.timestamp !== this.state.dataObj.timestamp
    ) {
      this.setState(
        {
          mode: nextProps.mode || "add",
          dataObj: nextProps.entry
        },
        () => {
          this.resetResultObj();
          if (
            this.currentScreen &&
            typeof this.currentScreen.clearSelectedDate === "function"
          ) {
            this.currentScreen.clearSelectedDate(this.state.dataObj.timestamp);
          }
        }
      );
    }
  }

  changeScreen = direction => {
    let current = this.state.current;
    current += direction;
    console.log("current index: " + current);
    if (current != 0) {
      this.props.navigation.setParams({ tabBarVisible: false });
      this.props.navigation.state.params.toggleTabBar(false);
      this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
    } else {
      this.props.navigation.setParams({ tabBarVisible: true });
      this.props.navigation.state.params.toggleTabBar(true);
      this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
    }
    bugsnagClient.leaveBreadcrumb(`save data ${current === screens.length}`);
    if (current === screens.length) {
      this.saveData();
      return;
      // current = 0;
    }
    console.log("changeScreen", current);
    this.setState({ current });
  };

  onNext = (screen, data) => {
    if (screen == "record") {
      let oldEntry = this.resultObj.entry ? this.resultObj.entry : {};
      this.resultObj = {
        EntryDate: data.EntryDate,
        entry: {
          ...oldEntry,
          ...data.entry
        }
      };
    } else {
      if (screen === "activity") {
        this.resultObj.entry = Object.assign(this.resultObj.entry, data);
      } else if (!(screen === "journal" && (!data.text || data.text === ""))) {
        this.resultObj.entry[screen] = data;
      }
    }
    bugsnagClient.leaveBreadcrumb(`${screen} next`);
    console.log("ENTRY OBJECT", this.resultObj.entry);
    this.changeScreen(1);
  };

  onPrev = (screen, data) => {
    if (screen === "journal" && data.text && data.text !== "") {
      this.resultObj.entry[screen] = data;
    }
    this.changeScreen(-1);
  };

  resetResultObj = () => {
    const { mode, dataObj } = this.state;
    this.setState({ mode, current: 0 });
    this.resultObj = {};
    this.resultObj = {
      EntryDate: "",
      entry: {
        ...dataObj
      }
    };
  };

  saveData = () => {
    let obj = {
      ...this.resultObj,
      msg: ""
    };
    console.log("SAVING ENTRY", JSON.stringify(obj));
    const { setModeAndData, setNotifyDate, setUserNotified } = this.props;
    let timeout = true;
    bugsnagClient.leaveBreadcrumb(
      `saving entry: online ${isOnline()} mode:${this.state.mode}`
    );
    setTimeout(() => {
      if (timeout) {
        bugsnagClient.notify(
          new Error(`Failed to save entry step: timeout; online ${isOnline()}`)
        );
      }
    }, 4000);
    if (!this.state.mode || this.state.mode === "add") {
      obj = {
        ...obj,
        __typename: "DayRecord"
      };
      obj.entry.bedTime = moment(obj.entry.bedTime).format("HH:mm");
      obj.entry.wakeTime = moment(obj.entry.wakeTime).format("HH:mm");
      this.props.setLoading(true);
      this.props
        .addEntry(obj)
        .then(response => {
          timeout = false;
          bugsnagClient.leaveBreadcrumb(
            `received add entry response: online ${isOnline()}`
          );
          console.log("Add Entry Response: ", response);
          const now = new moment().format();
          const year = new moment(now).format("YYYY");
          const week = moment(now).isoWeek();
          AsyncStorage.getItem(asyncStorageConstants.lastQuizNotification)
            .then(lastQuizDate => {
              let quizYearCheck = false;
              let quizweekCheck = false;
              if (lastQuizDate) {
                const quizYear = new moment(lastQuizDate).format("YYYY");
                const quizWeek = moment(lastQuizDate).isoWeek();
                quizYearCheck = year === quizYear;
                quizweekCheck = week === quizWeek;
              }
              const condition = !(quizYearCheck && quizweekCheck);
              this.props.setLoading(false);
              if (condition && isOnline()) {
                AsyncStorage.setItem(
                  asyncStorageConstants.lastQuizNotification,
                  moment().format()
                );
                Alert.alert("", "Do you want to take DBT quiz?", [
                  {
                    text: "Yes",
                    onPress: () => {
                      setUserNotified(true);
                      this.props.navigation.navigate("QuizScreen");
                      setNotifyDate(now);
                    }
                  },
                  {
                    text: "No",
                    onPress: () => {
                      setUserNotified(true);
                      setNotifyDate(now);
                    }
                  }
                ]);
              }
            })
            .catch(err => {
              console.log(err);
              bugsnagClient.notify(
                new Error(
                  `Failed to save entry step: no lastQuizDate online ${isOnline()}`
                )
              );
              this.props.setLoading(false);
            });
          this.goBack();
        })
        .catch(err => {
          bugsnagClient.leaveBreadcrumb("Save entry failed");
          bugsnagClient.notify(
            new Error(
              `Failed to save entry step: error; online: ${isOnline()}`
            ),
            report => {
              report.metadata = {
                ErrorDetails: {
                  data: JSON.stringify(err)
                }
              };
            }
          );
          showMessage(errorMessage("Failed to save entry. Please try again"));
          this.props.setLoading(false);
          console.log("Add Entry Error: ", err);
        });
    } else {
      const entryInput = {
        EntryDate: new moment(this.props.entry.timestamp).format("YYYY-MM-DD"),
        entry: omitDeep(obj.entry, "__typename")
      };
      entryInput.entry.timestamp = this.props.entry.timestamp;
      entryInput.entry = _.omit(entryInput.entry, ["id"]);
      // if (obj.entry.skills.length) {
      //   obj.entry.skills.map((item, i) => {
      //     obj.entry.skills[i].skill = _.omit(item.skill, ["__typename"]);
      //   });
      // }
      // if (obj.entry.activities.length) {
      //   obj.entry.activities.map((item, i) => {
      //     obj.entry.activities[i] = _.omit(item, ["__typename"]);
      //   });
      // }
      // if (obj.entry.targets.length) {
      //   obj.entry.targets.map((item, i) => {
      //     obj.entry.targets[i].target = _.omit(item.target, ["__typename"]);
      //   });
      // }
      // obj.entry = _.omit(obj.entry, ["__typename"]);
      // obj.EntryDate = new moment(this.props.entry.timestamp).format(
      //   "YYYY-MM-DD"
      // );
      // obj.entry.timestamp = this.props.entry.timestamp;
      console.log("ENTRY INPUT", JSON.stringify(entryInput));
      this.props.setLoading(true);
      this.props
        .patchEntry(entryInput)
        .then(response => {
          // console.log("Patch Entry Response: ", response);
          setModeAndData("add", {});
          this.resultObj = {
            EntryDate: "",
            entry: {}
          };
          this.props.setLoading(true);
          this.goBack();
        })
        .catch(err => {
          bugsnagClient.leaveBreadcrumb("Edit entry failed");
          bugsnagClient.notify(err);
          console.log("Patch Entry Error: ", err);
          showMessage(errorMessage("Failed to edit entry. Please try again"));
        });
    }
  };

  wrapProps = (Component, props) => {
    const { navigation } = this.props;
    return (
      <Component
        ref={ref => {
          this.currentScreen = ref;
        }}
        navigation={navigation}
        next={this.onNext}
        prev={this.onPrev}
        mode={this.state.mode}
        dataObj={this.resultObj.entry}
        userName={this.state.userName}
        setLoading={this.props.setLoading}
        {...props}
      />
    );
  };

  goBack = () => {
    bugsnagClient.notify(new Error("Saved entry, going back to home"));
    this.props.navigation.state.params.toggleTabBar(true);
    this.resetResultObj();
    this.setState({
      mode: "add",
      dataObj: undefined
    });
    this.props.clearState();
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "DrawerRoutes" })]
    });
    this.props.navigation.dispatch(resetAction);
  };

  // Pass component specific props (skills, targets, activities)
  getContent = (userPreferencedata, defaultItemsdata) => {
    const { current } = this.state;
    const defaultItems = defaultItemsdata;
    const userPreference = userPreferencedata;
    console.log("userPreference", userPreference);
    console.log("screens[current]", screens[current]);
    switch (screens[current]) {
      case "skill":
        return this.wrapProps(SkillScreen, {
          skills: defaultItems.skills,
          userSkills: userPreference.skills,
          hide: userPreference.hide.skills
        });
      case "activity":
        return this.wrapProps(ActivityScreen, {
          activities: defaultItems.activities,
          userActivities: userPreference.activities,
          hide: userPreference.hide.activities
        });
      case "target":
        return this.wrapProps(TargetScreen, {
          targets: defaultItems.targets,
          userTargets: userPreference.targets,
          hide: userPreference.hide.targets
        });
      case "journal":
        return this.wrapProps(JournalScreen);
      case "record":
        return this.wrapProps(RecordScreen, { goBack: this.goBack });
      // case "medication":
      //   return this.wrapProps(MedicationScreen);
      default:
        return null;
    }
  };

  componentDidMount() {
    const { getAllCustomPreferencesRequest } = this.props;
    this.props.getAllCustomPreferencesRequest();
    this.resetResultObj();
    this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
    Auth.currentUserInfo()
      .then(currentUserInfo => {
        console.log(currentUserInfo);
        this.setState({
          userName: currentUserInfo.attributes.name
        });
      })
      .catch(err => console.log(err));
  }

  componentWillUnmount() {
    this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
  }

  render() {
    console.log(this.props.userPreference);
    return (
      <View style={ThemeStyle.pageContainer}>
        {/* <Query query={userPreferenceQuery} variables={defaultVariables}>
          {userPreferenceQueryData => ( */}
        <Query query={defaultItemsQuery}>
          {defaultItemsQueryData => {
            if (defaultItemsQueryData.loading) {
              this.props.setLoading(true);
              return null;
            }
            this.props.setLoading(false);
            {
              /* console.log("-------", userPreferenceQueryData); */
            }
            console.log("-------", defaultItemsQueryData);
            {
              /* let userPreference = {
                  skills: [],
                  targets: [],
                  activities: [],
                  hide: false
                }; */
            }
            let defaultItems = {
              skills: [],
              targets: [],
              activities: []
            };
            {
              /* if (userPreferenceQueryData.data) {
                  let getPreferences =
                    userPreferenceQueryData.data.getPreferences;
                  userPreference = {
                    skills: groupByModules(getPreferences.custom.skills),
                    targets: groupByModules(getPreferences.custom.targets),
                    activities: getPreferences.custom.activities,
                    hide: getPreferences.hide
                  };
                } */
            }

            if (defaultItemsQueryData.data) {
              let getDefaultItems = defaultItemsQueryData.data.getDefaultItems;
              defaultItems = {
                skills: groupByModules(getDefaultItems[0].skills),
                targets: groupByModules(getDefaultItems[0].targets),
                activities: getDefaultItems[0].activities
              };
            }

            return this.getContent(this.props.userPreference, defaultItems);
          }}
        </Query>
        {/* </Query> */}
        {/*return this.getContent(); */}
      </View>
    );
  }
}

export default AddEntryScreen;

AddEntryScreen.defaultProps = {
  defaultItems: {
    skills: [],
    targets: [],
    activities: []
  }
};
