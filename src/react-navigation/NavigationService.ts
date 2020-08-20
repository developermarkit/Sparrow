import {NavigationActions, StackActions} from 'react-navigation';

// NOTE: This service keeps a reference to react-navigation

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params, key) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
      key,
    }),
  );
}

function goBack() {
  _navigator.dispatch(NavigationActions.back({}));
}

function reset(routeName, key, params) {
  // key is an optional field
  const action = NavigationActions.navigate({
    routeName,
    key,
    params,
  });
  _navigator.dispatch(action);
}

function resetAppScreen(routeName, key, params) {
  // key is an optional field
  const action = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName, key, params})],
  });
  _navigator.dispatch(action);
}

function getNavigator() {
  return _navigator;
}

// add other react-navigation functions that you need and export them
export default {
  getNavigator,
  reset,
  goBack,
  resetAppScreen,
  navigate,
  setTopLevelNavigator,
};
