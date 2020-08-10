import TextStyles from "../../common/TextStyles";

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
    color: TextStyles.GeneralText.color,
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
