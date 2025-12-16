import {
  Text,
  View,
  Button,
  Image,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Pressable,
  Modal,
  Platform,
  FlatList,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../navigation/NavParamTypes';
import Translate from '../hooks/Translate';
import Colors from '../styles/Colors';
import { fontHeight } from '../styles/Fonts';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Images from '../utils/Images';
import { useDispatch, useSelector } from 'react-redux';
import { HomeSliceActions } from '../redux/slices/HomeSlice';
import { AppDispatch, RootState } from '../redux/store';
import { AppConstants } from '../constants/AppConstants';
import { windowHeight, windowWidth } from '../styles/Dimens';
import analytics from '@react-native-firebase/analytics';
import { AuthContext } from '../hooks/AuthContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import appleAuth from '@invertase/react-native-apple-authentication';
import LoadingIndicator from '../components/LoadingIndicator';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { sampleData, isLoading, error } = useSelector((state: RootState) => state.Home);
  const { appTheme } = useSelector((state: RootState) => state.Settings);
  const [visible, setVisible] = useState(false);
  const scale = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const { loginType } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);

  const analyticsTest = useCallback(async () => {
    await analytics().logScreenView({
      screen_name: "Settings",
      screen_class: "Settings",
    });
  }, []);

  const options = useMemo(
    () => [
      {
        title: Translate('Settings'),
        icon: Images.settings,
        action: () => {
          analyticsTest();
          navigation.getParent()?.navigate('Settings');
        },
      },
      {
        title: Translate('TextEditor'),
        icon: Images.settings,
        action: () => {
          navigation.getParent()?.navigate('TextEditor');
        },
      },
      {
        title: Translate('Logout'),
        icon: Images.logout,
        action: async () => {
          if (loginType == "google") {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
          } else if (loginType == "facebook") {
            await auth().signOut();
          } else if (loginType == "apple") {
            await appleAuth.performRequest({
              requestedOperation: appleAuth.Operation.LOGOUT,
            });
          }
          loginType(null);
          navigation.getParent()?.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ],
    [analyticsTest, loginType, navigation],
  );

  function resizeBox(to: number) {
    to === 1 && setVisible(true);
    Animated.timing(scale, {
      toValue: to,
      useNativeDriver: true,
      duration: 150,
      easing: Easing.linear,
    }).start(() => to === 0 && setVisible(false));
  }

  useEffect(() => {
    dispatch(HomeSliceActions.getSampleDataAction());
  }, []);


  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await dispatch(HomeSliceActions.getSampleDataAction());
    } catch (err) {
      console.warn('Refresh failed', err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.topHalf}>
        <Pressable onPress={() => resizeBox(1)}>
          <Image
            source={Images.hamburger}
            style={{
              marginLeft: 10,
              height: 24,
              width: 24,
              tintColor: Colors.black,
              alignSelf: 'flex-start',
            }}
          />
        </Pressable>
        <Modal transparent visible={visible}>
          <SafeAreaView
            style={{ flex: 1, backgroundColor: 'transparent' }}
            onTouchStart={() => resizeBox(0)}>
            <Animated.View
              style={[
                styles.popup,
                {
                  backgroundColor:
                    appTheme === AppConstants.dark
                      ? Colors.black
                      : Colors.white,
                  opacity: scale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
                {
                  transform: [{ scale: scale }],
                },
              ]}>
              {options.map((op, i) => (
                loginType == null && op.title == Translate('Logout') ? null :
                  <Pressable key={i} onPress={op.action}>
                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 6,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={op.icon}
                        style={{
                          tintColor: appTheme === AppConstants.dark
                            ? Colors.white
                            : Colors.black,
                          height: 24,
                          width: 24,
                          marginLeft: 10,
                          marginRight: 20,
                        }}
                      />
                      <Text
                        style={{
                          marginVertical: 8,
                          fontSize: 16,
                          color:
                            appTheme === AppConstants.dark
                              ? Colors.white
                              : Colors.black,
                        }}>
                        {op.title}
                      </Text>
                    </View>
                  </Pressable>
              ))}
            </Animated.View>
          </SafeAreaView>
        </Modal>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: fontHeight.FONT28,
              fontWeight: "700",
              letterSpacing: 0.5,
              color: Colors.white,
            }}
          >
            {Translate('Hello')} 👋
          </Text>
        </View>
      </SafeAreaView>
      <View
        style={[
          styles.bottomHalf,
          {
            backgroundColor:
              appTheme === AppConstants.dark ? Colors.black : Colors.white,
          },
        ]}>
        <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.itemTextColor}>{Translate('Sample List')}</Text>
          {isLoading && sampleData.length > 0 && <LoadingIndicator size="small" color={Colors.primary} inline imageSource={Images.home} />}
        </View>
        {error && (
          <View style={[styles.errorContainer, { backgroundColor: appTheme === AppConstants.dark ? '#3d3d3d' : '#ffebee' }]}>
            <Text style={[styles.errorText, { color: appTheme === AppConstants.dark ? '#ff8a80' : '#c62828' }]}>
              {error}
            </Text>
          </View>
        )}
        <FlatList
          data={isLoading && sampleData.length === 0 ? [] : sampleData}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          renderItem={({ item }) => (
            <Pressable onPress={() => setModalVisible(true)}>
              <Item
                appTheme={appTheme}
                title={item.title}
                completed={item.completed}
                id={item.id}
              />
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              {isLoading && sampleData.length === 0 ? (
                <LoadingIndicator size="large" color={Colors.primary} text={Translate('Loading')} imageSource={Images.home} />
              ) : (
                <Text style={[styles.emptyText, { color: appTheme === AppConstants.dark ? Colors.white : Colors.black }]}>
                  {Translate('No data available')}
                </Text>
              )}
            </View>
          }
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{Translate('You want to open screen ?')}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setModalVisible(!modalVisible)
                    navigation.getParent()?.navigate('ScreenTwo')
                  }
                  }>
                  <Text style={styles.textStyle}>{Translate('Open')}</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>{Translate('Cancel')}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};
