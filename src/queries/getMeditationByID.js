import gql from "graphql-tag";

export const getMeditationById = gql`
  query getMeditation($id: String!) {
    getMeditation(id: $id) {
      theme
      filename
      id
      author
      attribution
      imagePath
      title
      sequence
      type
    }
  }
`;