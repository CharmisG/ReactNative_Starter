import { StyleSheet } from 'react-native';
import Colors from './Colors';
import { fontHeight } from './Fonts';
import { windowHeight } from './Dimens';

const Styles = StyleSheet.create({
  mainNavbar: {
    backgroundColor: Colors.primary,
    height: windowHeight(44),
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: windowHeight(6),
    paddingVertical: windowHeight(4),
  },
  navBarTitle: {
    color: Colors.white,
    fontSize: fontHeight.FONT15,
    textAlign: 'center',
  },
  navBarIcon: {
    color: Colors.white,
    height: windowHeight(18),
    width: windowHeight(18),
    margin: windowHeight(8)
  },
  mainViewContainer: {
    backgroundColor: Colors.white,
    padding: windowHeight(8),
  },
});

export default Styles;
