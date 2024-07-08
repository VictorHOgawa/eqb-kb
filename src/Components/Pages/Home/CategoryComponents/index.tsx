import React from 'react';
import { View, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
import { useCategory } from '../../../../context/categoryContext'; // Ajuste o caminho conforme necessário
import { useNavigation } from '@react-navigation/native';

interface CategoriesComponentProps {
  loading: boolean;
  error: string | null;
}

const CategoriesComponent: React.FC<CategoriesComponentProps> = ({ loading, error }) => {
  const { categories, setCategoriesIndex } = useCategory();
  const navigation = useNavigation<any>();

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    return <Text>No categories available</Text>;
  }
  const handleCategoryPress = (index: number) => {
    setCategoriesIndex(index);
    navigation.navigate('Search');
  };
  // Função para renderizar a categoria
  const renderCategory = (category: any, index: number) => (
    <View key={index} className="flex flex-col items-center justify-center">
      <TouchableOpacity
        className="w-28 h-24 flex items-center justify-center"
        onPress={() => {
          handleCategoryPress(index);
        }}
      >
        <Image
          className="absolute w-28 h-24"
          source={require('../../../../../assets/Global/blurHome.png')}
        />
        <Image className="self-center z-50 w-8 h-8" source={{ uri: category.icon }} />
        <Image
          className="w-[99px] absolute h-[87px] rounded-md mt-[1px]"
          source={{ uri: category.background }}
        />
        <View className="w-[99px] absolute h-[87px] rounded-md mt-[1px] border-[1px] border-[#D356F3] bg-[#3C1357]/70" />
        <View className="w-[99px] absolute h-[87px] rounded-md mt-[1px] border-[1px] border-[#D356F3] bg-[#3C1357]/70" />
      </TouchableOpacity>
      <Text className="text-white font-poppinsRegular">{category.name}</Text>
    </View>
  );

  // Dividindo as categorias em duas partes
  const firstThreeCategories = categories.length >= 3 ? categories.slice(0, 3) : [];
  const lastThreeCategories = categories.length >= 3 ? categories.slice(-3) : [];

  return (
    <>
      <View className="flex mt-4 mb-4 flex-row w-[95%] self-center justify-between">
        {firstThreeCategories.map((category, index) => renderCategory(category, index))}
      </View>
      <View className="flex mt-0 mb-4 flex-row w-[95%] self-center justify-between">
        {lastThreeCategories.map((category, index) => renderCategory(category, index + 3))}
      </View>
    </>
  );
};

export default CategoriesComponent;
