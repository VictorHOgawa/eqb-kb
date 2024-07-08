import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import { useCart } from "../../../../../../context/cart";
import { Checkbox } from "../../../../../Global/Checkbox";
import { LineBreak } from "../../../../../Global/LineBreak";
import { GlobalTitle } from "../../../../../Global/Title";
import { HorizontalView } from "../../../../../Global/View/HorizontalView";
import { VerticalView } from "../../../../../Global/View/VerticalView";
import {
  Counter,
  CounterArea,
  CounterText,
  Icon,
  IconButton,
  Item,
  ItemButton,
  Items,
  Map,
  TicketTitle,
  TicketType,
  Title,
} from "../../styles";

interface StepTwoProps {
  product: {
    name: string;
    value: number;
    id: string;
    type: string;
    photo_location: string;
  }[];
  type: string;
  setType: any;
}
export function StepTwo({ product, type, setType }: StepTwoProps) {
  const [filteredProduct, setFilteredProduct] = useState<any>([]);
  const { cart, add } = useCart();
  const [moreProducts, setMoreProducts] = useState(true);
  const [checked, setChecked] = useState(false);
  function handleSelectType(type: string) {
    setFilteredProduct(product.filter((item) => item.type === type));
    setType(type);
  }

  const handleChange = (
    type: string,
    product: { name: string; value: number; id: string }
  ) => {
    const exists = cart.product.find(
      (item: { id: string }) => item.id === product.id
    );
    const products = cart.product.filter(
      (item: { id: string }) => item.id !== product.id
    );
    if (type === "increase") {
      const quantity = exists ? exists.quantity + 1 : 1;

      return add([...products, { ...product, quantity }], "product");
    }
    if (type === "decrease" && exists && exists.quantity > 1) {
      const quantity = exists.quantity - 1;
      return add([...products, { ...product, quantity }], "product");
    } else {
      return add(products, "product");
    }
  };

  function ticketQuantity(id: string) {
    const ticketExists = cart.product.find(
      (ticket: { id: string }) => ticket.id === id
    );
    return ticketExists ? ticketExists.quantity : 0;
  }

  function handleTitle(type: string) {
    switch (type) {
      case "COMBO":
        return "Combo";

      case "VODKA":
        return "Vodka";

      case "WHISKEY":
        return "Whiskey";

      case "BEER":
        return "Cerveja";

      case "ENERGÉTICOS":
        return "Energéticos";

      case "OUTROS":
        return "Outros";
      default:
        "";
    }
  }

  return (
    <>
      <GlobalTitle title="Produtos" />
      {type === "" ? (
        <>
          <Items>
            {product.filter((item) => item.type === "VODKA").length > 0 ? (
              <ItemButton onPress={() => handleSelectType("VODKA")}>
                <Item
                  source={require("../../../../../../../assets/Event/Item1.png")}
                />
              </ItemButton>
            ) : (
              <></>
            )}
            {product.filter((item) => item.type === "WHISKEY").length > 0 ? (
              <ItemButton onPress={() => handleSelectType("WHISKEY")}>
                <Item
                  source={require("../../../../../../../assets/Event/Item2.png")}
                />
              </ItemButton>
            ) : (
              <></>
            )}
            {product.filter((item) => item.type === "BEER").length > 0 ? (
              <ItemButton onPress={() => handleSelectType("BEER")}>
                <Item
                  source={require("../../../../../../../assets/Event/Item3.png")}
                />
              </ItemButton>
            ) : (
              <></>
            )}
            <LineBreak />
            {product.filter((item) => item.type === "COMBO").length > 0 ? (
              <ItemButton onPress={() => handleSelectType("COMBO")}>
                <Item
                  source={require("../../../../../../../assets/Event/Item4.png")}
                />
              </ItemButton>
            ) : (
              <></>
            )}
            {product.filter((item) => item.type === "ENERGETIC").length > 0 ? (
              <ItemButton onPress={() => handleSelectType("ENERGETIC")}>
                <Item
                  source={require("../../../../../../../assets/Event/Item5.png")}
                />
              </ItemButton>
            ) : (
              <></>
            )}
            {product.filter((item) => item.type === "OTHERS").length > 0 ? (
              <ItemButton onPress={() => handleSelectType("OTHERS")}>
                <Item
                  source={require("../../../../../../../assets/Event/Item6.png")}
                />
              </ItemButton>
            ) : (
              <></>
            )}
          </Items>
          <HorizontalView>
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => setChecked(!checked)}
            >
              <Checkbox
                checked={checked}
                onPress={() => setChecked(!checked)}
              />
              <Title>{""} Não quero comprar Produtos</Title>
            </TouchableOpacity>
          </HorizontalView>
        </>
      ) : (
        <>
          <Title style={{ fontSize: RFValue(20) }}>
            {handleTitle(filteredProduct[0].type)}
          </Title>
          <Map
            data={filteredProduct}
            renderItem={({ item }) =>
              filteredProduct.length === 0 ? (
                <></>
              ) : (
                <>
                  <VerticalView>
                    <TicketType
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      colors={["#8F00FF", "#DD7CFF"]}
                    >
                      <Item source={{ uri: item.photo_location }} />
                      <VerticalView style={{ width: "45%" }}>
                        <TicketTitle style={{ fontWeight: "bold" }}>
                          {item.name}
                        </TicketTitle>
                        <TicketTitle>
                          {item.value.toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TicketTitle>
                      </VerticalView>
                      <CounterArea>
                        <IconButton
                          onPress={() => handleChange("decrease", item)}
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
                        >
                          <Icon
                            source={require("../../../../../../../assets/Event/Plus.png")}
                          />
                        </IconButton>
                      </CounterArea>
                    </TicketType>
                  </VerticalView>
                </>
              )
            }
          />
        </>
      )}
    </>
  );
}
