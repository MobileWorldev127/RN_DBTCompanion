import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from "react-native";
import Header from "../../components/Header";
import DescriptionModal from "../../components/descriptionModal";
import styles from "./styles";
import {
  IconList as Icons,
  getAmplifyConfig,
  getEnvVars
} from "../../constants";
import Icon from "react-native-vector-icons/Ionicons";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import { deleteCustomItem } from "../../queries";
import ThemeStyle from "../../styles/ThemeStyle";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../../utils";
import { translate } from "../../utils/LocalizeUtils";

export default class EditTargetScreen extends Component {
  constructor(props) {
    super(props);
    const {
      navigation: {
        state: { params }
      }
    } = props;
    // console.log('HEre1', params.hide)
    this.state = {
      icons: (params && params.data) || [],
      customIcons: (params && params.customData) || [],
      module: (params && params.module) || null,
      hide: (params && params.hide) || [],
      showDescriptionModal: false,
      descriptionContent: ""
    };
  }

  showDescriptionModal = type => () =>
    this.setState({ showDescriptionModal: type });
  isHidden = id => this.state.hide.indexOf(id) > -1;
  hideItem = id => {
    this.props.setLoading();
    this.props
      .hideTarget(id)
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
      .showTarget(id)
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
    icons &&
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
        editTarget={this.editTarget}
        confirmDelete={this.confirmDelete}
        data={data}
      />
    ));
  addTarget = () => {
    if (this.props.isSubscribed) {
      this.props.navigation.navigate("AddTargetScreen", {
        module: this.state.module,
        onGoBack: () => {
          this.props.getAllCustomPreferencesRequest();
        }
      });
    } else {
      this.props.showSubscription();
    }
  };
  editTarget = data => {
    if (this.props.isSubscribed) {
      this.props.navigation.navigate("AddTargetScreen", {
        module: this.state.module,
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

  confirmDelete = targetObj => {
    Alert.alert(
      translate("You might lose existing entries that reference these targets"),
      translate("Do you want to Continue ?"),
      [
        {
          text: translate("Cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: translate("OK"), onPress: () => this.deleteTarget(targetObj) }
      ],
      { cancelable: false }
    );
  };

  deleteTarget = data => {
    this.props.setLoading(true);
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    let queryData = {
      field: "targets",
      id: data.id
    };
    API.graphql(graphqlOperation(deleteCustomItem, queryData))
      .then(response => {
        console.log("success,", response);
        this.getCustomPreferences();
        showMessage({
          type: "success",
          message: translate("Target delete Successfully")
        });
      })
      .catch(err => {
        console.log("Error", err);
        showMessage(errorMessage());
      })
      .finally(() => {
        this.props.setLoading(false);
      });
  };

  componentDidMount() {
    // this.getCustomPreferences();
  }

  render() {
    const {
      icons,
      showDescriptionModal,
      descriptionContent,
      module
    } = this.state;
    const customIcons = this.props.userTargets[this.state.module];
    return (
      <Fragment>
        <Header
          title={translate("Edit Targets")}
          goBack={() => {
            // this.props.getAllCustomPreferencesRequest();
            this.props.navigation.goBack(null);
          }}
          rightIcon={() => (
            <Icon name="ios-add" size={35} color={ThemeStyle.accentColor} />
          )}
          onRightIconClick={this.addTarget}
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
              props.editTarget(props.data);
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
        {/* {props.custom && (
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              props.confirmDelete(props.data);
            }}
          >
            <Icon name="ios-trash" size={22} color={ThemeStyle.textColor} />
          </TouchableOpacity>
        )} */}
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
