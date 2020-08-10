import React from "react";
import { Image } from "react-native";
import styles from "./styles";
import ThemeStyle from "../../styles/ThemeStyle";

export default [
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour/welcome.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Welcome",
    subtitle:
      "Welcome to DBT Coach. Please click Next to navigate through the tour, or click Skip to close."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour/mood.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Record Mood",
    subtitle: "Record how you feel daily or multiple times a day."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour/skills.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Record skills",
    subtitle: "Record what skills you practiced or thought about."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour/targets.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Record targets",
    subtitle: "Record what thoughts, feelings and behaviors you had on this day."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour/activities.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Record activities",
    subtitle: "Record what activities you took part on this day."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour/journal.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Record Journal",
    subtitle: "Record details about your skill practice and what happened on this day."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour/exercisesByModule.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Exercises",
    subtitle: "Over 100 exercises from each of the 4 DBT Modules that helps you practice DBT skills. Also, view history on how you did the exercise the past"
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour/exercise.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Intuitive exercise design",
    subtitle: "Well designed exercises with images and illustrations to make it fun."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour/entries.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Entries Timeline",
    subtitle: "Intuitive timeline screen of your entries where you can see all your recorded data in one place."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour/lessons.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Comprehensive lessons",
    subtitle: "Over 100 DBT lessons with videos and animations for you to learn DBT and remember skills better."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour/crisis.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Manage crisis survival list",
    subtitle: "Keep a list of skills and items that help you cope with your crisis better. Tag them for better organization."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour/summary.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Summary",
    subtitle: "An intuitive way to track your progress with cool analytics."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour/assessments.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Assessments",
    subtitle: "Take assessments assigned by your clinician that helps your clinician to track progress by measuring outcome of your treatment."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour/quiz.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Quiz",
    subtitle: "Build your knowledge about DBT my taking interactive quiz"
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour/homework.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Homework",
    subtitle: "Submit homework assigned by your clinician through the app. No need for paper based worksheets or carrying them around and losing them."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour/community.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Community",
    subtitle: "Engage with DBT community and support each other using our Discussion Forums and Peer Support Groups."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour/sharing-settings.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Sharing settings",
    subtitle: "If your clinician is on our clinician app you can share your diary entries and other data. You choose what and whom you want to share with."
  }
];

