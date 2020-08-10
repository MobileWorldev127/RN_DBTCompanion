import gql from "graphql-tag";

export const getExerciseHistoryList = gql`
  query getExerciseHistory($exerciseId: String!) {
    getExerciseHistory(exerciseId: $exerciseId) {
      id
      dateTime
      exerciseId
      title
      entryDate
    }
  }
`;
