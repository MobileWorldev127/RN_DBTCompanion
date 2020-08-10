import "babel-polyfill";
import { AppRegistry } from "react-native";
import App from "./src/App";
import { Client } from 'bugsnag-react-native';

const bugsnag = new Client("a538deefa9c7c8895b264776fd63bbd0");

AppRegistry.registerComponent("DBTCoach", () => App);
