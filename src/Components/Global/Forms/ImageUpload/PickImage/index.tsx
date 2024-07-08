import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { PostAPI } from '../../../../../utils/api';

interface Props extends TouchableOpacityProps {
  imageData: any;
  image: string;
  title?: string;
  imageLength?: number;
}

export function PickImage({
  imageData,
  imageLength,
  title,
  image,

  ...rest
}: Props) {
  const [imageLoading, setImageLoading] = useState(false);

  const pickImage = async () => {
    setImageLoading(true);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,

      quality: 1,
    });

    if (result.canceled) {
      setImageLoading(false);
    }

    if (!result.canceled) {
      connect(result);
    }
  };
  const [imageSelected, setImageSelected] = useState(false);
  async function connect(data: any) {
    let uriParts = data.assets[0].uri.split('.');
    let fileType = uriParts[uriParts.length - 1];

    let uploadFormData = new FormData();
    uploadFormData.append('file', {
      uri: data.assets[0].uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    const serverSend = await PostAPI('/upload/image', uploadFormData);
    setImageLoading(false);
    if (serverSend.status != 200) {
      return Alert.alert(serverSend.body);
    }
    setImageSelected(true);
    imageData(
      {
        photoKey: serverSend.body.key,
        photoLocation: serverSend.body.location,
      },
      imageLength
    );
  }
  const baseUrl = 'https://nightappimages.com/';
  const fullImageUrl = `${baseUrl}${image}`;
  return (
    <TouchableOpacity
      className="w-full h-full  rounded-xl  overflow-hidden flex items-center justify-center "
      {...rest}
      onPress={pickImage}
    >
      {imageLoading ? (
        <ActivityIndicator color={'#9D38CD'} size={'large'} />
      ) : !image ? (
        <View className="w-full h-full bg-white flex items-center justify-center">
          <Image
            className="w-10 h-10"
            source={require('../../../../../../assets/Global/Icons/addPhotoIcon.png')}
          />
        </View>
      ) : (
        <>
          {image && (
            <Image source={{ uri: fullImageUrl }} resizeMode="stretch" className="w-full h-full" />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
