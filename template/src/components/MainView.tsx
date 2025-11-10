import {Platform, SafeAreaView, StatusBar, View} from 'react-native';
import Navbar from './Navbar';
import Colors from '../styles/Colors';

type MainViewProps = {
  children?: any;
  leftIconVisible?: Boolean;
  leftIconPressed?: any;
  rightIcon?: React.JSX.Element;
  rightIconPressed?: any;
  screenTitle: string;
  mainView?: React.JSX.Element;
};

const MainView = ({
  children,
  leftIconVisible = true,
  leftIconPressed,
  rightIcon,
  rightIconPressed = () => {},
  screenTitle = 'Add Screen Title',
}: MainViewProps) => {
  return (
    <>
      {Platform.OS === 'android' && (
        <StatusBar backgroundColor={Colors.primary} />
      )}
      <SafeAreaView style={{backgroundColor: Colors.primary}}></SafeAreaView>
      <Navbar
        screenTitle={screenTitle}
        leftIconVisible={leftIconVisible}
        leftIconPressed={leftIconPressed}
      />
      {children}
    </>
  );
};

export default MainView;
