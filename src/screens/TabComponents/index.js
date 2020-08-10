import React from "react";
import { View } from "react-native";
import FooterComponent from "./FooterComponent";
import { tabRoutes } from "./routes";
import EntriesScreen from "../EntriesScreen";
import Lessons from "./../lessons/LessonsScreen";
// import AddEntry from "./../addEntry";
import AddEntry from "./AddScreen";
import MoreScreen from "./../MoreScreen";
import ExerciseModules from "./../exercise/ExerciseListScreen";
import { withSafeAreaActions } from "../../utils/StoreUtils";
import ThemeStyle from "../../styles/ThemeStyle";

let tabbar;

export const getTabBar = () => {
  return tabbar;
};

const setTabBar = ref => {
  tabbar = ref;
};

class HomeTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: tabRoutes.HomeScreen.name,
      tabBarVisible: true
    };
    setTabBar(this);
  }

  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      payload => {
        console.log("FOCUSED HOME", payload);
        this.props.setBottomSafeAreaView("#fff");
        this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
      }
    );
    this.willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      payload => {
        console.log("FOCUSED HOME", payload);
        this.props.setBottomSafeAreaView(ThemeStyle.backgroundColor);
      }
    );
  }

  componentWillUnmount() {
    if (
      this.willFocusSubscription &&
      typeof this.willFocusSubscription.remove === `function`
    ) {
      this.willFocusSubscription.remove();
    }
    if (
      this.willBlurSubscription &&
      typeof this.willBlurSubscription.remove === `function`
    ) {
      this.willBlurSubscription.remove();
    }
  }

  onChangeSelectedTab = activeTab => {
    this.overrideActiveTab = null;
    this.setState({
      activeTab
    });
  };

  toggleTabBar = tabBarVisible => {
    this.setState({
      tabBarVisible
    });
  };

  render() {
    const { activeTab } = this.state;
    const { navigation } = this.props;
    if (navigation.state.params) {
      this.overrideActiveTab = navigation.state.params.activeTab;
      navigation.state.params.activeTab = null;
    }
    console.log("PARaMS", activeTab, this.overrideActiveTab);
    const currentTab = this.overrideActiveTab || activeTab;
    return (
      <View style={{ flex: 1 }}>
        {currentTab === tabRoutes.HomeScreen.name && (
          <EntriesScreen
            navigation={navigation}
            onChangeSelectedTab={this.onChangeSelectedTab}
          />
        )}
        {currentTab === tabRoutes.More.name && (
          <MoreScreen navigation={navigation} />
        )}
        {currentTab === tabRoutes.ExerciseModules.name && (
          <ExerciseModules navigation={navigation} />
        )}
        {currentTab === tabRoutes.Record.name && (
          <AddEntry
            navigation={navigation}
            toggleTabBar={this.toggleTabBar}
            onChangeSelectedTab={this.onChangeSelectedTab}
          />
        )}
        {currentTab === tabRoutes.Lessons.name && (
          <Lessons navigation={navigation} />
        )}
        <View style={{ display: this.state.tabBarVisible ? "flex" : "none" }}>
          <FooterComponent
            navigation={navigation}
            onChangeSelectedTab={this.onChangeSelectedTab}
          />
        </View>
      </View>
    );
  }
}

export default withSafeAreaActions(HomeTabs);
