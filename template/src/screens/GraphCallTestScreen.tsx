import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, SafeAreaView} from 'react-native';
import {Text, View} from 'react-native';
import {RootStackParamList} from '../navigation/NavParamTypes';
import MainView from '../components/MainView';
import Colors from '../styles/Colors';
import {MakeCall} from '../api/GraphApiBase';
import { useState } from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'GraphCallTestScreen'>;

const GraphCallTestScreen = ({navigation}: Props) => {

  const [responseString, setReponseString] = useState('Making Graph Call');

  async function makeApiCall() {
    const query = `
            query Hello {
                hello(person: { name: "Bowzer", age: 2 })
            }
        `;

    let res = await MakeCall('https://graphql.postman-echo.com/graphql', query);
    setReponseString(res.data?.data?.hello);
  }

  return (
    <MainView screenTitle="Graph Test" leftIconVisible={false}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.white,
        }}>
        <Text>Test</Text>
        <Button title="Make Call" onPress={() => makeApiCall()} />
        <Text>{responseString}</Text>
      </View>
    </MainView>
  );
};

export default GraphCallTestScreen;
