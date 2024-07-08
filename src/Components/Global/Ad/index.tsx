import { Dimensions, FlatList, Image, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useState } from 'react';

export function Ad() {
  const Ads = [
    {
      image: require('../../../../assets/Global/2.png'),
    },
    {
      image: require('../../../../assets/Global/3.png'),
    },
    {
      image: require('../../../../assets/Global/4.png'),
    },
    {
      image: require('../../../../assets/Global/5.png'),
    },
    {
      image: require('../../../../assets/Global/6.png'),
    },
    {
      image: require('../../../../assets/Global/7.png'),
    },
  ];
  const width = Dimensions.get('window').width;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View className="flex flex-col items-center  ">
      <Carousel
        loop
        width={width}
        onSnapToItem={(index) => setActiveIndex(index)}
        height={130}
        autoPlay={true}
        data={Ads}
        autoPlayInterval={3000}
        scrollAnimationDuration={1000}
        renderItem={({ item, index }) => (
          <View className=" w-full h-full overflow-hidden self-center ">
            <Image className="h-full w-full object-cover" source={item.image} />
          </View>
        )}
      />
      <View className=" w-20 self-center  justify-between flex flex-row  items-center ">
        {Ads.map((ad, index) => (
          <View
            className={` mt-1 rounded-full border-[1px] border-[#D356F3] ${
              activeIndex === index ? 'w-2 h-2 bg-[#420A89] ' : 'w-1 h-1 '
            } 0`}
          ></View>
        ))}
      </View>
    </View>
  );
}
