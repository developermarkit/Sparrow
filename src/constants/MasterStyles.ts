import Colors from './Colors';
import {EOrderStatus, EProductStatus} from './Enums';

const parentContainerStyles = {
  flex: 1,
  backgroundColor: '#ECFCFC',
};

const shadow = {
  shadowColor: '#599ACC',
  shadowOffset: {width: 0, height: 7},
  shadowOpacity: 0.5,
  shadowRadius: 10,
  elevation: 1,
};

const paper = {
  backgroundColor: '#FFF',
  ...shadow,
};

const masterLoader = {
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
  backgroundColor: Colors.cloudyWhite70,
};

const bodyText = {
  fontSize: 15,
  lineHeight: 20,
  color: Colors.dark,
};

const smallText = {
  fontSize: 13,
  fontWeight: '500',
  color: Colors.dark,
};

const topBorderRadius = {
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
};
const BottomBorderRadius = {
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
};
const heading1 = {
  fontSize: 30,
  color: Colors.dark,
};

const heading2 = {
  fontSize: 22,
  color: Colors.dark,
  lineHeight: 28,
  fontFamily: 'Nunito-SemiBold',
};

const heading3 = {
  fontSize: 16,
  color: Colors.blue,
};

const subHeading = {
  fontSize: 20,
  fontStyle: 'italic',
};

const boldText = {
  fontWeight: '700',
};

const boldText2 = {
  fontWeight: '900',
};

const italicsText = {
  fontStyle: 'italic',
};

const handWrittenHeading = {
  fontSize: 32,
  lineHeight: 45,
  color: Colors.dark,
};

const handWrittenBody = {
  fontSize: 23,
  color: Colors.dark,
};

const linkText = {
  color: Colors.blue,
  fontWeight: '800',
};

const inputText = {
  fontSize: 18,
  color: Colors.blue,
};

const inputPunctuation = {
  fontSize: 22,
  color: Colors.blue,
  lineHeight: 30,
};

const inputField = {
  backgroundColor: '#FFF',
  borderRadius: 6,
  borderWidth: 1,
  borderColor: '#CCC',
  paddingVertical: 5,
  paddingHorizontal: 10,
};

const backButtonLayout = {
  flexDirection: 'row',
  marginRight: 5,
};
const horizontalLayout = {
  flexDirection: 'row',
};

const body = {
  paddingHorizontal: 16,
};
const genericTextStyle = {
  color: Colors.payneGrey,
  fontFamily: 'SFProRounded-Medium',
  fontSize: 16,
  fontWeight: '500',
  letterSpacing: 0.3,
};

const productStatus = (status: string) => {
  switch (status.toUpperCase()) {
    case EProductStatus.AVAILABLE:
      return {
        fontSize: 13,
        color: Colors.toggleGreen,
        paddingVertical: 5,
        ...boldText,
      };
    case EProductStatus.OUT_OF_STOCK:
      return {
        fontSize: 13,
        color: Colors.red,
        paddingVertical: 5,
        ...boldText,
      };
  }
};

const orderStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case EOrderStatus.COMPLETE.toLowerCase():
      return {
        color: Colors.toggleGreen,
        ...boldText,
      };
    case EOrderStatus.REJECTED.toLowerCase():
      return {
        color: Colors.red,
        ...boldText,
      };
    case EOrderStatus.CANCELLED.toLowerCase():
      return {
        color: Colors.red,
        ...boldText,
      };
    case EOrderStatus.PLACED.toLowerCase():
      return {
        color: Colors.primaryColorDark,
        ...boldText,
      };
    case EOrderStatus.PENDING.toLowerCase():
      return {
        color: Colors.deepskyblue,
        ...boldText,
      };
    case EOrderStatus.ON_THE_WAY.toLowerCase():
      return {
        color: Colors.teal,
        ...boldText,
      };
  }
};

export {
  parentContainerStyles,
  shadow,
  paper,
  bodyText,
  smallText,
  heading1,
  heading2,
  heading3,
  subHeading,
  boldText,
  boldText2,
  italicsText,
  handWrittenHeading,
  handWrittenBody,
  linkText,
  inputText,
  inputPunctuation,
  inputField,
  horizontalLayout,
  body,
  topBorderRadius,
  backButtonLayout,
  genericTextStyle,
  BottomBorderRadius,
  masterLoader,
  productStatus,
  orderStatus,
};
