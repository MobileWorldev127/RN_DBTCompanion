import TextStyles from "../../common/TextStyles";
import ThemeStyle from "../../styles/ThemeStyle";

export default {
  container: {
    flex: 1
  },
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
  }
};
