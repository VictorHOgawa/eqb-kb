import React, { useState, memo, useRef } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

// Um componente de item otimizado com React.memo para evitar renderizações desnecessárias
const AgeItem = memo(({ item, onPressItem, isSelected }: any) => (
  <TouchableOpacity
    onPress={() => onPressItem(item)}
    className={`w-[300px] flex items-center h-[50px] ${
      isSelected ? "bg-transparent" : "bg-transparent"
    } justify-center items-center mb-2`}
  >
    <Text
      className={` flex items-center justify-center  ${
        isSelected ? "text-[#9D38CD] text-5xl" : "text-white text-3xl"
      } font-bold`}
    >
      {item}
    </Text>
  </TouchableOpacity>
));

const AgeSelector = ({ age, setAge }: any) => {
  const flatListRef = useRef();
  const itemHeight = 58; // Altura de cada item da lista
  const ages = Array.from({ length: 100 }, (_, i) => i); // Cria uma lista de idades de 0 a 99

  // Esta função é chamada quando a rolagem da lista para completamente
  const onMomentumScrollEnd = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    // Ajuste o cálculo para selecionar o terceiro item da lista
    const index = Math.round((yOffset + 2 * itemHeight) / itemHeight);
    setAge(ages[index]);
  };

  // Otimizações para a propriedade getItemLayout
  const getItemLayout = (data: any, index: any) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  });

  const renderItem = ({ item }: any) => (
    <AgeItem item={item} onPressItem={setAge} isSelected={age === item} />
  );

  return (
    <View className="flex-1 relative justify-center h-[400px]  w-full items-center ">
      <FlatList
        data={ages}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
        // Ajuste esta propriedade para otimizar o carregamento fora da tela
        renderItem={renderItem}
        // Faz o FlatList parar no intervalo de cada item
        // Acelera a desaceleração para parar mais rapidamente
        onMomentumScrollEnd={onMomentumScrollEnd}
      />
    </View>
  );
};

export default AgeSelector;
