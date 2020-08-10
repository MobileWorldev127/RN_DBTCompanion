import React, { Component, Fragment } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import styles from "./styles";
import Header from "../../components/Header";
import { Card } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import IconSelector from "../../components/iconSelector";
import { IconList as Icons } from "../../constants";
import CustomButton from "../../components/Button";
import ThemeStyle from "../../styles/ThemeStyle";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import { performNetworkTask } from "../../utils/NetworkUtils";
import { translate } from "../../utils/LocalizeUtils";
import * as Animatable from "react-native-animatable";

export default class ActivityScreen extends Component {
  constructor(props) {
    super(props);
    const {
      dataObj: { activities }
    } = this.props;
    let selectedObjects = (activities && activities) || [];
    let selected = selectedObjects.map(item => item.id);
    this.state = {
      selected,
      selectedObjects
    };
  }

  componentDidMount() {
    recordScreenEvent(screenNames.activity);
  }

  onSelect = icon => {
    let selected = [...this.state.selected];
    let selectedObjects = [...this.state.selectedObjects];
    let index = selected.indexOf(icon.id);
    let { __typename, description, ...rest } = icon;
    if (index > -1) {
      selected.splice(index, 1);
      selectedObjects.splice(index, 1);
    } else {
      selected.push(icon.id);
      selectedObjects.push(rest);
    }
    this.setState({ selected, selectedObjects });
  };
  next = () => {
    let obj = [...this.state.selectedObjects];
    this.props.next("activities", obj);
  };
  prev = () => {
    this.props.prev("activities", {});
  };
  isHidden = id =>
    this.props.hide &&
    this.props.hide.length > 0 &&
    this.props.hide.indexOf(id) > -1;
  renderIcons = activities =>
    activities
      .filter(item => !this.isHidden(item.id))
      .map(data => (
        <Animatable.View animation="zoomIn">
          <IconSelector
            key={data.id}
            name={data.title}
            image={Icons[data.icon.split(".")[0]]}
            selected={this.state.selected.indexOf(data.id) > -1}
            onPress={() => this.onSelect(data)}
            color={ThemeStyle.accentColor}
          />
        </Animatable.View>
      ));

  render() {
    const { activities, userActivities, navigation, hide } = this.props;
    const isDirty = this.state.selected.length > 0;
    console.log("vi", this.props);

    return (
      <Fragment>
        <Header title="Activities" goBack={this.prev} />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <Card containerStyle={styles.container}>
            <Text style={styles.mainHeader}>WHAT HAVE YOU BEEN UP TO?</Text>
            <View style={styles.content}>
              {this.renderIcons(activities)}
              {this.renderIcons(userActivities)}
              <Animatable.View animation="zoomIn">
                <IconSelector
                  name="edit/new"
                  image={Icons.plus}
                  onPress={() =>
                    performNetworkTask(
                      () => {
                        this.props.navigation.navigate("EditActivityScreen", {
                          data: activities,
                          customData: userActivities,
                          hide
                        });
                      },
                      "Editing activities is only allowed when online. Please check your internet connection and try again.",
                      true
                    )
                  }
                />
              </Animatable.View>
            </View>
            <View style={{ height: 30 }} />
          </Card>
        </ScrollView>
        <CustomButton
          style={{
            position: "absolute",
            bottom: 0,
            right: 24,
            marginBottom: 24,
            alignSelf: "flex-end"
          }}
          name={translate("Next")}
          onPress={this.next}
        />
      </Fragment>
    );
  }
}
