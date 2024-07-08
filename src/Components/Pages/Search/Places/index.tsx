import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import DropShadow from "react-native-drop-shadow";
import { RFValue } from "react-native-responsive-fontsize";
import { Calendar } from "../../../Global/Calendar";
import {
  Button,
  City,
  Container,
  DetailsContainer,
  Image,
  TextContainer,
  Title,
} from "./styles";

interface PlaceProps {
  photo?: string;
  name?: string;
  id?: string;
  onPress?: any;
  city?: any;
  openTime?: any;
  address?: string;
}
export function SearchPlaceCard({
  photo,
  name,
  id,
  onPress,
  city,
  openTime,
  address,
  ...rest
}: PlaceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startHour, setStartHour] = useState<any>();
  const [endHour, setEndHour] = useState<any>();
  useEffect(() => {
    function formatTime() {
      const currentDay = parseInt(moment().format("d"));
      const currentTime = moment().format("HH:mm");

      const currentOpenTime = openTime.find((day: any) => {
        return day.day === currentDay;
      });

      if (currentOpenTime) {
        if (
          moment(currentTime, "HH:mm").isSameOrAfter(
            moment(currentOpenTime.open_time, "HH:mm")
          ) &&
          moment(currentTime, "HH:mm").isSameOrBefore(
            moment(currentOpenTime.close_time, "HH:mm")
          )
        ) {
          setIsOpen(true);
        }
        setStartHour(currentOpenTime.open_time);
        setEndHour(currentOpenTime.close_time);
      }
    }

    if (openTime) {
      formatTime();
    }
  }, [openTime]);

  return (
    <Button {...rest} onPress={onPress}>
      {Platform.OS === "ios" ? (
        <DropShadow
          style={{
            zIndex: 0,
            shadowColor: "#9D38CD",
            shadowOffset: {
              width: 2,
              height: 2,
            },
            shadowOpacity: 0.7,
            shadowRadius: 5,
          }}
        >
          <Container
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
            colors={["rgba(41, 0, 80, 0.95)", "#9D38CD"]}
          >
            <View>
              <Image source={{ uri: photo }} />
            </View>
            <Title>{name}</Title>
            <DetailsContainer>
              <TextContainer>
                <City style={{ fontSize: RFValue(12) }}>{address}</City>
                <City>
                  {city.name} - {city.state}
                </City>
              </TextContainer>
              <Calendar date={openTime.date} type="place" isOpen={isOpen} />
            </DetailsContainer>
          </Container>
        </DropShadow>
      ) : (
        <Container
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          colors={["rgba(41, 0, 80, 0.95)", "#9D38CD"]}
        >
          <View>
            <Image source={{ uri: photo }} />
          </View>
          <Title>{name}</Title>
          <DetailsContainer>
            <TextContainer>
              <City>{address}</City>
              <City>
                {city.name} - {city.state}
              </City>
            </TextContainer>
            <Calendar date={openTime.date} type="place" isOpen={isOpen} />
          </DetailsContainer>
        </Container>
      )}
    </Button>
  );
}
