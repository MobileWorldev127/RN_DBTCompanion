import { translate } from '../utils/LocalizeUtils';

export default APP_CONFIG = {
  DBT_COACH: {
    id: "3",
    swasthApp: "DC",
    appName: translate("DBT Coach"),
    graphql: {
      dev:
        "https://e2xgr5csbfdktn7fclvowpkery.appsync-api.us-east-1.amazonaws.com/graphql",
      prod:
        "https://z5qqv4eqnrcvjlpqdr4bjekmkm.appsync-api.us-east-1.amazonaws.com/graphql"
    },
    iap: {
      ios: ["dbtcoach.monthly", "dbtcoach.six.monthly"],
      android: ["dbtcoach.monthly", "dbtcoach.six.monthly"]
    },
    iapSharedSecret: "f1c19b568bf64a7b8749d65d8748a58a",
    privacyPolicy: "https://www.swasth.co/privacy",
    tnc: "https://www.swasth.co/terms",
    support:
      "mailto:apps-help@swasth.co?subject=Question regarding DBT Coach App",
    review: "mailto:apps-help@swasth.co?subject=DBT Coach App Review",
    appStoreLink: "itms-apps://itunes.apple.com/app/dbt-coach/id1452264969",
    playStoreLink: `market://details?id=co.swasth.dbtcoach`,
    therapy: "DBT",
    usersGroupName: "dbt-coach-users",
    s3BucketPrefix: "dbt-coach/",
    aboutContent:
      `<h3>${translate('What is DBT?')}</h3> <p>${translate("The “D” means “dialectical.” A dialectic is a synthesis or integration of opposites. In DBT, dialectical strategies help both the therapist and the client get unstuck from extreme positions.")} </p> <p>${translate("The “B” stands for “behavioral.” DBT requires a behavioral approach.")} </p> <p>${translate("The theory behind the approach is that some people are prone to react in a more intense and out-of-the-ordinary manner toward certain emotional situations, primarily those found in romantic, family and friend relationships. DBT theory suggests that some people’s arousal levels in such situations can increase far more quickly than the average person’s, attain a higher level of emotional stimulation, and take a significant amount of time to return to baseline arousal levels.")}</p> <p>${translate("Dialectical behavior therapy (DBT) is a specific type of cognitive-behavioral psychotherapy developed in the late 1980s by psychologist Marsha M. Linehan to help better treat borderline personality disorder. Since its development, it has also been used for the treatment of other kinds of mental health disorders")}</p>`,
    youtubeAPIKey: "AIzaSyAhsyzyamCHUkWFBo0C497B5NOlnpSWy20",
    faqContent: `<h3>What is DBT Coach?</h3><p>DBT Coach is an evidence-based mobile application created in collaboration with clinical experts in DBT that allows you to access on-demand help for a wide variety of conditions: BPD, Personality disorders, Phobias, Addictions, Anxiety, Depression, Eating disorders, Sleep disorders, Bipolar disorder, Problems with stress, Panic attacks, Anger issues. Swasth uses clinically validated techniques in Dialectic Behavior Therapy (DBT) that are designed to work together to help you learn how to feel happier. Our mission is to help people build the life skills they need - anytime, anywhere, and in any way they choose.</p><h3>I just purchased a subscription, but my account did not activate!</h3><p>If you purchased a premium subscription to DBT Coach and do not have access, click on 'Restore Purchase' from the left navigation bar. If that doesn't work, just log out and log back in again to your account. That should refresh your account and allow you to move forward with your DBT Journey. If you are still having trouble after trying the steps above, reach out to us at <strong>apps-help@swasth.co</strong></p><h3>How do I cancel my subscription?</h3><p>If you use a<strong> Apple Device (iOS)</strong>:</p><ol><li>Open the Settings app</li><li>Scroll down to 'iTunes and App Store'</li><li>Tap Your AppleID Email</li><li>Select 'View AppleID' (You may be asked to log in)</li><li>Tap 'Subscriptions'</li><li>Select the DBT Coach subscription</li><li>Tap 'Cancel Subscription' to disable it from auto-renewing at the end of the current billing cycle</li></ol><p>If you use a <strong> Android Device</strong>:</p><ol><li>Open the Google Play Store</li><li>Tap Menu (3 small horizontal lines) next to 'Google Play'</li><li>Tap Subscriptions</li><li>Find the subscription you want to cancel</li><li>Tap Cancel</li></ol>`
  },
  Fitbit: {
    client_id: '22BMHK',
    client_secret: '9277027056d736efda2d9a485d640e5c'
  }
};
