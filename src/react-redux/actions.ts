export const SET_ROLE = 'SET_ROLE';
export const SET_SID = 'SET_SID';
export const SET_USER = 'SET_USER';
export const SIGN_OUT = 'SIGN_OUT';
export const SET_USER_DETAILS = 'SET_USER_DETAILS';
export const SET_SHOP_DETAILS = 'SET_SHOP_DETAILS';
export const SET_PHONE = 'SET_PHONE';

export const setPhone = role => {
  return {
    type: SET_PHONE,
    payload: role,
  };
};
export const setRole = role => {
  return {
    type: SET_ROLE,
    payload: role,
  };
};
export const setUserDetails = userDetails => {
  return {
    type: SET_USER_DETAILS,
    payload: userDetails,
  };
};
export const setShopDetails = shopDetails => {
  return {
    type: SET_SHOP_DETAILS,
    payload: shopDetails,
  };
};

export const setSid = sid => {
  return {
    type: SET_SID,
    payload: sid,
  };
};

export const setUser = user => {
  return {
    type: SET_USER,
    payload: user,
  };
};

export const signOut = () => {
  return {
    type: SIGN_OUT,
  };
};
