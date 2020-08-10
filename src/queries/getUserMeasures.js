import gql from "graphql-tag";

export const getUserMeasuresQuery = gql`
  query getUserMeasures {
    getUserMeasures {
      date
      dateTime
      type
      id
      userId
      defaultItemId
      details {
        type
        title
        details {
          title
          type
        }
      }
    }
  }
`;
