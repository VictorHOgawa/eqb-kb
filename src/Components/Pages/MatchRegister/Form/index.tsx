import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import Theme from '../../../../styles/themes';
import { InputForm } from '../../../Global/Forms/FormInput';
import { PickImage } from '../../../Global/Forms/ImageUpload/PickImage';
import { useEffect, useRef, useState } from 'react';
import { Alert, View, Text, TextInput } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AgeSelector from './selector';

interface FormProps {
  step: number;
  formData: any;
  setFormData: any;
  open: boolean;
  setOpen: any;
  descriptionType: string;
  setDescriptionType: any;
  handleMatchRegister: any;
  loading: boolean;
  setLoading: any;
}
export function Form({
  step,
  formData,
  setFormData,
  open,
  setOpen,
  descriptionType,
  setDescriptionType,
  handleMatchRegister,
  loading,
  setLoading,
}: FormProps) {
  const navigation = useNavigation<any>();
  const { control, handleSubmit } = useForm();

  const handleEmpty = () => {
    setLoading(true);
    if (descriptionType === '') {
      Alert.alert('Selecione um Modelo de Descrição, ou Adicione uma Descrição Própria');
      return setLoading(false);
    }
    if (descriptionType !== '') {
      setFormData({ ...formData, description: descriptionType });
      setOpen(false);
      return setLoading(false);
    }
  };
  function handleUpdateFormData(
    image: { photo_key: string; photo_location: string },
    index: number
  ) {
    setFormData((prevFormData: any) => {
      const newPhotos = [...prevFormData.photos];

      // Verifica se a posição já existe
      if (newPhotos[index]) {
        // Substitui a imagem existente
        newPhotos[index] = image;
      } else {
        // Adiciona a nova imagem na posição
        newPhotos.push(image);
      }

      return {
        ...prevFormData,
        photos: newPhotos,
      };
    });
  }
  const numbers = Array.from({ length: 100 }, (_, index) => ({
    id: index.toString(),
    age: index,
  }));

  const [selectedAge, setSelectedAge] = useState(null);
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 2) {
      const thirdItem = viewableItems[2].item; // Pegando o terceiro item visível
      setSelectedAge(thirdItem.age);
    }
  }).current;
  const [age, setAge] = useState(0);
  const handleAgeChange = (newAge: any) => {
    setAge(newAge);
    setFormData({ ...formData, age: newAge });
  };
  useEffect(() => {}, [formData]);
  return (
    <View className="w-full mt-10  h-[60vh] ">
      {step === 1 ? (
        <View className="h-[400px] ">
          <AgeSelector age={age} setAge={handleAgeChange} />
        </View>
      ) : step === 3 ? (
        <>
          <View>
            <View className="flex flex-row justify-between w-full ">
              <View className="w-[230px] h-52 bg-white rounded-xl overflow-hidden">
                <PickImage
                  imageLength={0}
                  imageData={(image: any) => handleUpdateFormData(image, 0)}
                  image={formData.photos[0] ? formData.photos[0].photoLocation : ''}
                />
              </View>
              <View className="flex flex-col  h-52 justify-between">
                <View className="w-[105px] h-24 rounded-xl">
                  <PickImage
                    imageLength={1}
                    imageData={(image: any) => handleUpdateFormData(image, 1)}
                    image={formData.photos[1] ? formData.photos[1].photoLocation : ''}
                  />
                </View>
                <View className="w-[105px] h-24 bg-white overflow-hidden rounded-xl">
                  <PickImage
                    imageLength={2}
                    imageData={(image: any) => handleUpdateFormData(image, 2)}
                    image={formData.photos[2] ? formData.photos[2].photoLocation : ''}
                  />
                </View>
              </View>
            </View>
            <View className="flex flex-row w-full mt-4 justify-between">
              <View className="w-[105px] h-24 bg-white overflow-hidden rounded-xl">
                <PickImage
                  imageLength={3}
                  imageData={(image: any) => handleUpdateFormData(image, 3)}
                  image={formData.photos[3] ? formData.photos[3].photoLocation : ''}
                />
              </View>
              <View className="w-[105px] h-24 bg-white overflow-hidden rounded-xl">
                <PickImage
                  imageLength={4}
                  imageData={(image: any) => handleUpdateFormData(image, 4)}
                  image={formData.photos[4] ? formData.photos[4].photoLocation : ''}
                />
              </View>
              <View className="w-[105px] h-24 bg-white overflow-hidden rounded-xl">
                <PickImage
                  imageLength={5}
                  imageData={(image: any) => handleUpdateFormData(image, 5)}
                  image={formData.photos[5] ? formData.photos[5].photoLocation : ''}
                />
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          <Text className="text-white text-lg mt-4 font-poppinsRegular">Seu Nome </Text>
          <TextInput
            className="border border-[#D356F3] w-full rounded-md p-2 text-white text-lg"
            placeholderTextColor="#B0B0B0"
            placeholder="Nome Aqui..."
            autoCapitalize="words"
            autoCorrect={true}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            value={formData.name}
          />
          <Text className="text-white text-lg mt-4 font-poppinsRegular">Seu Instagram</Text>
          <TextInput
            className="border border-[#D356F3] w-full rounded-md p-2 text-white text-lg"
            placeholderTextColor="#B0B0B0"
            placeholder="@"
            autoCapitalize="none"
            onChangeText={(text) =>
              setFormData({ ...formData, instagram: 'https://instagram.com/' + text })
            }
            value={formData.instagram.replace('https://instagram.com/', '')}
          />
          <Text className="text-white text-lg mt-4 font-poppinsRegular">Sua Bio </Text>
          <TextInput
            className="border border-[#D356F3] w-full max-h-32 rounded-md p-2 text-white text-lg"
            placeholderTextColor="#B0B0B0"
            placeholder="Descreva seu rolê em algumas linhas e mostre sua vibe."
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            value={formData.description}
            multiline
            numberOfLines={4}
          />
        </>
      )}
    </View>
  );
}
