import ActivityScreen from "./ActivityScreen";
import { connect } from "react-redux";

const mapStateToProps = state => {
  console.log("allCustomPreferences", state.customPreferences);
  return {
    userActivities: state.customPreferences.allCustomPreferences.activities
  };
};
const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityScreen);
