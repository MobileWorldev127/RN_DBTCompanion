import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import PopupDialog, {
  ScaleAnimation,
  DialogContent
} from "react-native-popup-dialog";
import { Title } from "../../components/Share";
import { translate } from "../../utils/LocalizeUtils";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";

const scaleAnimation = new ScaleAnimation();

export default class NotesDesc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  setRef = dialog => {
    this.dialog = dialog;
    this.props.setRef && this.props.setRef(dialog);
  };

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
        width={0.9}
        visible={this.state.visible}
        height={0.5}
        containerStyle={{ zIndex: 70 }}
        dialogTitle={
          <Title
            title={translate("How I used this survival skill")}
            onClose={() => this.hide()}
          />
        }
        dialogAnimation={scaleAnimation}
      >
        <DialogContent>
          <View style={styles.container}>
            <Text>{this.props.description}</Text>
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
    paddingVertical: 24
  },
  input: {
    height: 180
  },
  button: {
    backgroundColor: ThemeStyle.mainColor,
    alignSelf: "center",
    paddingVertical: 10,
    justifyContent: "center",
    width: "100%",
    borderRadius: 5,
    marginLeft: -20,
    marginRight: -20
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 18
  }
});
