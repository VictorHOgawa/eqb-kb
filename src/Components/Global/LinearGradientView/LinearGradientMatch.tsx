import React, { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  children: ReactNode;
  borderTop?: number;
}

export default function GradientViewMatch({ children, borderTop = 0 }: Props) {
  return (
    <LinearGradient
      colors={["#1D0838", "#A542C4"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        borderTopLeftRadius: borderTop,
        borderTopRightRadius: borderTop,
      }}
    >
      {children}
    </LinearGradient>
  );
}
