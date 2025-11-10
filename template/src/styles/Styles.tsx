import {StyleSheet} from 'react-native';
import Colors from './Colors';
import {fontHeight} from './Fonts';

const Styles = StyleSheet.create({
  mainNavbar: {
    backgroundColor: Colors.primary,
    height: 44,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  navBarTitle: {
    color: Colors.white,
    fontSize: fontHeight.FONT15,
    textAlign: 'center',
  },
  navBarIcon: {
    color: Colors.white,
    height: 18,
    width: 18,
    margin : 8
  },
  mainViewContainer: {
    backgroundColor: Colors.white,
    padding: 8,
  },
});

export default Styles;
