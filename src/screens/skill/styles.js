import TextStyles from "./../../common/TextStyles";
import ThemeStyles from "./../../styles/ThemeStyle";

export default {
  container: {
    flex: 1,
    marginBottom: 20,
    position: "relative"
  },
  mainHeader: {
    textAlign: "center",
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 25,
    letterSpacing: 1,
    color: ThemeStyles.accentColor,
    paddingHorizontal: 40,
    marginVertical: 25
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  footer: {
    position: "relative",
    marginVertical: 30,
    alignSelf: "center"
  }
};

export const sectionStyle = {
  container: {
    padding: 0,
    paddingBottom: 16,
    borderRadius: 6,
    oveflow: "hidden"
  },
  header: {
    backgroundColor: ThemeStyles.mainColor,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5
  },
  headerText: {
    color: "white",
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    letterSpacing: 0.5,
    fontSize: 17
  },
  content: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap"
  }
};
