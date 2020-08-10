import TextStyles from "../../common/TextStyles";
import ThemeStyle from "../../styles/ThemeStyle";

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
    color: TextStyles.SubHeaderBold.color,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5
  },
  headerText: {
    color: ThemeStyle.accentColor2,
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: TextStyles.SubHeader2.fontSize
  }
};

export const listStyle = {
  list: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: ThemeStyle.accentColor2
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  track: {
    height: 10,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    shadowOpacity: 0.15
  },
  thumb: {
    width: 16,
    height: 6,
    backgroundColor: ThemeStyle.accentColor2, //'#f8a1d6',
    borderColor: "#fff", //'#a4126e',
    borderWidth: 8,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.35,
    elevation: 4
  }
};
