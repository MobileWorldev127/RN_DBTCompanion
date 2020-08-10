import React, { Component } from "react";
import { ScrollView, View } from "react-native";
import Header from "./../components/Header";
import HTML from "react-native-render-html";
import { APP } from "../constants";
import ThemeStyle from "../styles/ThemeStyle";
import TextStyles from "../common/TextStyles";
import { withSafeAreaActions } from '../utils/StoreUtils';
import { setTopSafeAreaView } from '../actions/AppActions';

class AboutScreen extends Component {
  componentDidMount() {
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
  }

  componentWillUnmount() {
    this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
  }
  
  render() {
    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          title="About"
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <HTML
            html={APP.aboutContent}
            baseFontStyle={{
              color: "#4F4F4F",
              fontSize: 14,
              lineHeight: 17
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

export default withSafeAreaActions(AboutScreen, dispatch => ({
  setTopSafeAreaView: color => dispatch(setTopSafeAreaView(color))
}));