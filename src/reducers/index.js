//import auth from './auth';
import nav from "./navReducer";
import iap from "./iapReducer";
import record from "./recordReducer";
import app from "./appReducer";
import assessments from "./assessmentsReducer";
import quiz from "./quizReducer";
import shareSettings from "./shareSettings";
import homework from "./homeworkReducer";
import customPreferences from "./customPreferences";
import nutritionix from './nutritionixReducer';
import sourceSettings from "./sourceSettings";
import devicesSettings from "./devicesSettings";

const AppReducer = {
  nav: nav,
  record,
  app,
  iap,
  assessments,
  quiz,
  shareSettings,
  homework,
  customPreferences,
  nutritionix,
  sourceSettings,
  devicesSettings
};

export default AppReducer;
