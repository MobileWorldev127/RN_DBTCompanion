import React, { Component } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { addCrisis as styles } from "./styles";
import Icon from "react-native-vector-icons/Ionicons";
import CustomCrisis from "./customCrisisItem";
import SkillsList from "../skillsList/SkillsListScreen";
import ThemeStyle from "../../styles/ThemeStyle";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../../utils";
import { translate } from "../../utils/LocalizeUtils";
import Button from "../../components/Button";

export default class AddCrisis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentScreen: "selector",
      skillId: "",
      icon: null,
      title: "",
      desc: "",
      isDirty: false
    };
    this.handle = {
      show: () => this.setState({ visible: true }),
      hide: () =>
        this.setState({
          visible: false,
          currentScreen: "selector",
          title: "",
          desc: "",
          icon: null,
          isDirty: false,
          skillId: "",
          tags: ""
        })
    };
    props.setHandle(this.handle);
  }

  changeScreen = screen => this.setState({ currentScreen: screen });

  subscribe = () => {
    if (this.props.premium) {
      this.changeScreen("form");
    } else {
      this.handle.hide();
      this.props.openSubscription();
    }
  };

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) &&
      nextProps.currentItem !== null
    ) {
      let obj = nextProps.currentItem;
      const isDirty = obj.skillId !== "None" && obj.skillId !== null;
      this.setState({
        title: obj.title,
        desc: obj.description,
        icon: obj.icon,
        skillId: obj.skillId,
        tags: obj.tags.join(","),
        isDirty,
        currentScreen: "form",
        id: obj.id
      });
    }
  }

  selectIcon = icon => {
    this.setState({
      icon: icon.icon,
      title: icon.title,
      desc: icon.description,
      currentScreen: "form",
      isDirty: true,
      skillId: icon.id
    });
    this.changeScreen("form");
  };

  addCustomIcon = icon => this.setState({ icon });
  showError = () => showMessage(errorMessage(translate("Please add some tags!!")));

  getContent = () => {
    const {
      currentScreen,
      title,
      desc,
      isDirty,
      icon,
      skillId,
      tags,
      id
    } = this.state;
    switch (currentScreen) {
      case "skill":
        return (
          <SkillsList
            onItemClick={this.selectIcon}
            showHeader={false}
            showDescription={false}
          />
        );
      case "form":
        return (
          <CustomCrisis
            id={id}
            skillId={skillId}
            addIcon={this.addCustomIcon}
            icon={icon}
            title={title}
            desc={desc}
            close={this.handle.hide}
            tags={tags}
            readOnly={isDirty}
            showError={this.showError}
            mode={this.props.mode}
            setLoading={this.props.setLoading}
          />
        );
      case "selector":
      default:
        return (
          <Selector
            changeScreen={this.changeScreen}
            subscribe={this.subscribe}
          />
        );
    }
  };

  render() {
    const { close, mode } = this.props;
    return (
      <Modal
        visible={this.state.visible}
        animationType="fade"
        onRequestClose={close}
      >
        <SafeAreaView backgroundColor={"#fff"}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {" "}
              {mode === "edit" ? "Edit Crisis Survival Item" : "Add Crisis Survival Item"}
              {" "}
            </Text>
            <TouchableOpacity style={styles.close} onPress={close}>
              <Icon name="ios-close" size={35} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        {this.getContent()}
      </Modal>
    );
  }
}

const Selector = ({ changeScreen, subscribe }) => (
  <View style={styles.selector}>
    <Text style={styles.selectorText}>{translate("Please select an option")}</Text>
    <Button
      name={translate("Choose from Skills")}
      style={{ marginVertical: 16 }}
      onPress={() => changeScreen("skill")}
    />
    <Button name={translate("Add your own Item")} onPress={subscribe} />
  </View>
);
