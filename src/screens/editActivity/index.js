import EditActivityScreen from "./EditActivityScreen";
import { getAllCustomPreferencesRequest } from "../../actions/customPreferencesAction";
import { hideActivityQuery, unhideActivityQuery } from "../../queries";
import { compose, graphql } from "react-apollo";
import { withSubscriptionActions } from "../../utils/StoreUtils";

const mapStateToProps = state => {
  return {
    userActivities: state.customPreferences.allCustomPreferences.activities
  };
};

const mapDispatchToProps = dispatch => ({
  getAllCustomPreferencesRequest: () => {
    dispatch(getAllCustomPreferencesRequest());
  }
});

export default compose(
  graphql(hideActivityQuery, {
    props: props => ({
      hideActivity: item =>
        props.mutate({
          variables: { id: item },
          optimisticResponse: () => ({
            hideActivity: { id: item, msg: "", __typename: "Activity" }
          })
        })
    })
  }),
  graphql(unhideActivityQuery, {
    props: props => ({
      showActivity: item =>
        props.mutate({
          variables: { id: item },
          optimisticResponse: () => ({
            unhideActivity: { id: item, msg: "", __typename: "Activity" }
          })
        })
    })
  })
)(
  withSubscriptionActions(
    EditActivityScreen,
    mapStateToProps,
    mapDispatchToProps
  )
);
