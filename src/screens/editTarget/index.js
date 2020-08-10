import EditTargetScreen from "./EditTargetScreen";
import { getAllCustomPreferencesRequest } from "../../actions/customPreferencesAction";
import { hideTargetQuery, unhideTargetQuery } from "../../queries";
import { compose, graphql } from "react-apollo";
import { withSubscriptionActions } from "../../utils/StoreUtils";

const mapStateToProps = state => {
  return {
    userTargets: state.customPreferences.allCustomPreferences.targets
  };
};

const mapDispatchToProps = dispatch => ({
  getAllCustomPreferencesRequest: () => {
    dispatch(getAllCustomPreferencesRequest());
  }
});

export default compose(
  graphql(hideTargetQuery, {
    props: props => ({
      hideTarget: item =>
        props.mutate({
          variables: { id: item },
          optimisticResponse: () => ({
            hideTarget: { id: item, msg: "", __typename: "Target" }
          })
        })
    })
  }),
  graphql(unhideTargetQuery, {
    props: props => ({
      showTarget: item =>
        props.mutate({
          variables: { id: item },
          optimisticResponse: () => ({
            unhideTarget: { id: item, msg: "", __typename: "Target" }
          })
        })
    })
  })
)(
  withSubscriptionActions(EditTargetScreen, mapStateToProps, mapDispatchToProps)
);
