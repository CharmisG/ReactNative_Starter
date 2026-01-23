import React, { useMemo } from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  Pressable,
  Modal,
  FlatList,
} from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../navigation/NavParamTypes';
import Translate from '../hooks/Translate';
import Colors from '../styles/Colors';
import { AppConstants } from '../constants/AppConstants';
import Images from '../utils/Images';
import LoadingIndicator from '../components/LoadingIndicator';
import { useDashboardScreen } from '../hooks/useDashboardScreen';
import { MenuModal } from '../components/dashboard/MenuModal';
import { ConfirmModal } from '../components/dashboard/ConfirmModal';
import { ListItem } from '../components/dashboard/ListItem';
import { DashboardStyles } from '../components/dashboard/DashboardStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const {
    sampleData,
    isLoading,
    error,
    appTheme,
    visible,
    modalVisible,
    refreshing,
    scale,
    filteredOptions,
    resizeBox,
    onRefresh,
    handleOpenModal,
    handleCloseModal,
    handleNavigateToScreenTwo,
  } = useDashboardScreen(navigation);

  const bottomHalfBackgroundColor = useMemo(
    () => (appTheme === AppConstants.dark ? Colors.black : Colors.white),
    [appTheme]
  );

  const errorContainerStyle = useMemo(
    () => [
      DashboardStyles.errorContainer,
      {
        backgroundColor: appTheme === AppConstants.dark ? '#3d3d3d' : '#ffebee',
      },
    ],
    [appTheme]
  );

  const errorTextStyle = useMemo(
    () => [
      DashboardStyles.errorText,
      {
        color: appTheme === AppConstants.dark ? '#ff8a80' : '#c62828',
      },
    ],
    [appTheme]
  );

  const emptyTextStyle = useMemo(
    () => [
      DashboardStyles.emptyText,
      {
        color: appTheme === AppConstants.dark ? Colors.white : Colors.black,
      },
    ],
    [appTheme]
  );

  const listData = useMemo(
    () => (isLoading && sampleData.length === 0 ? [] : sampleData),
    [isLoading, sampleData]
  );

  const renderItem = ({ item }: { item: any }) => (
    <Pressable onPress={handleOpenModal}>
      <ListItem
        appTheme={appTheme}
        title={item.title}
        completed={item.completed}
        id={item.id}
      />
    </Pressable>
  );

  const renderListEmptyComponent = () => (
    <View style={DashboardStyles.emptyStateContainer}>
      {isLoading && sampleData.length === 0 ? (
        <LoadingIndicator
          size="large"
          color={Colors.primary}
          text={Translate('Loading')}
          imageSource={Images.home}
        />
      ) : (
        <Text style={emptyTextStyle}>
          {Translate('No data available')}
        </Text>
      )}
    </View>
  );

  return (
    <View style={DashboardStyles.container}>
      <SafeAreaView style={DashboardStyles.topHalf}>
        <Pressable
          accessibilityLabel={Translate('Open menu')}
          accessibilityRole="button"
          onPress={() => resizeBox(1)}>
          <Image source={Images.hamburger} style={DashboardStyles.hamburgerIcon} />
        </Pressable>

        <Modal transparent visible={visible}>
          <MenuModal
            visible={visible}
            scale={scale}
            appTheme={appTheme}
            options={filteredOptions}
            onClose={() => resizeBox(0)}
          />
        </Modal>

        <View style={DashboardStyles.headerContainer}>
          <Text
            accessibilityLabel={Translate('Hello')}
            accessibilityRole="text"
            style={DashboardStyles.headerText}>
            {Translate('Hello')} 👋
          </Text>
        </View>
      </SafeAreaView>

      <View style={[DashboardStyles.bottomHalf, { backgroundColor: bottomHalfBackgroundColor }]}>
        <View style={DashboardStyles.listHeader}>
          <Text style={DashboardStyles.listHeaderText}>
            {Translate('Sample List')}
          </Text>
          {isLoading && sampleData.length > 0 && (
            <LoadingIndicator
              size="small"
              color={Colors.primary}
              inline
              imageSource={Images.home}
            />
          )}
        </View>

        {error && (
          <View style={errorContainerStyle}>
            <Text style={errorTextStyle}>{error}</Text>
          </View>
        )}

        <FlatList
          data={listData}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={renderListEmptyComponent}
        />

        <ConfirmModal
          visible={modalVisible}
          onConfirm={handleNavigateToScreenTwo}
          onCancel={handleCloseModal}
        />
      </View>
    </View>
  );
};

export default React.memo(DashboardScreen);