type ItemProps = { appTheme: any; title: string; completed: boolean; id: number };

const Item = ({ appTheme, title, completed, id }: ItemProps) => (
  <View
    style={[
      styles.item,
      {
        backgroundColor:
          appTheme === AppConstants.dark ? Colors.black : Colors.white,
      },
    ]}>
    <Text style={styles.itemTextColor}>{id}</Text>
    <Text style={styles.itemTextColor}>{title}</Text>
    <Text style={styles.itemTextColor}>{completed?.toString()}</Text>
  </View>
);

export default DashboardScreen;

const styles = StyleSheet.create({
  topHalf: {
    flex: 0.5,
    backgroundColor: Colors.primary,
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  popup: {
    borderRadius: 6,
    borderColor: Colors.white,
    borderWidth: 1,
    shadowColor: Colors.primary,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: windowWidth(10),
    paddingVertical: windowHeight(10),
    position: 'absolute',
    width: undefined,
    top: Platform.OS === 'ios' ? windowHeight(80) : windowHeight(30),
    left: windowWidth(20),
    justifyContent: 'flex-start',
  },
  item: {
    backgroundColor: Colors.white,
    padding: 6,
    marginVertical: windowHeight(8),
    marginHorizontal: windowWidth(10),
    borderRadius: 2,
    shadowColor: Colors.grey,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  itemTextColor: {
    color: 'grey',
    fontSize: fontHeight.FONT14,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: windowWidth(0),
      height: windowHeight(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    margin: 8
  },
  buttonClose: {
    backgroundColor: Colors.primary,
  },
  textStyle: {
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: fontHeight.FONT18,
    margin: 15,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: fontHeight.FONT16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    minHeight: 300,
  },
  emptyText: {
    fontSize: fontHeight.FONT16,
    textAlign: 'center',
  },
  errorContainer: {
    marginHorizontal: 10,
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  errorText: {
    fontSize: fontHeight.FONT14,
    fontWeight: '500',
  },
});
