import React, { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  children?: ReactNode;
  borderTop?: number;
}

export default function PurpleGradient({
  children,
  borderTop = 0,
  ...rest
}: Props) {
  return (
    <LinearGradient
      colors={["#230743", "#4D1A65"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 0 }}
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        zIndex: 20,
        borderTopLeftRadius: borderTop,
        borderTopRightRadius: borderTop,
      }} // Adiciona flex: 1 para ocupar todo o espaço disponível
    >
      {children}
    </LinearGradient>
  );
}
