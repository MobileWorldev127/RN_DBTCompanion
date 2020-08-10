import gql from "graphql-tag";

export const getUserExerciseQuery = gql`
  query getUserExercise($id: String!) {
    getUserExercise(id: $id) {
      id
      exerciseId
      title
      module
      sequence
      color
      description
      image
      details {
        question
        type
        placeholder
        image
        icon
        source
        title
        scale {
          min
          max
          start
          step
        }
        value {
          intValues
          stringValues
          keyValues {
            key {
              name
              color
            }
            value
          }
        }
        details {
          question
          type
          placeholder
          image
          icon
          source
          title
          scale {
            min
            max
            step
            start
          }
          value {
            intValues
            stringValues
            keyValues {
              key {
                name
                color
              }
              value
            }
          }
          details {
            question
            type
            placeholder
            image
            icon
            source
            title
            scale {
              min
              max
              start
              step
            }
            value {
              intValues
              stringValues
              keyValues {
                key {
                  name
                  color
                }
                value
              }
            }
          }
        }
      }
    }
  }
`;
