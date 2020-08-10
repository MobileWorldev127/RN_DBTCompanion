import gql from "graphql-tag";

export const getTimeLineViewQuery = gql`
  query getTimeLineView($startDate: String!, $endDate: String!) {
    getTimeLineView(startDate: $startDate, endDate: $endDate) {
      date
      entries {
        id
        mood
        timestamp
        activities {
          id
          title
          icon
        }
        skills {
          skill {
            id
            title
            icon
            module
          }
          value
          intValue
        }
        targets {
          target {
            id
            title
            icon
            module
          }
          value
        }
        medication
        bedTime
        wakeTime
        sleepTime
        journal {
          text
          assets {
            images
            videos
            audios
          }
        }
      }
      exercises {
        id
        title
        color
        exerciseId
      }
      practiceIdeas {
        id
        title
      }
      meditations {
        id
        totalMinutes
        title
      }
    }
  }
`;

export const getSummaryTimeLineViewQuery = gql`
  query getSummary($startDate: String!, $endDate: String!) {
    getSummary(startDate: $startDate, endDate: $endDate) {
      date
      nutrition {
        calories {
          value
          unit
        }
        carbs {
          value
          unit
        }
        protein {
          value
          unit
        }
        fat {
          value
          unit
        }
      }
      healthExercise {
        calories {
          value
          unit
        }
        duration {
          value
          unit
        }
        distance {
          value
          unit
        }
        steps {
          value
          unit
        }
      }
      sleep {
        totalMinutes
        sleep {
          bedTime
          wakeTime
          duration
        }
      }
      heartRate {
        state
        value
        valueAtRest
        variabilty
      }
      mindfulnessMinutes {
        totalMinutes
      }
    }
  }
`;
