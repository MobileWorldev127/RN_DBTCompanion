import TextStyles from "../../common/TextStyles";
import ThemeStyle from "../../styles/ThemeStyle";

export const countHistory = {
  wrapper: {
    flex: 1,
    justifyContent: "flex-end",
    position: "relative"
  },
  container: {
    backgroundColor: "white",
    height: 300,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 1
  },
  headerText: {
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 15
  },
  header: {
    borderBottomWidth: 0.4,
    padding: 15,
    borderColor: "#ccc"
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
  }
};

export const customCrisis = {
  container: {
    padding: 15
  },
  input: {
    borderWidth: 0.5,
    height: 40,
    borderColor: "#ccc",
    marginTop: 10,
    paddingHorizontal: 10,
    color: "#333",
    marginBottom: 20
  },
  label: {
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 15
  },
  desc: {
    height: 130,
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  buttonStyle: {
    backgroundColor: ThemeStyle.mainColor,
    borderRadius: 5
  },
  saveButtonStyle: {
    backgroundColor: "#329F5B",
    borderRadius: 5
  },
  tagInfo: {
    fontSize: 10,
    fontFamily: TextStyles.GeneralText.fontFamily,
    color: "#777"
  },
  icon: {
    tintColor: ThemeStyle.accentColor,
    width: 30,
    height: 30
  },
  iconSelect: {
    alignSelf: "center",
    height: 55,
    width: 55,
    borderRadius: 5,
    marginBottom: 15
  },
  iconWrapper: {
    borderWidth: 1,
    padding: 15,
    borderColor: "white",
    borderColor: ThemeStyle.accentColor,
    borderRadius: 15,
    marginBottom: 15,
    alignSelf: "center"
  }
};

export const addCrisis = {
  header: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    position: "relative"
  },
  headerText: {
    fontFamily: TextStyles.GeneralText.fontFamily,
    fontSize: 20,
    textAlign: "center"
  },
  close: {
    position: "absolute",
    top: 15,
    right: 20
  },
  selector: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  selectorText: {
    fontFamily: TextStyles.GeneralText.fontFamily,
    fontSize: 16
  },
  buttonStyle: {
    backgroundColor: ThemeStyle.accentColor,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginTop: 20
  }
};

export const crisisItem = {
  list: {
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4
  },
  likeCount: {
    marginLeft: 15,
    marginRight: 15,
    fontFamily: TextStyles.GeneralText.fontFamily,
    fontSize: 14,
    opacity: 0.9
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10
  },
  itemTitleText: {
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 16,
    opacity: 0.9,
    marginRight: 10
  },
  tagContainer: {
    marginTop: 5,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap"
  },
  tag: {
    backgroundColor: ThemeStyle.mainColor,
    marginTop: 5,
    marginRight: 5
  },
  tagText: {
    color: "white",
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 14
  }
};

export default {
  list: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 0.4,
    borderColor: "#ccc"
  },
  label: {
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 15,
    color: "#52575B",
    paddingVertical: 4
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: ThemeStyle.accentColor
  },
  button: {
    backgroundColor: ThemeStyle.accentColor,
    flexDirection: "row",
    paddingVertical: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginHorizontal: 5
  },
  sticky: {
    flexDirection: "row",
    // paddingHorizontal: 10,
    // paddingVertical: 30,
    backgroundColor: ThemeStyle.mainColor
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 15,
    position: "relative",
    top: -1
  },
  topButtonContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20
  }
};
