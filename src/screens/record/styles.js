import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";

export default {
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    margin: 0
  },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "center",
    // padding: 15,
    flexWrap: "wrap"
  },
  moodCircleContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
    // padding: 15,
  },
  emotion: {
    marginHorizontal: 6,
    width: 50,
    height: 50
  },
  moodText: {
    alignSelf: "center",
    marginVertical: 5,
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 15
  },
  moodButton: {
    marginBottom: 18
  },
  mainHeader: {
    textAlign: "center",
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 30,
    letterSpacing: 1,
    color: TextStyles.SubHeaderBold.color,
    marginBottom: 15
  },
  picker: {
    marginTop: 10,
    marginBottom: 50,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center"
  },
  pickerText: {
    color: ThemeStyle.mainColor,
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 15,
    marginHorizontal: 10,
    marginTop: 0
  },
  pickerIcon: {
    marginLeft: 10
  },
  downArrow: {
    marginLeft: -5,
    marginRight: 15,
    marginTop: -5
  },
  textBtn: {
    color: ThemeStyle.accentColor,
    fontFamily: TextStyles.SubHeaderBold.fontFamily
  }
};
