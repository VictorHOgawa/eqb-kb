import React, { forwardRef, useState } from 'react';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import Theme from '../../../styles/themes';
import { TouchableOpacity, View } from 'react-native';
import PurpleGradient from '../LinearGradientView/LinearGradient';
import { Text } from 'react-native';
import { Image } from 'react-native';
import { ReportMatchModal } from '../../Chat/ReportMatchModal';

interface PhotoPickProps {
  report: () => void;
  unMatch: () => void;
}

export const SecuritySheet = forwardRef<ActionSheetRef, PhotoPickProps>((props, ref) => {
  return (
    <ActionSheet
      ref={ref}
      containerStyle={{
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: 'transparent',
        //   backgroundColor: "#230743",
      }}
      indicatorStyle={{
        width: 100,
      }}
      gestureEnabled={true}
    >
      <View className="w-full overflow-hidden h-80 -mt-3 rounded-t-3xl">
        <PurpleGradient>
          <View className=" flex flex-row items-center p-5  ">
            <Image
              source={require('../../../../assets/Global/Icons/shield.png')}
              className="w-[25px] h-7 "
            />
            <Text className="text-2xl ml-2 text-white font-bold">Ferramenta De Segurança</Text>
          </View>
          <TouchableOpacity
            onPress={props.report}
            className=" w-[88%] m-5 h-20 rounded-lg border-[1px] flex flex-row border-white "
          >
            <View className="flex flex-row justify-center items-center h-full w-12">
              <Image
                source={require('../../../../assets/Global/Icons/flag.png')}
                className="w-5 h-7 "
              />
            </View>
            <View className="flex flex-col max-w-[290px] p-1 ">
              <Text className="text-white text-lg">Denunciar Usuário</Text>
              <Text className="text-white text-[11px]">
                Usuário faltou com respeito, não existe ou quis aplicar golpe? Denuncie agora, não
                contaremos a ninguém.{' '}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={props.unMatch}
            className=" w-[88%] m-5 h-20 rounded-lg border-[1px] flex flex-row border-white "
          >
            <View className="flex flex-row justify-center items-center h-full w-12">
              <Image
                source={require('../../../../assets/Global/Icons/squareWithX.png')}
                className="w-7 h-7 "
              />
            </View>
            <View className="flex flex-col max-w-[290px] p-1 ">
              <Text className="text-white text-lg">Desfazer match</Text>
              <Text className="text-white text-[11px]">
                Acabou o interesse neste usuário? Remova este agora mesmo da sua Galera da Night.
              </Text>
            </View>
          </TouchableOpacity>
        </PurpleGradient>
      </View>
    </ActionSheet>
  );
});

export default SecuritySheet;
