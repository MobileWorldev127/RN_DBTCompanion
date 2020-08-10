import TextStyles from "../../common/TextStyles";
import ThemeStyle from "../../styles/ThemeStyle";

export default {
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc"
  },
  input: {
    height: 40,
    backgroundColor: "white",
    flex: 1,
    fontFamily: TextStyles.SubHeaderBold.fontFamily
  },
  rightIcon: {
    paddingHorizontal: 10
  },
  container: {
    backgroundColor: "white"
  },
  icon: {
    width: 23,
    height: 23,
    marginHorizontal: 10,
    tintColor: "#aaa"
  },
  iconButton: {
    marginHorizontal: -10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 2
  },
  iconList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10
  },
  selected: {
    tintColor: ThemeStyle.accentColor
  }
};
