import EditSkillScreen from "./EditSkillScreen";
import { getAllCustomPreferencesRequest } from "../../actions/customPreferencesAction";
import { hideSkillQuery, unhideSkillQuery } from "../../queries";
import { compose, graphql } from "react-apollo";
import { withSubscriptionActions } from "./../../utils/StoreUtils";

const mapStateToProps = state => {
  return {
    userSkills: state.customPreferences.allCustomPreferences.skills
  };
};

const mapDispatchToProps = dispatch => ({
  getAllCustomPreferencesRequest: () => {
    dispatch(getAllCustomPreferencesRequest());
  }
});

export default compose(
  graphql(hideSkillQuery, {
    props: props => ({
      hideSkill: item =>
        props.mutate({
          variables: { id: item },
          optimisticResponse: () => ({
            hideSkill: { id: item, msg: "", __typename: "Skill" }
          })
        })
    })
  }),
  graphql(unhideSkillQuery, {
    props: props => ({
      showSkill: item =>
        props.mutate({
          variables: { id: item },
          optimisticResponse: () => ({
            unhideSkill: { id: item, msg: "", __typename: "Skill" }
          })
        })
    })
  })
)(
  withSubscriptionActions(EditSkillScreen, mapStateToProps, mapDispatchToProps)
);
