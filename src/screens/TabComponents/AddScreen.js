import React, { Component } from 'react';
import {
  View,
  TouchableHighlight,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Header from '../../components/Header';
import ThemeStyle from '../../styles/ThemeStyle';
import { withSubscriptionActions } from '../../utils/StoreUtils';
import TextStyles from '../../common/TextStyles';
import CachedImage from 'react-native-image-cache-wrapper';
import { client } from '../../App';
import { screenNames, recordScreenEvent } from '../../utils/AnalyticsUtils';
import { getExercisesByModuleQuery } from '../../queries/getExercisesByModule';

import { getExerciseByIDQuery } from '../../queries/getExercise';
import { flowConstants } from '../../constants';
import { setCurrentExercise } from '../../actions/RecordActions';
import { showApiError } from '../../utils';
import { performNetworkTask } from '../../utils/NetworkUtils';
import LinearGradient from 'react-native-linear-gradient';
import Card from '../../components/Card';
import { setTopSafeAreaView } from '../../actions/AppActions';
import _ from 'lodash';
import Amplify from 'aws-amplify';
import { API } from 'aws-amplify';
import { getAmplifyConfig, getEnvVars } from './../../constants';
import { getHealthKitSourceSettings } from '../../queries/getHealthKitSourceSettings';
import Icon from "../../common/icons";

class AddScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        {
          title: 'Record Entry',
          onPress: () =>
            this.props.navigation.navigate('AddEntry', {
              isBack: true,
              toggleTabBar: props.toggleTabBar,
              onChangeSelectedTab: props.onChangeSelectedTab
            }),
          color: '#000',
          isIcon: true,
          image: require('../../assets/images/redesign/cbt-recordentry-graphic.png'),
          isShow: true,
          isPremium: true,
        },
        {
          title: "Breathing Excercise",
          onPress: () =>
            this.props.navigation.navigate("ExcerciseBreathingScreen", {
              isBack: true,
            }),
          color: '#000',
          iconName: "chart-arc",
          iconFamily: "MaterialCommunityIcons",
          isIcon: true,
          image: require("../../assets/images/breathing_exercise_ico.png"),
          isShow: true,
          isPremium: true,
        },
      ],
    };
  }

  componentDidMount() {
    this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
    const { sourceSettingsList } = this.props;
    recordScreenEvent(screenNames.add);
    this.fetchSourceSettings();
  }

  fetchSourceSettings() {
    this.props.setLoading(true);
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    API.graphql({
      query: getHealthKitSourceSettings,
    })
      .then(data => {
        this.props.setLoading(false);
        const items = this.state.items;
        let nutrition_value = "";
        let sleep_value = "";
        let activity_value = "";
        data.data.getHealthKitSourceSettings.map(item => {
          if (item.sourceType == 'Exercise') {
            activity_value = item.source;
          }
          if (item.sourceType == 'Sleep') {
            sleep_value = item.source;
          }
          if (item.sourceType == 'Nutrition') {
            nutrition_value = item.source;
          }
        });
        items.push(
          {
            title: 'Log Food Entry',
            onPress: () =>
              this.premiumNavigation("LogFood", {
                isAffirmation: false,
                isBack: true
              }),
            color: "#000",
            isIcon: true,
            image: require('../../assets/images/redesign/cbt-logfood-graphic.png'),
            isShow: nutrition_value == "MANUAL" ? true : false,
            isPremium: this.props.isSubscribed
          },
          {
            title: 'Log Exercise',
            onPress: () =>
              this.premiumNavigation("LogExercise", {
                isAffirmation: false,
                isBack: true
              }),
            color: "#000",
            isIcon: true,
            image: require('../../assets/images/redesign/workout.png'),
            isShow: activity_value == "MANUAL" ? true : false,
            isPremium: this.props.isSubscribed
          },
          {
            title: 'Log Sleep',
            onPress: () =>
              this.props.navigation.navigate('SleepAdd', {
                isBack: true,
              }),
            color: "#000",
            isIcon: true,
            image: require('../../assets/images/redesign/Sleep_Duration-graphic.png'),
            isShow: sleep_value == "MANUAL" ? true : false,
            isPremium: true,
          }
        );
        this.setState({ items });
      })
      .catch(err => {
        this.props.setLoading(false);
        console.log(err);
      });
  }

  navigateToExercise(exercise) {
    if (exercise.locked !== false && !this.props.isSubscribed) {
      this.props.showSubscription();
    } else {
      this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
      this.props.setLoading(true);
      const query = client
        .watchQuery({
          query: getExerciseByIDQuery,
          variables: { id: exercise.id },
          fetchPolicy: 'cache-and-network',
        })
        .subscribe({
          next: data => {
            if (data.loading || !data.data) {
              return;
            }
            this.props.setLoading(false);
            this.props.setCurrentExercise(
              _.cloneDeep(data.data.getExercise),
              flowConstants.EXERCISE
            );
            console.log('EXERCISE DATA', data.data.getExercise);
            this.props.navigation.navigate('ExerciseScreen', {
              currentIndex: 0,
              exerciseId: exercise.id,
            });
            query.unsubscribe();
          },
          error: error => {
            this.props.setLoading(false);
            console.log(error);
            showApiError(true);
          },
        });
    }
  }

  premiumNavigation = (path, params) => {
    if (this.props.isSubscribed) {
      this.props.navigation.push(path, params);
    } else {
      this.props.showSubscription();
    }
  };

  render() {
    return (
      <View style={ThemeStyle.pageContainer}>
        <LinearGradient style={{ flex: 1 }} colors={ThemeStyle.gradientColor}>
          <Header
            isDrawer={true}
            openDrawer={() => {
              this.props.navigation.openDrawer();
            }}
            navBarStyle={{ backgroundColor: 'transparent' }}
            title={''}
          />
          <ScrollView style={{ flex: 1 }}>
            {this.state.items.map((item, index) => {
              if (item.isShow) {
                return (
                  <Animatable.View
                    animation="pulse"
                    delay={index * 200}
                    style={{
                      flex: 1,
                      maxHeight: 130,
                      overflow: 'hidden',
                    }}
                  >
                    <Card style={{ marginHorizontal: 20, marginVertical: 12 }}>
                      <CachedImage
                        source={item.image}
                        style={{
                          width: 90,
                          height: 80,
                          position: 'absolute',
                          top: 24,
                          right: 16,
                        }}
                        resizeMode="contain"
                      />
                      {!item.isPremium ? (
                        <Image
                          source={require("../../src/ios_lock.png")}
                          style={{
                            width: 24,
                            height: 24,
                            tintColor: '#ffc107',
                            backgroundColor: 'transparent',
                            position: 'absolute', 
                            bottom: 10,
                            right: 10
                          }}
                          resizeMode="contain"
                        />
                      ) : null}
                      <TouchableOpacity onPress={item.onPress}>
                        <View
                          style={{
                            height: '100%',
                            flexDirection: 'row',
                            padding: 16,
                            alignItems: 'center',
                            overflow: 'hidden',
                          }}
                        >
                          <Text
                            style={[
                              TextStyles.SubHeader2,
                              {
                                width: '50%',
                                color: item.color,
                                marginHorizontal: 12,
                              },
                            ]}
                          >
                            {item.title}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </Card>
                  </Animatable.View>
                );
              }
            })}
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  completedExercise: state.record.completedExercise,
  sourceSettingsList: state.sourceSettings.sourceSettingsList
});

const mapDispatchToProps = dispatch => ({
  setCurrentExercise: (exercise, flowType) =>
    dispatch(setCurrentExercise(exercise, flowType)),
  setTopSafeAreaView: color => dispatch(setTopSafeAreaView(color)),
});

export default withSubscriptionActions(
  AddScreen,
  mapStateToProps,
  mapDispatchToProps
);
