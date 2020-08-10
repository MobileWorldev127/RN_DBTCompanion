import * as RNIap from "react-native-iap";
import { Platform, NativeModules } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { showMessage } from "react-native-flash-message";
import { setLoading } from "./AppActions";
import {
  APP,
  asyncStorageConstants,
  getAmplifyConfig,
  getEnvVars
} from "../constants";
import { recordInteractionEvent, eventNames } from "../utils/AnalyticsUtils";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { setPremiumStatusQuery } from "../queries/setPremiumStatus";
import { getPremiumFeatureQuery } from "../queries/getPremiumFeature";
import bugsnag from "../utils/Bugsnag";

const { RNIapModule } = NativeModules;

let purchaseUpdateSubscription = null;
let purchaseErrorSubscription = null;

export const hasIAP = () => {
  return !!RNIapModule;
};

const itemSkus = Platform.select({
  ios: APP.iap.ios,
  android: APP.iap.android
});

const iapItemsLoaded = products => ({
  type: "IAP_ITEMS_LOADED",
  payload: products
});

export const setSubscription = isPremium => {
  return {
    type: "SET_SUBSCRIBED",
    payload: isPremium
  };
};

export const showSubscription = () => {
  recordInteractionEvent(eventNames.showSubscription);
  return {
    type: "SHOW_SUBSCRIPTION"
  };
};

export const hideSubscription = () => ({
  type: "HIDE_SUBSCRIPTION"
});

export const initializePremiumContent = (cb = () => {}) => {
  return async dispatch => {
    dispatch(
      prepareIAP(async () => {
        dispatch(getSubscriptionItems());
      })
    );
    const hasPremium = await fetchPremiumStatus();
    bugsnag.leaveBreadcrumb(`user has premium from backend ${hasPremium}`);
    console.log("USER PREMIUM", hasPremium);
    if (hasPremium === true) {
      savePremiumFeature(true);
      dispatch(setSubscription(true));
      cb(true);
      bugsnag.notify(new Error("subscription logged"));
    } else if (hasPremium === false) {
      savePremiumFeature(false);
      dispatch(getPurchases(cb));
    } else {
      const hasPremium = await getPremiumFeature();
      if (hasPremium === true) {
        dispatch(setSubscription(true));
        cb(true);
      } else {
        dispatch(getPurchases(cb));
      }
    }
  };
};

export const fetchPremiumStatus = async () => {
  try {
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    const res = await API.graphql({
      query: getPremiumFeatureQuery,
      variables: {
        appId: APP.swasthApp
      }
    });
    console.log("PREMIUM STATUS", res.data);
    if (res.data && res.data.getPremiumFeature) {
      return res.data.getPremiumFeature.hasPremium;
    }
  } catch (e) {
    console.log("ERROR FETCHING PREMIUM STATUS", e);
    return false;
  }
};

export const savePremiumFeature = hasPremium => {
  AsyncStorage.setItem(
    asyncStorageConstants.hasPremium,
    JSON.stringify(hasPremium)
  );
};

export const getPremiumFeature = async () => {
  const data = await AsyncStorage.getItem(asyncStorageConstants.hasPremium);
  return JSON.parse(data);
};

export const prepareIAP = (cb = () => {}) => {
  return dispatch => {
    // showLoader();
    RNIap.initConnection()
      .then(canMakePayments => {
        console.log(canMakePayments);
        console.log(
          "INIT CONNECTION",
          purchaseErrorSubscription,
          purchaseErrorSubscription
        );
        if (!purchaseUpdateSubscription) {
          purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
            purchase => {
              console.log("RECEIVED PURCHASE", purchase);
              if (purchase && purchase.transactionReceipt) {
                recordInteractionEvent(eventNames.iapComplete, {
                  itemID: purchase.productId + ""
                });
                dispatch(getPurchases());
                RNIap.finishTransaction(purchase);
              }
            }
          );
        }
        if (!purchaseErrorSubscription) {
          purchaseErrorSubscription = RNIap.purchaseErrorListener(error => {
            console.warn("purchaseErrorListener", error);
            dispatch(setLoading(false));
            showMessage({
              message: "Failed to make a purchase. Please try again.",
              type: "danger"
            });
          });
        }
      })
      .catch(e => console.log(e))
      .finally(() => {
        // hideLoader();
        cb();
      });
  };
};

