import gql from "graphql-tag";
import { preferenceTypes } from "../constants";

export const userPreferenceQuery = gql`
  query getPreferences($type: String!) {
    getPreferences(type: $type) {
      type
      data
      hide {
        skills
        targets
        activities
      }
      custom {
        skills {
          id
          title
          description
          icon
          module
        }
        targets {
          id
          title
          description
          icon
          module
        }
        activities {
          id
          title
          description
          icon
        }
      }
    }
  }
`;

export const defaultVariables = {
  type: preferenceTypes.TYPE_ENTRY
};
