import React, { Component } from "react";
import PopupDialog, {
  ScaleAnimation,
  DialogContent
} from "react-native-popup-dialog";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from "react-native";
import { Title } from "../../components/Share";
import { translate } from "../../utils/LocalizeUtils";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";

const scaleAnimation = new ScaleAnimation();

export default class AddNotes extends Component {
  desc = "";
  state = {
    desc: "",
    visible: false
  };
  setRef = dialog => {
    this.dialog = dialog;
    this.props.setRef && this.props.setRef(dialog);
  };
  save = () => {
    let obj = {
      id: this.props.id,
      date: new Date().toString(),
      description: this.state.desc,
      msg: "",
      __typename: "checkinCrisisItem"
    };
    this.setState({ desc: "" });
    this.props.onSave(obj);
    this.hide();
  };

  // componentDidMount() {
  //   this.props.setRef(this)
  // }
  // componentWillUnmount() {
  //   this.props.setRef(undefined)
  // }

  show = () => {
    this.setState({
      visible: true
    });
  };

  hide = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    return (
      <PopupDialog
        ref={this.setRef}
        visible={this.state.visible}
        width={0.9}
        height={0.5}
        dialogTitle={
          <Title title={translate("How I used this skill")} onClose={() => this.hide()} />
        }
        dialogStyle={{paddingTop: 24}}
        dialogAnimation={scaleAnimation}
      >
        <DialogContent>
          <View style={styles.container}>
            {/* <Text style={styles.label}>Description</Text> */}
            <TextInput
              onChangeText={desc => this.setState({ desc })}
              value={this.state.desc}
              style={styles.input}
              multiline={true}
              blurOnSubmit={true}
              placeholder={translate("Checkin Notes....")}
            />
            <TouchableOpacity style={styles.button} onPress={this.save}>
              <Text style={styles.buttonText}>{translate("Save")}</Text>
            </TouchableOpacity>
          </View>
        </DialogContent>
      </PopupDialog>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    paddingBottom: 48,
    paddingTop: 24
  },
  input: {
    height: 180
  },
  button: {
    backgroundColor: ThemeStyle.accentColor,
    paddingVertical: 10,
    justifyContent: "center",
    width: "100%",
    borderRadius: 24
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 18
  }
});
