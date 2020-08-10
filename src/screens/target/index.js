import TargetScreen from "./TargetScreen";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
    userTargets: state.customPreferences.allCustomPreferences.targets
  };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TargetScreen);
