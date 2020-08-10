import AddEntryScreen from "./AddEntryScreen";
import { connect } from "react-redux";
import { setModeAndData, clearState } from "../../actions/RecordActions";
import { setUserNotified, setNotifyDate } from "./../../actions/QuizActions";
import { withStore, withSafeAreaActions } from "../../utils/StoreUtils";
import { getMonthRange } from "../../utils/DateTimeUtils";
import { getTimeLineViewQuery } from "../../queries/getTimeLineView";
import { addEntryQuery } from "../../queries/addEntryWithEntryDate";
import { patchEntryQuery } from "../../queries";
import { compose, graphql } from "react-apollo";
import { getAllCustomPreferencesRequest } from "../../actions/customPreferencesAction";
import { v4 as uuid } from "uuid";
import moment from "moment";
import _ from "lodash";
import bugsnagClient from "../../utils/Bugsnag";
import { isOnline } from "../../utils/NetworkUtils";

const options = {
  fetchPolicy: "network-only"
};

const mapStateToProps = state => {
  //userPreference: state.customPreferences.allCustomPreferences,
  return {
    userPreference: state.customPreferences.allCustomPreferences,
    lastQuizDate: state.quiz.reminderData.lastQuizDate,
    userNotified: state.quiz.reminderData.userNotified,
    lastNotificationDate: state.quiz.reminderData.lastNotificationDate,
    mode: state.record.mode,
    entry: state.record.entry
  };
};

const mapDispatchToProps = dispatch => ({
  getAllCustomPreferencesRequest: () => {
    dispatch(getAllCustomPreferencesRequest());
  },
  setUserNotified: value => {
    dispatch(setUserNotified(value));
  },
  setNotifyDate: value => {
    dispatch(setNotifyDate(value));
  },
  setModeAndData: (mode, data) => {
    dispatch(setModeAndData(mode, data));
  },
  clearState: () => dispatch(clearState())
});

export default compose(
  graphql(addEntryQuery, {
    props: props => ({
      addEntry: entry =>
        props.mutate({
          variables: entry,
          optimisticResponse: () => ({
            addEntry: {
              msg: "offline",
              EntryDate: entry.EntryDate,
              entry: {
                ...entry.entry,
                id: entry.entry.timestamp,
                __typename: "Entry"
              }
            }
          }),
          update: (cache, res) => {
            console.log("RESPONSE", res);
            console.log("CACHE", cache);
            const input = _.cloneDeep(res.data.addEntry);
            bugsnagClient.leaveBreadcrumb(
              `updating cache input: ${!!input}; ${input.msg}; ${
                input.EntryDate
              }; online: ${isOnline()}`
            );
            if (!input.EntryDate || input.msg !== "offline") {
              return;
            }
            let data = null;
            try {
              data = cache.readQuery({
                query: getTimeLineViewQuery,
                variables: getMonthRange(moment(input.EntryDate, "YYYY-MM-DD"))
              });
            } catch (err) {
              bugsnagClient.leaveBreadcrumb(
                "Error reading from timelineView cache"
              );
              bugsnagClient.notify("Error reading timelineView cache");
              data = {
                getTimeLineView: null
              };
            }
            input.entry.skills = input.entry.skills.map(item => ({
              skill: {
                ...item.skill,
                __typename: "Skill"
              },
              __typename: "SkillEntry",
              value: true,
              intValue: item.intValue
            }));
            input.entry.targets = input.entry.targets.map(item => ({
              target: {
                ...item.target,
                __typename: "Target"
              },
              __typename: "TargetEntry",
              value: true
            }));
            input.entry.activities = input.entry.activities.map(item => ({
              ...item,
              __typename: "Activity"
            }));
            if (input.entry.journal) {
              input.entry.journal.__typename = "Journal";
              input.entry.journal.assets = input.entry.journal.assets.map(
                item => ({
                  ...item,
                  __typename: "JournalAsset"
                })
              );
            } else {
              input.entry.journal = {
                assets: [
                  {
                    images: [],
                    videos: [],
                    audios: [],
                    __typename: "JournalAsset"
                  }
                ],
                text: "",
                __typename: "Journal"
              };
            }
            console.log("CACHE TIMELINE", data);
            const timeLineObject = {
              date: input.EntryDate,
              entries: [input.entry],
              exercises: [],
              meditations: [],
              practiceIdeas: [],
              __typename: "TimeLine"
            };
            if (data && data.getTimeLineView && data.getTimeLineView.length) {
              let dateExists = false;
              data.getTimeLineView.forEach(element => {
                if (element.date === input.EntryDate) {
                  if (element.entries && element.entries.length) {
                    element.entries.unshift(input.entry);
                  } else {
                    element.entries = [input.entry];
                  }
                  dateExists = true;
                }
              });
              if (!dateExists) {
                data.getTimeLineView.unshift(timeLineObject);
              }
            } else {
              data.getTimeLineView = [timeLineObject];
            }
            console.log("WRITING QUERY", data);
            bugsnagClient.leaveBreadcrumb("writing to cache");
            try {
              cache.writeQuery({
                query: getTimeLineViewQuery,
                variables: getMonthRange(moment(input.EntryDate, "YYYY-MM-DD")),
                data
              });
            } catch (err) {
              bugsnagClient.leaveBreadcrumb(
                "Error writing to timelineView cache"
              );
              bugsnagClient.notify(
                new Error('Error writing to timelineView cache')
              );
            }
          }
        })
    })
  }),
  graphql(patchEntryQuery, {
    props: props => ({
      patchEntry: entry =>
        props.mutate({
          variables: entry
          // optimisticResponse: () => ({ patchEntry: entry}), // If data doesn't show up in entries screen comment this one
        })
    })
  })
)(withSafeAreaActions(AddEntryScreen, mapStateToProps, mapDispatchToProps));

