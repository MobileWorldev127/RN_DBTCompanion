import SkillScreen from "./SkillScreen";
import { connect } from "react-redux";

const mapStateToProps = state => {
  console.log("allCustomPreferences", state.customPreferences);
  return {
    userSkills: state.customPreferences.allCustomPreferences.skills
  };
};
//skills:state.defaultItems.defaultItems.skills,
const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SkillScreen);
