import { Container, Date, Footer } from "./styles";
import moment from "moment";
import "moment/locale/pt-br";
import { View } from "react-native";

interface CalendarProps {
  date: Date;
  type: string | undefined;
  isOpen?: boolean;
}
export function Calendar({ date, type, isOpen }: CalendarProps) {
  return (
    <View className=" flex flex-col w-[68px] h-16 scale-[0.9] rounded-md overflow-hidden items-center bg-gray_10">
      {type === "event" ? (
        <>
          <View className="h-1/3 flex items-center w-full ">
            <Date>{moment(date).format("ddd")}</Date>
          </View>
          <View className="h-1/3 flex items-center  w-full ">
            <Date>{moment(date).format("D")}</Date>
          </View>
          <View className=" w-full flex items-center mt-auto  h-auto bg-primary_100">
            <Date type="event">{moment(date).format("MMM")}</Date>
          </View>
        </>
      ) : (
        <>
        <View className="h-1/3 flex items-center w-full ">
          <Date>{moment(date).format("ddd")}</Date>
          </View>
          <View className="h-1/3 flex items-center  w-full ">
          <Date>{moment(date).format("D")}</Date>
          </View>
          <View
            className=" w-full mt-auto 1/3 bg-secoundary_100"
          >
            <View className=" w-full flex items-center mt-auto  h-auto bg-primary_100">
            <Date type="event" isOpen={isOpen}>
              {isOpen ? "Aberto" : "Fechado"}
            </Date>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
