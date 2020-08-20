import {EUserRole} from '../constants/Enums';
import {
  SET_ROLE,
  SET_SID,
  SET_USER,
  SIGN_OUT,
  SET_SHOP_DETAILS,
  SET_USER_DETAILS,
  SET_PHONE,
} from './actions';

const initialState = {
  role: EUserRole.USER,
  sid: '',
  shopDetails: {},
  userDetails: {},
  phoneNumber: '',
  currentUser: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PHONE:
      return {
        ...state,
        phoneNumber: action.payload,
      };
    case SET_USER_DETAILS:
      return {
        ...state,
        userDetails: action.payload,
      };
    case SET_SHOP_DETAILS:
      return {
        ...state,
        shopDetails: action.payload,
      };
    case SET_ROLE:
      return {
        ...state,
        role: action.payload,
      };
    case SET_SID:
      return {
        ...state,
        sid: action.payload,
      };
    case SET_USER:
      return action.payload
        ? {
            ...state,
            role: action.payload.role,
            currentUser: action.payload,
          }
        : {
            ...state,
            role: EUserRole.USER,
            currentUser: action.payload,
          };
    case SIGN_OUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default reducer;
