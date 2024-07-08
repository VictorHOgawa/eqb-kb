import React, { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  children: ReactNode;
  borderTop?: number;
}

export default function TicketGradient() {
  return (
    <LinearGradient
      colors={["#8F00FF", "#DD7CFF"]}
      start={{ x: 0, y: 0 }} // Começa no topo esquerdo
      end={{ x: 1, y: 1 }} // Termina no canto inferior direito
      style={{
        position: "absolute",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    ></LinearGradient>
  );
}