// options: {
//   refetchQueries: props => {
//     const variables = getMonthRange();
//     return [{query: getTimeLineViewQuery, variables}]
//   },
//   update: (dataProxy, fetchedObj ) => {
//     const query = getEntriesQuery;
//     let response = fetchedObj.data.addEntry;
//     if(moment(new Date(response.EntryDate)).get('month') !== moment(new Date()).get('month')) {
//       return;
//     }
//     if(response.msg === '') {
//       const variables = getMonthRange(new Date(response.EntryDate));
//       let data = dataProxy.readQuery({ query, variables });
//       data.getEntriesFromTo = data.getEntriesFromTo || [];
//       return ;
//       let index = data.getEntriesFromTo.map(entry => entry.EntryDate).indexOf(response.EntryDate);
//       response.entry.__typename = "Entry";
//       response.entry.skills = response.entry.skills.map(item => ({
//         skill: {
//           ...item.skill,
//           __typename: "Skill"
//         },
//         __typename: "SkillEntry",
//         value: true
//       }));
//       response.entry.targets = response.entry.targets.map(item => ({
//         target: {
//           ...item.target,
//           __typename: "Target"
//         },
//         __typename: "TargetEntry",
//         value: true
//       }));
//       response.entry.activities = response.entry.activities.map(item => ({
//         ...item,
//         __typename: "Activity"
//       }));
//       if(index > - 1) {
//         data.getEntriesFromTo[index].entries.push(response.entry);
//       } else {
//         data.getEntriesFromTo.push({
//           EntryDate: response.EntryDate,
//           entries: [response.entry],
//           __typename: "DayRecord"
//         })
//       }
//       dataProxy.writeQuery({ query, data });
//     }
//   }
// }

// options: {
//   refetchQueries: props => {
//     const variables = getMonthRange(new Date());
//     return [{query: getEntriesQuery, variables}]
//   },
//   update: (dataProxy, fetchedObj ) => {
//     const query = getEntriesQuery;
//     let response = fetchedObj.data.patchEntry;
//     if(moment(new Date(response.EntryDate)).get('month') !== moment(new Date()).get('month')) {
//       return;
//     }
//     // if(response.msg === '') {
//     //   const variables = getMonthRange(new Date(response.EntryDate));
//     //   let data = dataProxy.readQuery({ query, variables });
//     //   data.getEntriesFromTo = data.getEntriesFromTo || [];
//     //   return ;
//     //   let index = data.getEntriesFromTo.map(entry => entry.EntryDate).indexOf(response.EntryDate);
//     //   response.entry.__typename = "Entry";
//     //   response.entry.skills = response.entry.skills.map(item => ({
//     //     skill: {
//     //       ...item.skill,
//     //       __typename: "Skill"
//     //     },
//     //     __typename: "SkillEntry",
//     //     value: true
//     //   }));
//     //   response.entry.targets = response.entry.targets.map(item => ({
//     //     target: {
//     //       ...item.target,
//     //       __typename: "Target"
//     //     },
//     //     __typename: "TargetEntry",
//     //     value: true
//     //   }));
//     //   response.entry.activities = response.entry.activities.map(item => ({
//     //     ...item,
//     //     __typename: "Activity"
//     //   }));
//     //   if(index > - 1) {
//     //     data.getEntriesFromTo[index].entries.push(response.entry);
//     //   } else {
//     //     data.getEntriesFromTo.push({
//     //       EntryDate: response.EntryDate,
//     //       entries: [response.entry],
//     //       __typename: "DayRecord"
//     //     })
//     //   }
//     //   dataProxy.writeQuery({ query, data });
//     // }
//   }
// }
