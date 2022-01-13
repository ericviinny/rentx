import React from "react";
import AnimatedLottieView from "lottie-react-native";

import loadingCar from "../../assets/load_car.json";

import { Container } from "./style";

export function LoadAnimation() {
  return (
    <Container>
      <AnimatedLottieView
        source={loadingCar}
        autoPlay
        resizeMode="contain"
        style={{ height: 200 }}
        loop
      />
    </Container>
  );
}
