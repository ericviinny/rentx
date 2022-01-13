import React from "react";
import { ActivityIndicator } from "react-native";
import {
  GestureHandlerRootView,
  RectButtonProps,
} from "react-native-gesture-handler";
import { useTheme } from "styled-components";

import { Container, Title } from "./style";

interface Props extends RectButtonProps {
  title: string;
  color?: string;
  loading?: boolean;
  light?: boolean;
}

export function Button({
  title,
  color,
  enabled = true,
  loading = false,
  light = false,
  ...rest
}: Props) {
  const theme = useTheme();

  return (
    <GestureHandlerRootView>
      <Container
        {...rest}
        color={color}
        enabled={enabled}
        style={{ opacity: enabled === false || loading === true ? 0.5 : 1 }}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.shape} />
        ) : (
          <Title light={light}>{title}</Title>
        )}
      </Container>
    </GestureHandlerRootView>
  );
}
