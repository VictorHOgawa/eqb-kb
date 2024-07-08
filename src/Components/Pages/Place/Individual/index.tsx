import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import Theme from "../../../../styles/themes";
import { Calendar } from "../../../Global/Calendar";
import { Container, Icon, Info, Left, Text } from "./styles";

interface IndividualProps {
  place: any;
}

export function Individual({ place }: IndividualProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [startHour, setStartHour] = useState<any>();
  const [endHour, setEndHour] = useState<any>();

  useEffect(() => {
    function formatTime() {
      const currentDay = parseInt(moment().format("d"));
      const currentTime = moment().format("HH:mm");

      const currentOpenTime = place.openTime.find((day: any) => {
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

    if (place) {
      formatTime();
    }
  }, [place]);
  return (
    <Container>
      <Left>
        <Info>
          <Icon
            source={require("../../../../../assets/Global/Icons/clockIcon.png")}
          />
          {isOpen ? (
            <>
              <Text>
                {""}
                <Text
                  style={{
                    fontWeight: "bold",
                    color: isOpen
                      ? `${Theme.color.next}`
                      : `${Theme.color.red_60}`,
                  }}
                >
                  {""}
                  {isOpen ? "Aberto" : "Fechado"}
                </Text>{" "}
                Das {""}
                {startHour} {""} até {""} {endHour}
              </Text>
            </>
          ) : (
            <>
              <Text
                style={{
                  fontWeight: "bold",
                  color: isOpen
                    ? `${Theme.color.next}`
                    : `${Theme.color.red_60}`,
                  width: "70%",
                }}
              >
                {""}
                Horário de Funcionamento {""} {startHour} até {""} {endHour}
              </Text>
            </>
          )}
        </Info>
        <Info>
          <Icon
            source={require("../../../../../assets/Global/Icons/pinIcon.png")}
          />
          <Text>
            {""}
            <Text style={{ fontWeight: "bold" }}>
              {place.address} {""}
            </Text>
            {""}
            {place.city.name} - {place.city.state}
          </Text>
        </Info>
      </Left>
      <Calendar date={place.date} type="place" isOpen={isOpen} />
    </Container>
  );
}
