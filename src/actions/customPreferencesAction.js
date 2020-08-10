import { groupByModules, showApiError } from "../utils";
import { setLoading } from "./AppActions";
import { client } from "../App";
import { defaultVariables, userPreferenceQuery } from "../queries";

export const ACTION_TYPES = {
  GET_ALL_CUSTOM_PREFERENCES: "GET_ALL_CUSTOM_PREFERENCES",
  GET_ALL_CUSTOM_PREFERENCES_SUCCESS: "GET_ALL_CUSTOM_PREFERENCES_SUCCESS",
  GET_ALL_CUSTOM_PREFERENCES_FAILURE: "GET_ALL_CUSTOM_PREFERENCES_FAILURE"
};

export const getAllCustomPreferencesRequest = () => dispatch => {
  dispatch({
    type: ACTION_TYPES.GET_ALL_CUSTOM_PREFERENCES,
    payload: null
  });
  dispatch(setLoading(true));
  client
    .watchQuery({
      query: userPreferenceQuery,
      variables: defaultVariables,
      fetchPolicy: "cache-and-network"
    })
    .subscribe({
      next: response => {
        let userPreference = {
          skills: [],
          targets: [],
          activities: [],
          hide: false
        };
        console.log("CUSTOM PREFERENCES", response.data);
        if (response.data && response.data.getPreferences) {
          let getPreferences = response.data.getPreferences;
          userPreference = {
            skills: groupByModules(getPreferences.custom.skills),
            targets: groupByModules(getPreferences.custom.targets),
            activities: getPreferences.custom.activities,
            hide: getPreferences.hide
          };
          dispatch(getAllCustomPreferencesSuccess(userPreference));
          dispatch(setLoading(false));
        }
      },
      error: err => {
        console.log(err);
        showApiError(
          true,
          "Failed to fetch custom preferences. Please get online to sync your preferences."
        );
        dispatch(setLoading(false));
      }
    });
};

export function getAllCustomPreferencesSuccess(response) {
  return {
    type: ACTION_TYPES.GET_ALL_CUSTOM_PREFERENCES_SUCCESS,
    payload: response
  };
}

export function getAllCustomPreferencesFailure() {
  return {
    type: ACTION_TYPES.GET_ALL_CUSTOM_PREFERENCES_FAILURE,
    payload: null
  };
}
