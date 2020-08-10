import React, { Component } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { countHistory as styles } from "./styles";
import { ListItem } from "react-native-elements";
import moment from "moment";
import { translate } from "../../utils/LocalizeUtils";

import PopupDialog, { ScaleAnimation } from "react-native-popup-dialog";

export default class CountHistory extends Component {
  dialog = {};
  static defaultProps = {
    history: []
  };
  state = {
    current: ""
  };
  // notes popup not showing.
  renderHistory = (checkinDate, desc, index) => {
    let date = moment(checkinDate).format("DD MMMM YYYY");
    let time = moment(checkinDate).format("h:mm A");
    return (
      <TouchableOpacity
        onPress={() => this.props.onShowDescription(desc)}
        key={index}
      >
        <ListItem
          title={date}
          titleStyle={{ opacity: 0.9, fontSize: 15 }}
          rightTitle={time}
          hideChevron={true}
          containerStyle={{ borderBottomWidth: 0.3 }}
        />
      </TouchableOpacity>
    );
  };

  // getDescription = () => (
  //   <PopupDialog
  //     ref={dialog => this.dialog = dialog}
  //     width={0.9}
  //     // height={373}
  //     dialogTitle={<Title title="Checkin" onClose={() => this.dialog.dismiss()} />}
  //     dialogAnimation={scaleAnimation}
  //   >
  //     <View style={styles.descContainer}>
  //       <Text style={styles.descText}>{this.state.current}</Text>
  //     </View>
  //   </PopupDialog>
  // )
  render() {
    const { visible, onClose } = this.props;
    let history = this.props.history ? [...this.props.history] : [];
    history.sort((a, b) => new Date(b.date) - new Date(a.date));
    return (
      <View style={{ zIndex: 1 }}>
        <Modal
          animationType="slide"
          visible={visible}
          transparent
          onRequestClose={onClose}
        >
          <View style={styles.wrapper}>
            <TouchableOpacity style={styles.overlay} onPress={onClose} />
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.headerText}>
                  {translate("I did this previously on")}:{" "}
                </Text>
              </View>
              <ScrollView>
                {history &&
                  history.map((obj, index) =>
                    this.renderHistory(obj.date, obj.description, index)
                  )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
