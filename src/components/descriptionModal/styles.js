import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";

export default {
  topContainer: {
    height: 200,
    // backgroundColor: theme.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  iconTitle: {
    color: ThemeStyle.accentColor,
    fontFamily: TextStyles.GeneralText.fontFamily,
    fontSize: 20,
    letterSpacing: 1
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 20
  },
  icon: {
    tintColor: "white",
    tintColor: ThemeStyle.accentColor,
    width: 40,
    height: 40
  },
  iconWrapper: {
    borderWidth: 1,
    padding: 15,
    borderColor: "white",
    borderColor: ThemeStyle.accentColor,
    borderRadius: 15,
    marginBottom: 15
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20
  },
  description: {
    letterSpacing: 0.5,
    lineHeight: 22,
    fontWeight: "100"
  },
  empty: {
    flex: 1,
    alignItems: "center"
  },
  emptyText: {
    fontFamily: TextStyles.GeneralText.fontFamily,
    fontSize: 22,
    color: "#ccc",
    letterSpacing: 0.8,
    paddingHorizontal: 20
  }
};
