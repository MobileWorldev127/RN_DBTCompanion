import React, { Component, Fragment } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Alert,
  InteractionManager
} from "react-native";
import styles from "./styles";
import Header from "../../components/Header";
import CrisisItem from "./crisisItem";
import Icon from "react-native-vector-icons/Ionicons";
import AddCrisis from "./addCrisis";
import CountHistory from "./countHistory";
import NotesDescription from "./notesDesc";
import DescriptionModal from "../../components/descriptionModal";
import { graphql, compose } from "react-apollo";
import {
  getCrisisItemsQuery,
  deleteCrisisItemQuery,
  crisisCheckinQuery
} from "../../queries";
import Loader from "../../components/Loader";
import { translate } from "../../utils/LocalizeUtils";
import { call, errorMessage } from "../../utils";
import AddNotes from "./addNotes";
import ThemeStyle from "../../styles/ThemeStyle";
import { withSubscriptionActions } from "../../utils/StoreUtils";
import { showMessage } from "react-native-flash-message";
import { Auth } from "aws-amplify";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";

class CrisisScreen extends Component {
  addCrisis = {};
  updateCheckin = {};
  state = {
    countHistoryVisible: false,
    countHistory: null,
    showDescriptionModal: false,
    descriptionContent: null,
    mode: "add",
    currentItem: null, // for description
    checkinItem: null, // for notes,,
    countDescription: "",
    interactions: true
  };
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ interactions: false });
    });
    recordScreenEvent(screenNames.crisisList);
  }
  showDescriptionModal = type => () =>
    this.setState({ showDescriptionModal: type });
  setHandle = handle => {
    this.addCrisis = handle;
    this.forceUpdate();
  };
  showCountHistory = bool => () => this.setState({ countHistoryVisible: bool });

  selectedCrisisItem = history => {
    this.setState({ countHistory: history, countHistoryVisible: true });
  };

  showDescription = item =>
    this.setState({ showDescriptionModal: true, descriptionContent: item });

  closeCrisisModal = () => {
    this.setState({ mode: "add", currentItem: null });
    this.addCrisis.hide();
  };

  editItem = item => {
    this.setState({ mode: "edit", currentItem: item });
    this.addCrisis.show();
  };

  checkin = id => {
    this.setState({ checkinItem: id });
    this.checkinModal.show();
    // this.refs.checkinModal.show();
  };

  onCheckinSave = obj => this.updateCheckin[obj.id](obj);

  onShowCountDescription = desc => {
    this.setState({ countDescription: desc });
    this.showCountHistory(false)();
    this.notesDesc.show();
  };

  deleteItem = id => {
    let obj = {
      id,
      msg: "",
      __typename: "Crisis"
    };
    Alert.alert(
      translate("Delete crisis survial entry?"),
      translate("This will permanently delete this entry."),
      [
        {
          text: translate("Cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: translate("OK"), onPress: () => this.confirmDelete(obj) }
      ],
      { cancelable: false }
    );
  };

  confirmDelete = obj => {
    this.props.setLoading(true);
    this.props
      .onDeleteCrisis(obj)
      .then(res => {
        console.log("Delete Crisis Response: ", res);
      })
      .catch(err => {
        console.log("Delete Crisis Error: ", err);
      })
      .finally(() => {
        this.props.setLoading(false);
      });
  };

  getContent = () => {
    const { data } = this.props;
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: ThemeStyle.pageContainer.backgroundColor
        }}
      >
        {data &&
          data.map(item => {
            let obj = item.crisisItem;
            return (
              <CrisisItem
                id={item.id}
                key={item.id}
                title={obj.title}
                tags={obj.tags}
                count={item.checkinCount || 0}
                countHistory={item.checkinValues || []}
                onCountPress={() => this.selectedCrisisItem(item.checkinValues)}
                showDescription={() => this.showDescription(obj)}
                onEdit={() => this.editItem({ ...obj, id: item.id })}
                onDelete={() => this.deleteItem(item.id)}
                onCheckin={() => this.checkin(item.id)}
                setSaveRef={func => (this.updateCheckin[item.id] = func)}
                setLoading={this.props.setLoading}
              />
            );
          })}
      </ScrollView>
    );
  };

  addCrisisItem = () => {
    this.addCrisis.show();
  };

  callTherapist = async () => {
    if (this.props.isSubscribed) {
      let user = await Auth.currentUserInfo();
      let data = user.attributes;
      const therapist_no = parseInt(data["custom:therapist_phone"]);
      console.log("CALLING THERAPIST", therapist_no);
      if (therapist_no) {
        call({ number: therapist_no, prompt: false });
      } else {
        showMessage(
          errorMessage(
            translate("Please add your therapist number from Profile settings.")
          )
        );
      }
    } else {
      this.props.showSubscription();
    }
  };

  render() {
    if (this.state.interactions) {
      return (
        <View
          style={{
            backgroundColor: ThemeStyle.pageContainer.backgroundColor,
            flex: 1
          }}
        >
          <Loader />
        </View>
      );
    }
    const {
      showDescriptionModal,
      descriptionContent,
      countHistory,
      currentItem,
      mode,
      checkinItem,
      countDescription
    } = this.state;
    const { loading, showSubscription, isSubscribed } = this.props;
    console.log("propppp", this.props);
    return (
      <Fragment>
        <Header
          title={translate("Crisis Survival List")}
          goBack={() => this.props.navigation.goBack()}
          rightIcon={() => (
            <Icon name="ios-add" size={35} color={ThemeStyle.mainColor} />
          )}
          onRightIconClick={this.addCrisisItem}
        />
        <View style={styles.sticky}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "space-between",
              backgroundColor: "#fff",
              marginBottom: 5,
              elevation: 2
            }}
          >
            <TouchableOpacity
              style={[
                styles.topButtonContainer,
                { borderRightWidth: 1, borderColor: "lightgrey" }
              ]}
              onPress={() => call({ number: 911, prompt: false })}
            >
              <View
                style={{
                  height: 30,
                  width: 30,
                  backgroundColor: "red",
                  borderRadius: 5,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Icon name="ios-call" size={20} color="#fff" />
              </View>
              <Text style={[styles.buttonText, { color: "red" }]}>911</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.topButtonContainer}
              onPress={this.callTherapist}
            >
              <View
                style={{
                  height: 30,
                  width: 30,
                  backgroundColor: "green",
                  borderRadius: 5,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Icon name="ios-call" size={20} color="#fff" />
              </View>
              <Text style={[styles.buttonText, { color: "green" }]}>
                  {translate("Therapist")}
              </Text>
            </TouchableOpacity>
          </View>

          {/*<TouchableOpacity style={[styles.button, {backgroundColor: '#E91E63'}]} onPress={() => call({number: 911, prompt: false})}>
            <Icon name="ios-call" size={20} color="white"/>
            <Text style={styles.buttonText}>Call 911</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#2196F3'}]} onPress={this.callTherapist}>
            <Icon name="ios-call" size={20} color="white"/>
            <Text style={styles.buttonText}>Call Therapist</Text>
          </TouchableOpacity>*/}
        </View>
        {loading ? (
          <View style={{ flex: 1 }}>
            <Loader />
          </View>
        ) : (
          this.getContent()
        )}
        <AddCrisis
          setHandle={this.setHandle}
          mode={mode}
          currentItem={currentItem}
          close={this.closeCrisisModal}
          premium={isSubscribed}
          openSubscription={showSubscription}
          setLoading={this.props.setLoading}
        />
        <NotesDescription
          ref={notesDesc => (this.notesDesc = notesDesc)}
          description={countDescription}
        />
        <CountHistory
          visible={this.state.countHistoryVisible}
          history={countHistory}
          onClose={this.showCountHistory(false)}
          onShowDescription={this.onShowCountDescription}
        />
        <DescriptionModal
          visible={showDescriptionModal}
          onClose={this.showDescriptionModal(false)}
          content={descriptionContent}
        />
        <AddNotes
          ref={ref => (this.checkinModal = ref)}
          // ref="checkinModal"
          id={checkinItem}
          onSave={this.onCheckinSave}
        />
      </Fragment>
    );
  }
}

export default compose(
  graphql(getCrisisItemsQuery, {
    options: {
      fetchPolicy: "network-only"
    },
    props: props => ({
      data: props.data.getCrisisItems || [],
      loading: props.data.loading,
      getCrisisItems: props.data.refetch
    })
  }),
  graphql(deleteCrisisItemQuery, {
    props: props => ({
      onDeleteCrisis: crisis =>
        props.mutate({
          variables: crisis,
          optimisticResponse: () => ({ deleteCrisisItem: crisis })
        })
    }),
    options: {
      refetchQueries: [{ query: getCrisisItemsQuery }],
      update: (dataProxy, fetchedObj) => {
        const query = getCrisisItemsQuery;
        const data = dataProxy.readQuery({ query });
        let response = fetchedObj.data.deleteCrisisItem.msg;
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
)(withSubscriptionActions(CrisisScreen));
