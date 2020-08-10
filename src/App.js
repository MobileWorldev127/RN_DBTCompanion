import React, {Component} from 'react';
import * as RNLocalize from 'react-native-localize';
import {Provider} from 'react-redux';
import store from './store';
import AppWithNavigationState from './navigators/AppNavigator';
import Amplify, {Auth} from 'aws-amplify';
import {ApolloProvider} from 'react-apollo';
import AWSAppSyncClient, {createAppSyncLink} from "aws-appsync/lib/client";
import {getEnvVars} from './constants';
import {createHttpLink} from "apollo-link-http";
import {setContext} from "apollo-link-context";
import {ApolloLink} from "apollo-link";
import {addNetworkChangeListener, removeNetworkChangeListener} from './utils/NetworkUtils';
import {languageTagFunc, setI18nConfig} from './utils/LocalizeUtils';
import AsyncStorage from '@react-native-community/async-storage';
import {getEntriesComponent} from './screens/EntriesScreen';
import bugsnagClient from './utils/Bugsnag';
import {EmiiterHandlerSubscribe} from './screens/settings/EventEmitter'

Amplify.configure(getEnvVars().awsConfig);
// const appSyncClientOptions = {
//   url: getEnvVars().APP_SYNC_URL,
//   region: getEnvVars().Region,
//   complexObjectsCredentials: () => { return null },
//   auth: {
//     type: getEnvVars().AuthMode,
//     jwtToken: async () =>
//         (await Auth.currentSession()).getIdToken().getJwtToken()
//   },
//   offlineConfig: {
//     keyPrefix: "dbt",
//     callback: (err, succ) => {
//       if (err) {
//         const { mutation, variables } = err;
//         bugsnagClient.leaveBreadcrumb(`Error for ${mutation}`);
//         bugsnagClient.notify(err);
//         console.warn(`ERROR for ${mutation}`, err);
//         console.warn(`ERROR for ${mutation}`, err);
//       } else {
//         const { mutation, variables } = succ;

//         console.info(`SUCCESS for ${mutation}`, succ);
//         bugsnagClient.leaveBreadcrumb(`Success for ${mutation}`);
//         if (getEntriesComponent()) {
//           getEntriesComponent().fetchEntries();
//         }
//       }
//     },
//     storage: AsyncStorage
//   }
// };


// export const client = new AWSAppSyncClient(appSyncClientOptions, {
//   link: createAppSyncLink({
//     ...appSyncClientOptions,
//     resultsFetcherLink: ApolloLink.from([
//       setContext((request, previousContext) => ({
//         headers: {
//           ...previousContext.headers,
//           locale: languageTagFunc()
//         },
//       })),
//       createHttpLink({
//         uri: appSyncClientOptions.url
//       })
//     ])
//   })
// });
export const client = new AWSAppSyncClient({
  url: getEnvVars().APP_SYNC_URL,
  region: getEnvVars().Region,
  auth: {
    type: getEnvVars().AuthMode,
    jwtToken: async () =>
        (await Auth.currentSession()).getIdToken().getJwtToken()
  },
  offlineConfig: {
    keyPrefix: "dbt",
    callback: (err, succ) => {
      if (err) {
        const { mutation, variables } = err;
        bugsnagClient.leaveBreadcrumb(`Error for ${mutation}`);
        bugsnagClient.notify(
          new Error("Error for ${mutation}", report => {
            report.metadata = {
              ErrorDetails: {
                data: JSON.stringify(err)
              }
            };
          })
        );
        console.warn(`ERROR for ${mutation}`, err);
      } else {
        const { mutation, variables } = succ;
        bugsnagClient.leaveBreadcrumb(`Success for ${mutation}`);
        console.info(`SUCCESS for ${mutation}`, succ);
        if (getEntriesComponent()) {
          getEntriesComponent().fetchEntries();
        }
      }
    },
    storage: AsyncStorage
  }
});

export const swasthCommonsClient = new AWSAppSyncClient({
  url: getEnvVars().SWASTH_COMMONS_ENDPOINT_URL,
  region: getEnvVars().Region,
  auth: {
    type: getEnvVars().AuthMode,
    jwtToken: async () =>
        (await Auth.currentSession()).getIdToken().getJwtToken()
  },
  offlineConfig: {
    keyPrefix: "swasthCommon",
    callback: (err, succ) => {
      if (err) {
        const { mutation, variables } = err;

        console.warn(`ERROR for ${mutation}`, err);
      } else {
        const { mutation, variables } = succ;

        console.info(`SUCCESS for ${mutation}`, succ);
      }
    },
    storage: AsyncStorage
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    // Translation method
    setI18nConfig();
    //Text.defaultProps.allowFontScaling=false,
    this.state = {};
    console.disableYellowBox = true;
    // enableScreens();
  }

  componentDidMount() {
    EmiiterHandlerSubscribe();
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
    addNetworkChangeListener();
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener('change', this.handleLocalizationChange);
    removeNetworkChangeListener();
  }

  handleLocalizationChange = () => {
    setI18nConfig().then(() => this.forceUpdate()).catch(error => {console.error(error)})
  };


  render() {
    return (
        <ApolloProvider client={client}>
          <Provider store={store}>
            <AppWithNavigationState />
          </Provider>
        </ApolloProvider>
    );
  }
}

export default App;
