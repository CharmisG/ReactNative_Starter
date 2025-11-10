import {Button, Image, Pressable, Text, View} from 'react-native';
import Styles from '../styles/Styles';
import Colors from '../styles/Colors';
import Images from '../utils/Images';
import { useSelector } from 'react-redux';
import { RootState} from '../redux/store';
import {AppConstants} from '../constants/AppConstants';

export type Props = {
  leftIconVisible?: Boolean;
  leftIconPressed: any;
  rightIcon?: React.JSX.Element;
  rightIconPressed?: any;
  screenTitle: string;
};

const Navbar: React.FC<Props> = ({
  leftIconVisible = true,
  leftIconPressed,
  rightIcon,
  rightIconPressed = () => {},
  screenTitle = 'Add Screen Title',
}) => {
    const {appTheme} = useSelector((state: RootState) => state.Settings);

  return (
    <View style={Styles.mainNavbar}>
      <View
        style={{
          width: '12%',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}>
        {leftIconVisible && (
          <Pressable onPress={leftIconPressed}>
            <Image source={Images.backButton} style={[Styles.navBarIcon,{tintColor : appTheme === AppConstants.dark ? Colors.black : Colors.white}]}></Image>
          </Pressable>
        )}
      </View>
      <View
        style={{width: '76%', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={[Styles.navBarTitle , {color : appTheme === AppConstants.dark ? Colors.black : Colors.white} ]}>{screenTitle}</Text>
      </View>
      <Pressable
        style={{width: '12%', justifyContent: 'center', alignItems: 'flex-end'}}
        onPress={rightIconPressed}>
        {rightIcon}
      </Pressable>
    </View>
  );
};

export default Navbar;
