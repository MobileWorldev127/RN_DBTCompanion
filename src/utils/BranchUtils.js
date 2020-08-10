import branch from 'react-native-branch'
import { NavigationActions } from "react-navigation";
const IS_BRANCH_LINK_PARAM = '+clicked_branch_link'

export const branchSubscription = (navigator) => {
    branch.subscribe(({error, params, uri}) => {
        if (error) {
          console.error('Error from Branch: ' + error)
          return
        }
        if(!params[IS_BRANCH_LINK_PARAM]) {
            if (uri) {
                let params = getPamarsFromLink(uri);
                navigateToDeepLink(params,navigator);
            }
        }
    })
}

const getPamarsFromLink = (link) => {
    try {
        link = link.replace('https://','')
        let values = link.split('/')    
        return {
            type: values[1].toUpperCase(),
            id: values[2],
            sessionId: values[3],
        }        
    } catch (error) {
        
    }

}

const navigateToDeepLink = (params,navigation) => {
    console.log(params)
    if (params.type == null) {
        return
    }
    try {
        switch (params.type) {
            case 'EXERCISES':
                navigation.dispatch(
                    NavigationActions.navigate({
                        routeName: "ExerciseScreen",
                        params: {
                            currentIndex: 0,
                            exerciseId: params.id,
                            isDeepLink:true,
                            sessionId: params.sessionId,
                        }
                    }
                ));
                break;
            case 'MEDITATIONS':
                navigation.dispatch(
                    NavigationActions.navigate({
                        routeName: "MeditationScreen",
                        params: {
                            isBack: true,
                            isDeepLink: true,
                            meditationId: params.id,
                            sessionId: params.sessionId,
                        }
                    }
                ));
                break;
            case 'LESSONS':
                navigation.dispatch(
                    NavigationActions.navigate({
                        routeName: "LessonsContent",
                        params: {
                            lessonID: params.id,
                            isDeepLink: true,
                            sessionId: params.sessionId,
                        }
                    }
                ));
                break;
                case 'ENTRIES':
                    navigation.dispatch(
                        NavigationActions.navigate({
                            routeName: "Home",
                            params: {
                                isBack: true,
                                isDeepLink: true,
                            }
                        }
                    ));
                    break;
                case 'BREATHING':
                    navigation.dispatch(
                        NavigationActions.navigate({
                            routeName: "ExcerciseBreathingScreen",
                            params: {
                                isBack: true,
                                isDeepLink: true
                            }
                        }
                    ));
                    break;
                case 'PRACTICE':
                    navigation.dispatch(
                        NavigationActions.navigate({
                            routeName: "PracticeIdeasScreen",
                            params: {
                                isDeepLink: true,
                                practiceIdea: {
                                    id: params.id
                                },
                                onClose: () => {
                                    navigation.dispatch(
                                        NavigationActions.back()
                                    )
                                }
                                
                            }
                        }
                    ));
                    break;
        } 
    } catch (error) {
        console.log('error in navigating deep link',error)
    }
}