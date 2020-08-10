import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";

export default {
  container: {
    padding: 0,
    borderTopRightRadius: 3,
    borderTopLeftRadius: 3
  },
  header: {
    backgroundColor: ThemeStyle.mainColor,
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
  // icon: {
  //   width: 20,
  //   height: 20,
  //   marginRight: 0,
  //   tintColor: theme.primaryColor
  // },
  // titleStyle: {
  //   fontFamily: theme.semiBoldFont,
  //   letterSpacing: 1,
  //   fontSize: 15,
  //   color: '#52575B',
  //   paddingVertical: 4
  // }
  list: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderColor: "#ccc"
  },
  label: {
    fontFamily: TextStyles.GeneralText.fontFamily,
    fontSize: 15,
    flex: 1,
    paddingVertical: 4,
    marginLeft: 12
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: ThemeStyle.accentColor
  }
};