export const getSubscriptionItems = () => {
  return dispatch => {
    // showLoader();
    RNIap.getSubscriptions(itemSkus)
      .then(products => {
        console.log("SUBSCRIPTION ITEMS", products);
        dispatch(iapItemsLoaded(products));
      })
      .catch(e => {
        showMessage({
          message: "Failed to fetch subscriptions. Please try again.",
          type: "danger"
        });
        console.log(e);
      })
      .finally(() => {
        // hideLoader();
      });
  };
};

export const buySubscription = productId => {
  return dispatch => {
    RNIap.requestSubscription(productId, false);
  };
};

const purchasesLoaded = purchases => {
  console.log("PURCHASES", purchases);
  recordInteractionEvent(eventNames.iapLoaded, {
    isPremiumUser: purchases.length > 0 ? "Yes" : "No"
  });
  setPremiumStatus(purchases.length > 0);
  return {
    type: "IAP_PURCHASES_LOADED",
    payload: purchases
  };
};

export const getPurchases = (cb = () => {}) => {
  return async dispatch => {
    try {
      if (Platform.OS === "ios") {
        const availablePurchases = await RNIap.getAvailablePurchases();
        if (!availablePurchases || !availablePurchases.length) {
          bugsnag.notify(new Error("subscription none active"));
          console.log(" ++++ NO VALID PURCHASE");
          cb(false);
          dispatch(purchasesLoaded([]));
          dispatch(hideSubscription());
          return;
        }
        const sortedAvailablePurchases = availablePurchases.sort(
          (a, b) => b.transactionDate - a.transactionDate
        );
        const currentReceipt = sortedAvailablePurchases[0].transactionReceipt;
        console.log(
          "currentReceipt",
          currentReceipt.slice(currentReceipt.length - 10)
        );
        //bugsnag.leaveBreadcrumb('currentReceipt', currentReceipt.slice(currentReceipt.length - 10));

        const receiptBody = {
          "receipt-data": currentReceipt,
          password: APP.iapSharedSecret
        };
        bugsnag.leaveBreadcrumb(
          `validating receipt ${currentReceipt &&
            currentReceipt.slice(currentReceipt.length - 10)}`
        );
        const receipt = await RNIap.validateReceiptIos(receiptBody, false);
        console.log("++++ RECEIPT", receipt);
        bugsnag.leaveBreadcrumb(`got purchase receipt ${receipt.status}`);
        if (receipt.status === 21007) {
          const receiptSandbox = await RNIap.validateReceiptIos(
            receiptBody,
            true
          );
          bugsnag.leaveBreadcrumb("sandbox receipt");
          if (checkReceiptValidity(receiptSandbox)) {
            // bugsnag.notify(new Error("subscription logged"));
            cb(true);
            dispatch(purchasesLoaded([1]));
            dispatch(hideSubscription());
            return;
          }
        } else if (checkReceiptValidity(receipt)) {
          // bugsnag.notify(new Error("subscription logged"));
          cb(true);
          dispatch(purchasesLoaded([1]));
          dispatch(hideSubscription());
          return;
        }
        bugsnag.notify(new Error("subscription none active"));
        console.log(" ++++ NO VALID PURCHASE");
        cb(false);
        dispatch(purchasesLoaded([]));
        dispatch(hideSubscription());
      } else {
        const purchases = await RNIap.getAvailablePurchases();
        cb(purchases.length > 0);
        dispatch(purchasesLoaded(purchases));
        dispatch(hideSubscription());
      }
    } catch (e) {
      showMessage({
        message: "Failed to connect to store. Please try again.",
        type: "danger"
      });
      cb(false);
      console.log("Available purchase error---->", e);
      bugsnag.leaveBreadcrumb("subscription error");
      bugsnag.notify(e);
      dispatch(purchasesLoaded([]));
      dispatch(setLoading(false));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

/*
const checkReceiptValidity = receipt => {
  if (receipt.latest_receipt_info) {
    const renewalHistory = receipt.latest_receipt_info;
    const expiration =
      renewalHistory[renewalHistory.length - 1].expires_date_ms;
    console.log(`Subscription Expiration:`, new Date(parseInt(expiration)).toString());
    bugsnag.leaveBreadcrumb(`Subscription Expiration:`, new Date(parseInt(expiration)).toString());
    if (expiration && expiration > Date.now()) {
      bugsnag.leaveBreadcrumb("working subscription");
      console.log("++++ WORKING SUBSCRIPTION", expiration);
      return true;
    }
    bugsnag.leaveBreadcrumb("expired subscription");
    console.log("++++ EXPIRED SUBSCRIPTION");
    return false;
  } else {
    bugsnag.leaveBreadcrumb("no latest receipt info");
    console.log("++++NO LATEST RECEIPT INFO");
    return false;
  }
};
*/

const checkReceiptValidity = receipt => {
  const { latest_receipt_info: latestReceiptInfo } = receipt;
  const isSubValid = !!latestReceiptInfo.find(receipt => {
    const expirationInMilliseconds = Number(receipt.expires_date_ms);
    //console.log(`Subscription Expiration:`, new Date(expirationInMilliseconds).toString());
    //bugsnag.leaveBreadcrumb(`Subscription Expiration:`, new Date(expirationInMilliseconds).toString());
    const nowInMilliseconds = Date.now();
    if (expirationInMilliseconds > nowInMilliseconds) {
      bugsnag.leaveBreadcrumb(
        "working subscription - Expiration:",
        new Date(expirationInMilliseconds).toString()
      );
      console.log(
        "++++ WORKING SUBSCRIPTION - Expiration:",
        new Date(expirationInMilliseconds).toString()
      );
      console.log("++++Date Now", new Date(Date.now()).toString());

      return true;
    } else {
      //bugsnag.leaveBreadcrumb("expired subscription");
      //console.log("++++ EXPIRED SUBSCRIPTION");
      return false;
    }
  });
  if (!isSubValid) {
    bugsnag.leaveBreadcrumb("No Valid subscriptions found");
    console.log("++++ No Valid subscriptions found");
  }
  return isSubValid;
};

const setPremiumStatus = async isPremium => {
  const isPremiumCache = await AsyncStorage.getItem(
    asyncStorageConstants.premiumStatus
  );
  let isStatusChanged = !isPremiumCache;
  if (isPremiumCache === "true" && !isPremium) {
    isStatusChanged = true;
  }
  if (isPremiumCache === "false" && isPremium) {
    isStatusChanged = true;
  }
  if (isStatusChanged) {
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    API.graphql(
      graphqlOperation(setPremiumStatusQuery, {
        app: APP.swasthApp,
        status: isPremium
      })
    )
      .then(res => {
        console.log("CHANGED PREMIUM STATUS", res.data);
        AsyncStorage.setItem(
          asyncStorageConstants.premiumStatus,
          isPremium ? "true" : "false"
        );
      })
      .catch(err => {
        console.log("ERROR CHANGING PREMIUM STATUS", err);
      });
  }
};

export const clearListeners = () => {
  if (purchaseUpdateSubscription) {
    purchaseUpdateSubscription.remove();
    purchaseUpdateSubscription = null;
  }
  if (purchaseErrorSubscription) {
    purchaseErrorSubscription.remove();
    purchaseErrorSubscription = null;
  }
};

export const endIAPConnection = () => {
  console.log("END IAP CONNECTION");
  RNIap.endConnectionAndroid();
};
