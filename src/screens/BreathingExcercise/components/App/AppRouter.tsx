/* eslint-disable prettier/prettier */
import React, { FC, useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  Text,
  Alert
} from "react-native";
import { useDispatch } from 'react-redux'
import { useAppContext } from "../../context/AppContext";
import { ButtonAnimator } from "../ButtonAnimator/ButtonAnimator";
import { Exercise } from "./../Exercise/Exercise";
import { Menu } from "./../Menu/Menu";
import { Settings } from "./../Settings/Settings";
import { TechniquePicker } from "./../TechniquePicker/TechniquePicker";

import { useHardwareBackButton } from "./../../hooks/useHardwareBackButton";
import { deviceHeight } from "./../../config/constants";
import { TouchableOpacity } from "react-native-gesture-handler";

import Header from "./../../../../components/Header";
import { setTopSafeAreaView, setBottomSafeAreaView } from "../../../../actions/AppActions";
import ThemeStyle from '../../../../styles/ThemeStyle';

// export default () => <SvgUri width="200" height="200" svgXmlData={testSvg} />;

// AppRouter handles the navigation in the app.
// We have 4 main screens we want the user to navigate:
// - Menu (screen type: "main")
// - Exercise (screen type: "main")
// - Settings (screen type: "settings")
// - Technique Picker (screen type: "techniquepicker")
// Since the menu and the exercise screens needs a complex transition they're
// wrapped in the ButtonAnimator (identified by "main") component that takes
// care of their navigation and of their transition animations.

const breathing_exercise_logo = require("./../../drawables/breathing_exercise_logo.png");
type Screen =
  | "main"
  | "hiding-main"
  | "settings"
  | "hiding-settings"
  | "techniquepicker"
  | "hiding-techniquepicker";

// We also have a "page" information which keeps track of what screen the user
// is navigating to
type MenuPage = "settings" | "techniquepicker" | null;

type MainScreen = "menu" | "exercise";

// Navigation flow example:
// - User taps on the Settings button
// - handleSettingsButtonPress is triggered: is starts hiding the "main" by
//   setting currentMenuScreen to "hiding-main" and we keeps track of the
//    destination by setting currentMenuPage to "settings".
// - Once the "main" hide animation is completed handleButtonAnimatorHide is
//   triggered: it sets the current screen to "settings" (obtained from
//   the currentMenuPage). This means we can no safely unmount the "main" screen
//   (ButtonAnimator) and mount the "settings" screen, that animates its own
//   entrance automatically.

export const AppRouter: FC<Props> = ({
  props,
  navigation
}) => {

  const { theme } = useAppContext();
  const [currentScreen, setCurrentScreen] = useState<Screen>("main");
  const [currentMenuPage, setCurrentMenuPage] = useState<MenuPage>(null);
  const [currentMainScreen, setCurrentMainScreen] = useState<MainScreen>(
    "menu"
  );
  
  useHardwareBackButton(() => {
    if (currentScreen === "main" && currentMainScreen === "menu") {
      return false;
    }
    if (currentScreen === "settings") {
      handleSettingsBackButtonPress();
    } else if (currentScreen === "techniquepicker") {
      handleTechniquePickerBackButtonPress();
    }
    return true;
  });

  // useEffect(() => {
  //   if (currentMainScreen === "menu") {
  //     if (Platform.OS === "android") {
  //       changeNavigationBarColor(theme.backgroundColor, !theme.darkMode);
  //       StatusBar.setBackgroundColor(theme.backgroundColor);
  //     }
  //     StatusBar.setBarStyle(
  //       theme.darkMode ? "light-content" : "dark-content",
  //       true
  //     );
  //   } else if (currentMainScreen === "exercise") {
  //     if (Platform.OS === "android") {
  //       changeNavigationBarColor(theme.mainColor, false);
  //       StatusBar.setBackgroundColor(theme.mainColor);
  //     }
  //     StatusBar.setBarStyle("light-content", true);
  //   }
  // }, [
  //   theme.backgroundColor,
  //   theme.darkMode,
  //   theme.mainColor,
  //   currentMainScreen
  // ]);

  /**
  * Warning: This lifecycle is currently deprecated, and will be removed in React version 17+
  More details here: https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
  */
  

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setTopSafeAreaView(ThemeStyle.backgroundColor));
    dispatch(setBottomSafeAreaView('white'));
    return () => {
      dispatch(setTopSafeAreaView(ThemeStyle.gradientStart));
    }
  }, []);

 

  const handleButtonAnimatorExpand = () => {
    setCurrentMainScreen("exercise");
  };

  const handleButtonAnimatorClose = () => {
    setCurrentMainScreen("menu");
  };

  // A screen has three different states: completely visible, transitioning or
  // completely hidden.
  // With the *Mounted vars we keep track of which screen is actually
  // rendered.
  const buttonAnimatorMounted =
    currentScreen === "hiding-main" || currentScreen === "main";

  const techniquePickerMounted =
    currentScreen === "hiding-techniquepicker" ||
    currentScreen === "techniquepicker";

  const settingsMounted =
    currentScreen === "hiding-settings" || currentScreen === "settings";

  // Settings navigation
  const handleSettingsButtonPress = () => {
    setCurrentMenuPage("settings");
    setCurrentScreen("hiding-main");
  };

  const handleSettingsBackButtonPress = () => {
    setCurrentScreen("hiding-settings");
  };

  const handleSettingsHide = () => {
    setCurrentMenuPage(null);
    setCurrentScreen("main");
  };

  // Technique-Picker navigation
  const handleTechniquePickerButtonPress = () => {
    setCurrentMenuPage("techniquepicker");
    setCurrentScreen("hiding-main");
  };

  const handleTechniquePickerBackButtonPress = () => {
    setCurrentScreen("hiding-techniquepicker");
  };

  const handleTechniquePickerHide = () => {
    setCurrentMenuPage(null);
    setCurrentScreen("main");
  };

  // Once the ButtonAnimator hides completely sets the current screen to the
  // page we are planning to navigate to
  const handleButtonAnimatorHide = () => {
    if (currentMenuPage) setCurrentScreen(currentMenuPage);
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        style={styles.breathing_exercise_logo}
        source={breathing_exercise_logo}
      />
      {!settingsMounted && <Header
        goBack={() => {
          navigation.goBack(null);
        }}
      />}
      {buttonAnimatorMounted && (
        <ButtonAnimator
          visible={currentScreen === "main"}
          onHide={handleButtonAnimatorHide}
          onExpandPress={handleButtonAnimatorExpand}
          onClosePress={handleButtonAnimatorClose}
          front={
            <Menu
              onTechniquePickerPress={handleTechniquePickerButtonPress}
              onSettingsPress={handleSettingsButtonPress}
            />
          }
          back={<Exercise navigation={navigation}/>}
        />
      )}

      {techniquePickerMounted && (
        <TechniquePicker
          visible={currentScreen === "techniquepicker"}
          onHide={handleTechniquePickerHide}
          onBackButtonPress={handleTechniquePickerBackButtonPress}
        />
      )}
      {settingsMounted && (
        <Settings
          visible={currentScreen === "settings"}
          onHide={handleSettingsHide}
          onBackButtonPress={handleSettingsBackButtonPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  breathing_exercise_logo: {
    marginTop: deviceHeight / 6,
    width: 500,
    height: 500,
    position: "absolute",
    alignSelf: "center"
  }
});
