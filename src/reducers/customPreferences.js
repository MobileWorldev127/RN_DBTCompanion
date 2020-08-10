import { ACTION_TYPES } from "../actions/customPreferencesAction";

const initialState = {
  customPreferences: [],
  allCustomPreferences: {
    skills: [],
    targets: [],
    activities: [],
    hide: []
  }
};

export default (reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.GET_ALL_CUSTOM_PREFERENCES_SUCCESS:
      const {
        skills = {},
        targets = {},
        activities = [],
        hide = {}
      } = action.payload;
      console.log("action.payload", action.payload);
      return {
        ...state,
        allCustomPreferences: {
          skills: skills,
          targets: targets,
          activities: activities,
          hide: hide
        }
      };
    default:
      return state;
  }
});
