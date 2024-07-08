import { useEffect, useState } from "react";
import { useCart } from "../../../../../../context/cart";
import { GlobalTitle } from "../../../../../Global/Title";
import { VerticalView } from "../../../../../Global/View/VerticalView";
import {
  Counter,
  CounterArea,
  CounterText,
  Icon,
  IconButton,
  Map,
  TicketTitle,
  TicketType,
} from "../../styles";

interface StepOneProps {
  ticketSlots: {
    name: string;
    id: string;
    ticket: {
      ticket: any;
      id: string;
      name: string;
      value: number;
    }[];
  };
}

export function StepOne({ ticketSlots }: StepOneProps) {
  const { cart, add } = useCart();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const handleChange = (
    type: string,
    ticket: { name: string; value: number; id: string }
  ) => {
    setLoading(true);
    setLoading1(true);
    const exists = cart.ticket.ticket.find(
      (item: { id: string }) => item.id === ticket.id
    );
    const tickets = cart.ticket.ticket.filter(
      (item: { id: string }) => item.id !== ticket.id
    );

    if (type === "increase") {
      const quantity = exists ? exists.quantity + 1 : 1;

      add(
        {
          slotId: ticketSlots.id,
          ticket: [...tickets, { ...ticket, quantity }],
        },
        "ticket"
      );
      setLoading(false);
      return setLoading1(false);
    }
    if (type === "decrease" && exists && exists.quantity > 1) {
      const quantity = exists.quantity - 1;
      add(
        {
          slotId: ticketSlots.id,
          ticket: [...tickets, { ...ticket, quantity }],
        },
        "ticket"
      );
      setLoading(false);
      return setLoading1(false);
    } else {
      add({ slotId: ticketSlots.id, ticket: tickets }, "ticket");
      setLoading(false);
      return setLoading1(false);
    }
  };

  useEffect(() => {}, [ticketSlots]);

  function ticketQuantity(id: string) {
    const ticketExists = cart.ticket.ticket.find(
      (ticket: { id: string }) => ticket.id === id
    );
    return ticketExists ? ticketExists.quantity : 0;
  }
  return (
    <>
      <GlobalTitle title={ticketSlots.name} />
      <Map
        data={ticketSlots.ticket}
        renderItem={({ item }) => (
          <>
            {item.length === 0 ? (
              <></>
            ) : (
              <TicketType
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={["#8F00FF", "#DD7CFF"]}
              >
                <Icon
                  source={require("../../../../../../../assets/Event/Ticket.png")}
                  style={{ width: 40, height: 40 }}
                />
                <VerticalView style={{ width: "45%" }}>
                  <TicketTitle
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {item.name}
                  </TicketTitle>
                  <TicketTitle>
                    {item.value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TicketTitle>
                </VerticalView>
                <CounterArea>
                  <IconButton
                    onPress={() => handleChange("decrease", item)}
                    disabled={loading}
                  >
                    <Icon
                      source={require("../../../../../../../assets/Event/Minus.png")}
                    />
                  </IconButton>
                  <Counter>
                    <CounterText>{ticketQuantity(item.id)}</CounterText>
                  </Counter>
                  <IconButton
                    onPress={() => handleChange("increase", item)}
                    disabled={loading1}
                  >
                    <Icon
                      source={require("../../../../../../../assets/Event/Plus.png")}
                    />
                  </IconButton>
                </CounterArea>
              </TicketType>
            )}
          </>
        )}
      />
    </>
  );
}
