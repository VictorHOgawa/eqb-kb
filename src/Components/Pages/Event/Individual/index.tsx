import moment from "moment";
import "moment/locale/pt-br";
import { Calendar } from "../../../Global/Calendar";
import { Container, Icon, Info, Left, Text } from "./styles";
import { LineBreak } from "../../../Global/LineBreak";

interface IndividualProps {
  date: Date;
  local: string;
  city: string;
  state: string;
  time: string;
}

export function Individual({
  date,
  local,
  city,
  state,
  time,
}: IndividualProps) {
  return (
    <Container>
      <Left>
        <Info>
          <Icon
            source={require("../../../../../assets/Global/Icons/clockIcon.png")}
          />
          <Text>
            {""}
            <Text style={{ fontWeight: "bold" }}>
              {""}
              {moment(date).format("LL")}
            </Text>{" "}
            às {""}
            {time}
          </Text>
        </Info>
        <Info>
          <Icon
            source={require("../../../../../assets/Global/Icons/pinIcon.png")}
          />
          <Text>
            {""}
            <Text style={{ fontWeight: "bold" }}>
              {local} {""}
              <LineBreak />
            </Text>
            {"\n"}
            {""}
            {city} - {state}
          </Text>
        </Info>
      </Left>
      <Calendar date={date} type="event" />
    </Container>
  );
}
