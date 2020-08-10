import React, { Component, Fragment } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import Header from "../../components/Header";
import DescriptionModal from "../../components/descriptionModal";
import { translate } from "../../utils/LocalizeUtils";
import styles from "./styles";
import { IconList as Icons } from "../../constants";
import Icon from "react-native-vector-icons/Ionicons";
import ThemeStyle from "../../styles/ThemeStyle";

export default class EditActivityScreen extends Component {
  constructor(props) {
    super(props);
    const {
      navigation: {
        state: { params }
      }
    } = props;
    this.state = {
      icons: (params && params.data) || [],
      customIcons: (params && params.customData) || [],
      hide: (params && params.hide) || [],
      showDescriptionModal: false,
      descriptionContent: ""
    };
  }
  showDescriptionModal = type => () =>
    this.setState({ showDescriptionModal: type });
  isHidden = id => this.state.hide.indexOf(id) > -1;
  hideItem = id => {
    this.props.setLoading(true);
    this.props
      .hideActivity(id)
      .then(res => {
        let hide = [...this.state.hide];
        hide.push(id);
        this.setState({ hide });
        this.props.getAllCustomPreferencesRequest();
      })
      .finally(() => {
        this.props.setLoading(false);
      });
  };
  showItem = id => {
    this.props.setLoading(true);
    this.props
      .showActivity(id)
      .then(res => {
        let hide = [...this.state.hide];
        hide = hide.filter(item => item !== id);
        this.setState({ hide });
        this.props.getAllCustomPreferencesRequest();
      })
      .finally(() => {
        this.props.setLoading(false);
      });
  };
  renderHelp = icon => {
    this.setState({ showDescriptionModal: true, descriptionContent: icon });
  };
  renderIcons = (icons, custom = false) =>
    icons.map((data, i) => (
      <ListButton
        key={i}
        title={data.title}
        icon={Icons[data.icon.split(".")[0]]}
        onHideToggle={() =>
          this.isHidden(data.id)
            ? this.showItem(data.id)
            : this.hideItem(data.id)
        }
        hidden={this.isHidden(data.id)}
        onHelp={() => this.renderHelp(data)}
        custom={custom}
        editActivity={this.editActivity}
        data={data}
      />
    ));
  addActivity = () => {
    if (this.props.isSubscribed) {
      this.props.navigation.navigate("AddActivityScreen", {
        onGoBack: () => {
          this.props.getAllCustomPreferencesRequest();
        }
      });
    } else {
      this.props.showSubscription();
    }
  };
  editActivity = data => {
    if (this.props.isSubscribed) {
      this.props.navigation.navigate("AddActivityScreen", {
        mode: "EDIT",
        data: data,
        onGoBack: () => {
          this.props.getAllCustomPreferencesRequest();
        }
      });
    } else {
      this.props.showSubscription();
    }
  };

  render() {
    const { icons, showDescriptionModal, descriptionContent } = this.state;
    const customIcons = this.props.userActivities;
    return (
      <Fragment>
        <Header
          title={translate("Edit Activities")}
          goBack={() => {
            // this.props.getAllCustomPreferencesRequest();
            this.props.navigation.goBack();
          }}
          rightIcon={() => (
            <Icon
              name="ios-add"
              size={35}
              color={ThemeStyle.accentColor}
            />
          )}
          onRightIconClick={this.addActivity}
        />
        <ScrollView>
          {this.renderIcons(icons)}
          {this.renderIcons(customIcons, true)}
        </ScrollView>
        <DescriptionModal
          visible={showDescriptionModal}
          onClose={this.showDescriptionModal(false)}
          content={descriptionContent}
        />
      </Fragment>
    );
  }
}

const ListButton = props => {
  return (
    <View style={[styles.list, props.style]}>
      <View style={{ flexDirection: "row" }}>
        <Image source={props.icon} style={styles.icon} />
        <Text style={styles.label}>{props.title}</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {props.custom && (
          <TouchableOpacity
            onPress={() => {
              props.editActivity(props.data);
            }}
            style={{ marginHorizontal: 10 }}
          >
            <Icon name={"md-create"} size={19} color={ThemeStyle.textColor} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={props.onHideToggle}
          style={{ marginHorizontal: 10 }}
        >
          <Icon
            name={props.hidden ? "ios-eye-off" : "ios-eye"}
            size={25}
            color={ThemeStyle.textColor}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 10 }} onPress={props.onHelp}>
          <Icon
            name="ios-help-circle-outline"
            size={22}
            color={ThemeStyle.textColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
