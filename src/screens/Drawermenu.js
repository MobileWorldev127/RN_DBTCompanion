import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Linking,
  Platform,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationActions, StackActions } from "react-navigation";
import { DrawerActions } from "react-navigation-drawer";
import ThemeStyle from "../styles/ThemeStyle";
import LinearGradient from "react-native-linear-gradient";
import Icon from "../common/icons";
import { Auth, Storage } from "aws-amplify";
import { showMessage } from "react-native-flash-message";
import TextStyles from "../common/TextStyles";
import { withSubscriptionActions } from "../utils/StoreUtils";
import { translate } from "../utils/LocalizeUtils";
import { APP } from "../constants";

class Drawermenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.drawerItems = [
      {
        title: translate("Tour"),
        onPress: () => this.props.navigation.navigate("Onboarding"),
        image: require("../src/tour.png"),
        isIcon: false
      },
      // {
      //   title: "Homeworks",
      //   onPress: () =>
      //     this.props.isSubscribed
      //       ? this.props.navigation.navigate("HomeworkScreen")
      //       : this.props.showSubscription(),
      //   iconName: "book",
      //   iconFamily: "MaterialIcons",
      //   isIcon: true
      // },
      // {
      //   title: "Assessments",
      //   onPress: () =>
      //     this.props.isSubscribed
      //       ? this.props.navigation.navigate("AssessmentsScreen")
      //       : this.props.showSubscription(),
      //   iconName: "format-list-bulleted",
      //   iconFamily: "MaterialIcons",
      //   isIcon: true
      // },
      // {
      //   title: "Quiz",
      //   onPress: () =>
      //     this.props.isSubscribed
      //       ? this.props.navigation.navigate("QuizScreen")
      //       : this.props.showSubscription(),
      //   iconName: "question",
      //   iconFamily: "SimpleLineIcons",
      //   isIcon: true
      // },
      {
        title: translate("Settings"),
        onPress: () => this.props.navigation.navigate("SettingScreen"),
        iconName: "settings",
        iconFamily: "SimpleLineIcons",
        isIcon: true
      },
      {
        title: translate("The Science"),
        onPress: () => this.props.navigation.navigate("AboutScreen"),
        iconName: "info-outline",
        iconFamily: "MaterialIcons",
        isIcon: true
      },
      {
        title: translate("FAQs"),
        onPress: () => this.props.navigation.navigate("FaqScreen"),
        iconName: "question-outline",
        iconFamily: "MaterialIcons",
        isIcon: true
      },
      {
        title: translate("Privacy Policy"),
        onPress: () => {
          Linking.openURL(APP.privacyPolicy);
        },
        iconName: "lock-open",
        iconFamily: "MaterialIcons",
        isIcon: true
      },
      {
        title: translate("Terms & Conditions"),
        onPress: () => {
          Linking.openURL(APP.tnc);
        },
        iconName: "chrome-reader-mode",
        iconFamily: "MaterialIcons",
        isIcon: true
      },
      {
        title: translate("Support"),
        onPress: () => {
          Linking.openURL(APP.support);
        },
        iconName: "headset-mic",
        iconFamily: "MaterialIcons",
        isIcon: true
      },
      {
        title: `${translate('Rate')} ${APP.appName}`,
        onPress: () => {
          Alert.alert(`${translate('Do you like using')} ${APP.appName}?`, "", [
            {
              text: translate("Not Really"),
              onPress: () => {
                Linking.openURL(APP.review);
              },
              style: "default"
            },
            {
              text: `${translate("Yes")}!`,
              onPress: () => {
                Alert.alert(
                  `${translate('Please give')} ${APP.appName} 5*s`,
                  translate("If you love it, please take a moment to rate it on App Store. Thanks for your support!"),
                  [
                    { text: translate("No, Thanks"), style: "default" },
                    {
                      text: translate("Rate It Now"),
                      style: "default",
                      onPress: () => {
                        try {
                          if (Platform.OS === "ios") {
                            const url = `${APP.appStoreLink}?action=write-review`;
                            Linking.openURL(url);
                          } else {
                            Linking.openURL(APP.playStoreLink);
                          }
                        } catch (err) {
                          console.log("ERROR", err);
                        }
                      }
                    }
                  ]
                );
              },
              style: "default"
            }
          ]);
        },
        iconName: "star-o",
        iconFamily: "FontAwesome",
        isIcon: true
      },
      {
        title: translate("Logout"),
        onPress: () => {
          Auth.signOut()
            .then(data => {
              AsyncStorage.clear();
              const resetAction = StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: "LoginScreen" })
                ]
              });
              this.props.navigation.dispatch(resetAction);
            })
            .catch(err => {
              console.log(err);
              showMessage({
                message: "Failed to logout. Please try again",
                type: "danger"
              });
            });
        },
        iconName: "upload",
        iconFamily: "Feather",
        isIcon: true
      }
    ];
  }

  componentDidMount() {
    Auth.currentUserInfo()
      .then(currentUserInfo => {
        console.log("USER INFO", currentUserInfo);
        Storage.get(currentUserInfo.attributes.picture, {
          level: "protected"
        }).then(url => {
          this.setState({ image: url });
        });
        this.setState({
          userName: currentUserInfo.attributes.name,
          userEmail: currentUserInfo.attributes.email
        });
      })
      .catch(err => console.log(err));
  }

  navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
    this.props.navigation.dispatch(navigateAction);
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-start"
          }}
        >
          <View
            style={{
              justifyContent: "center",
              padding: 24
            }}
          >
            <Image
              source={
                this.state.image
                  ? { uri: this.state.image, cache: "force-cache" }
                  : require("../src/avatar.jpg")
              }
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
                resizeMode: "contain"
              }}
              resizeMode="cover"
            />
            <Text
              style={[
                TextStyles.SubHeaderBold,
                {
                  marginTop: 12,
                  color: ThemeStyle.mainColor,
                  fontSize: 16,
                  fontWeight: "bold"
                }
              ]}
            >
              {this.state.userName}
            </Text>
            <Text
              style={[
                TextStyles.GeneralText,
                {
                  color: "#828282"
                }
              ]}
            >
              {this.state.userEmail}
            </Text>
          </View>
        </View>
        <View style={{ flex: 3.5 }}>
          {this.drawerItems.map((item, i) => (
            <TouchableOpacity
              style={{
                paddingHorizontal: 32,
                paddingVertical: item.title === "Logout" ? 48 : 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start"
              }}
              key={i}
              onPress={item.onPress}
            >
              {item.isIcon ? (
                <Icon
                  name={item.iconName}
                  color={
                    item.title === "Logout"
                      ? "#FF5F58"
                      : TextStyles.SubHeaderBold.color
                  }
                  size={24}
                  family={item.iconFamily}
                />
              ) : (
                <Image
                  source={item.image}
                  style={{
                    height: 24,
                    width: 24,
                    resizeMode: "contain",
                    tintColor: TextStyles.SubHeaderBold.color
                  }}
                />
              )}
              <Text
                style={[
                  TextStyles.SubHeaderBold,
                  {
                    marginLeft: 12,
                    fontSize: 16,
                    color:
                      item.title === "Logout"
                        ? "#FF5F58"
                        : TextStyles.SubHeaderBold.color
                  }
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}

export default withSubscriptionActions(Drawermenu);

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1
  },
  container: {
    flex: 1
  },
  section1: {
    flex: 0.35,
    backgroundColor: "#72c6a4",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  section2: {
    flex: 0.75
  },
  part01: {
    alignItems: "center",
    justifyContent: "center"
  },
  imagestyle: {
    height: 100,
    width: 100,
    borderRadius: 50,
    resizeMode: "cover"
  },
  partrow: {
    alignItems: "center",
    paddingVertical: Platform.OS === "ios" ? 17 : 7
  },
  scroll: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 10
  }
});
