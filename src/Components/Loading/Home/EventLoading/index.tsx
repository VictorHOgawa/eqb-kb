import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import Theme from "../../../../styles/themes";
import { Container, EventCard, EventImage, Title } from "./styles";

export function EventLoading({ loading, children }: any): any {
  const opacity = useRef(new Animated.Value(0.3));

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity.current, {
            toValue: 1,
            useNativeDriver: true,
            duration: 500,
          }),
          Animated.timing(opacity.current, {
            toValue: 0.3,
            useNativeDriver: true,
            duration: 800,
          }),
        ])
      ).start();
    }

    if (!loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity.current, {
            toValue: 1,
            useNativeDriver: true,
            duration: 500,
          }),
          Animated.timing(opacity.current, {
            toValue: 0.3,
            useNativeDriver: true,
            duration: 800,
          }),
        ])
      ).stop();
    }
  }, [opacity, loading]);

  if (loading) {
    return (
      <Container>
        <EventCard>
          <EventImage>
            <Animated.View
              style={[
                {
                  width: "100%",
                  height: "100%",
                  opacity: opacity.current,
                  backgroundColor: Theme.color.primaryFadePlus,
                },
              ]}
            />
          </EventImage>
          <Title>
            <Animated.View
              style={[
                {
                  width: "100%",
                  height: "100%",
                  opacity: opacity.current,
                  backgroundColor: Theme.color.primaryFadePlus,
                },
              ]}
            />
          </Title>
          <Title style={{ width: RFValue(180) }}>
            <Animated.View
              style={[
                {
                  width: "100%",
                  height: "100%",
                  opacity: opacity.current,
                  backgroundColor: Theme.color.primaryFadePlus,
                },
              ]}
            />
          </Title>
        </EventCard>
        <EventCard>
          <EventImage>
            <Animated.View
              style={[
                {
                  width: "100%",
                  height: "100%",
                  opacity: opacity.current,
                  backgroundColor: Theme.color.primaryFadePlus,
                },
              ]}
            />
          </EventImage>
          <Title>
            <Animated.View
              style={[
                {
                  width: "100%",
                  height: "100%",
                  opacity: opacity.current,
                  backgroundColor: Theme.color.primaryFadePlus,
                },
              ]}
            />
          </Title>
          <Title>
            <Animated.View
              style={[
                {
                  width: "100%",
                  height: "100%",
                  opacity: opacity.current,
                  backgroundColor: Theme.color.primaryFadePlus,
                },
              ]}
            />
          </Title>
        </EventCard>
      </Container>
    );
  }

  if (!loading) {
    return <>{children}</>;
  }
}
