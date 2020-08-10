import gql from "graphql-tag";

export const setPreferenceQuery = gql`
  mutation setPreference($type: String!, $data: String!) {
    setPreference(type: $type, data: $data) {
      msg
    }
  }
`;
