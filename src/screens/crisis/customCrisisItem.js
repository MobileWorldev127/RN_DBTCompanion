import React, { Component } from "react";
import {
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity
} from "react-native";
import { customCrisis as styles } from "./styles";
import HTML from "react-native-render-html";
import { IconList as Icons } from "../../constants";
import IconSelector from "./iconSelector";
import {
  addCrisisItemQuery,
  getCrisisItemsQuery,
  editCrisisItemQuery
} from "../../queries/crisis";
import { compose, graphql } from "react-apollo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "../../components/Button";
import { translate } from "../../utils/LocalizeUtils";


class CustomCrisisItem extends Component {
  tags = "";
  title = "";
  desc = "";
  state = {
    iconSelectorVisible: false
  };

  componentWillReceiveProps(nextProps) {
    this.tags = nextProps.tags;
  }

  description = () => {
    const { desc, readOnly } = this.props;
    return readOnly ? (
      <ScrollView
        style={{
          height: 150,
          backgroundColor: "#eee",
          padding: 10,
          marginBottom: 20,
          marginTop: 10,
          borderWidth: 1,
          borderColor: "#ccc"
        }}
      >
        <HTML html={desc} baseFontStyle={styles.description} />
      </ScrollView>
    ) : (
      <TextInput
        defaultValue={desc}
        style={[styles.input, styles.desc]}
        multiline={true}
        numberOfLines={4}
        underlineColorAndroid="transparent"
        onChangeText={desc => (this.desc = desc)}
      />
    );
  };

  iconSection = () => {
    const { icon, readOnly } = this.props;
    return readOnly || icon ? (
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() =>
          readOnly ? null : this.setState({ iconSelectorVisible: true })
        }
      >
        <Image source={Icons[icon && icon.split(".")[0]]} style={styles.icon} />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={() => this.setState({ iconSelectorVisible: true })}
      >
        <Image
          source={require("../../assets/images/select-image.jpg")}
          style={styles.iconSelect}
        />
      </TouchableOpacity>
    );
  };

  selectIcon = icon => {
    this.props.addIcon(icon);
    this.setState({ iconSelectorVisible: false });
  };

  iconSelector = () => <IconSelector selectIcon={this.selectIcon} />;

  save = () => {
    const {
      icon,
      title,
      desc,
      skillId,
      close,
      onAddCrisis,
      onEditCrisis,
      mode,
      id,
      tags
    } = this.props;
    let tagItems = (this.tags && this.tags.length) ?  this.tags : "";
    if (tagItems.trim().length === 0) {
      this.props.showError();
      return;
    }
    tagItems = tagItems.split(",");
    let crisisObj = {
      icon,
      title: this.title.length > 0 ? this.title : title,
      description: this.desc.length > 0 ? this.desc : desc,
      skillId: skillId || "None",
      tags: tagItems,
      msg: "",
      __typename: "Crisis"
    };
    if (mode === "add") {
      this.props.setLoading(true);
      onAddCrisis(crisisObj)
        .then(res => {
          close();
        })
        .catch(err => {
          console.log("Error adding Crisis Item: ", err);
        })
        .finally(() => {
          this.props.setLoading(false);
        });
    } else {
      crisisObj.id = id;
      this.props.setLoading(true);
      onEditCrisis(crisisObj)
        .then(res => {
          close();
        })
        .catch(err => {
          console.log("Error editing crisis ", err);
        })
        .finally(() => {
          this.props.setLoading(false);
        });
    }
  };

  getContent = () => {
    const { title, tags, readOnly } = this.props;
    return (
      <KeyboardAwareScrollView
        behavior="position"
        keyboardVerticalOffset={-50}
        enabled
      >
        {this.iconSection()}
        <Text style={styles.label}>{translate("Title")}</Text>
        <TextInput
          defaultValue={title}
          style={[
            styles.input,
            readOnly
              ? { backgroundColor: "#eee", borderWidth: 1, borderColor: "#ccc" }
              : {}
          ]}
          underlineColorAndroid="transparent"
          editable={!readOnly}
          onChangeText={title => (this.title = title)}
        />
        <Text style={styles.label}>Description</Text>
        {this.description()}
        <Text style={styles.label}>
          {translate("Tags")} <Text style={{ color: "red" }}>*</Text>{" "}
          <Text style={styles.tagInfo}>( {translate("Enter tags seprated by comma")} )</Text>
        </Text>
        <TextInput
          defaultValue={tags}
          style={styles.input}
          onChangeText={tags => (this.tags = tags)}
          underlineColorAndroid="transparent"
        />
        <Button name={translate("Save")} onPress={this.save} />
      </KeyboardAwareScrollView>
    );
  };

  render() {
    const { iconSelectorVisible } = this.state;
    return (
      <ScrollView style={styles.container}>
        {iconSelectorVisible ? this.iconSelector() : this.getContent()}
      </ScrollView>
    );
  }
}

export default compose(
  graphql(addCrisisItemQuery, {
    props: props => ({
      onAddCrisis: crisis =>
        props.mutate({
          variables: crisis,
          optimisticResponse: () => ({ addCrisisItem: crisis })
        })
    }),
    options: {
      refetchQueries: [{ query: getCrisisItemsQuery }],
      update: (dataProxy, fetchedObj) => {
        const query = getCrisisItemsQuery;
        const data = dataProxy.readQuery({ query });
        let response = fetchedObj.data.addCrisisItem.msg;
        if (response.length) {
          let obj = JSON.parse(response);
          obj.__typename = "CrisisItemRecord";
          obj.crisisItem.__typename = "Crisis";
          obj.checkinCount = [];
          obj.checkinDates = [];
          data.getCrisisItems.push(obj);
        }
      }
    }
  }),
  graphql(editCrisisItemQuery, {
    props: props => ({
      onEditCrisis: crisis =>
        props.mutate({
          variables: crisis,
          optimisticResponse: () => ({ editCrisisItem: crisis })
        })
    }),
    options: {
      refetchQueries: [{ query: getCrisisItemsQuery }],
      update: (dataProxy, fetchedObj) => {
        const query = getCrisisItemsQuery;
        const data = dataProxy.readQuery({ query });
        let response = fetchedObj.data.editCrisisItem.msg;
        if (response.length) {
          let obj = JSON.parse(response);
          data.getCrisisItems = data.getCrisisItems.filter(
            item => item.id !== obj.id
          );
          dataProxy.writeQuery({ query, data });
        }
      }
    }
  })
)(CustomCrisisItem);
