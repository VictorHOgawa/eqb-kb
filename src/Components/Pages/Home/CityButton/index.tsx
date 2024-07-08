import ActionSheet from '@alessiocancian/react-native-actionsheet';
import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

import { getAPI } from '../../../../utils/api';
import ActionSheetCity from '../../../Global/ActionSheetCity';
interface Props extends TouchableOpacityProps {
  selectedCity: any;
  setSelectedCity: any;
}

export function CityButton({ selectedCity, setSelectedCity }: Props) {
  const actionSheetCity = useRef<any>();
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<any>(['Voltar']);
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<any>();

  async function getCities() {
    const connect = await getAPI('/city?query=&page=1');
    if (connect.status === 200) {
      setList(connect.body.city);
      setCities([
        'Ver tudo',
        ...connect.body.city.map((city: any) => `${city.name} - ${city.state}`),
      ]);
      return setLoading(false);
    }
  }

  useEffect(() => {
    getCities();
  }, []);

  async function showActionSheetCity() {
    actionSheetCity.current.show();
  }

  return (
    <>
      <View></View>

      {loading ? (
        <></>
      ) : (
        <>
          {/* <ActionSheet
            style={{ backgroundColor: "red" }}
            ref={actionSheetCity}
            title={"Escolha uma Cidade "}
            options={cities}
            cancelButtonIndex={0}
            onPress={(index: number) => {
              if (index == 0) {
                return;
              } else if (
                index == 1 &&
                selectedCity.name !== "Todos os Eventos"
              ) {
                return setSelectedCity({
                  name: "Todos os Eventos",
                  id: "",
                  state: "",
                  created_at: "",
                });
              } else if (
                index === 1 &&
                selectedCity.name === "Todos os Eventos"
              ) {
                return;
              } else {
                setLoading(false);
                return setSelectedCity(list[index - 1]);
              }
            }}
          /> */}
          <ActionSheetCity ref={actionSheetCity} />
        </>
      )}
    </>
  );
}
