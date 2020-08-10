import gql from "graphql-tag";

export const getMoodCorelationsQuery = gql`
  query getMoodCorrelations($startDate: String!, $endDate: String!) {
    getMoodCorrelations(startDate: $startDate, endDate: $endDate) {
      mood
      sleep
      medication {
        yes
        no
      }
      skills {
        skill {
          title
          id
          icon
        }
        count
      }
      activities {
        activity {
          id
          icon
          title
        }
        count
      }
      targets {
        target {
          title
          id
          icon
        }
        count
      }
    }
  }
`;
// exercises {
//   id
//   module
//   title
//   sequence
//   description
//   color
// }
