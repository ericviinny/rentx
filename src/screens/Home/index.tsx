import React, { useEffect, useState } from "react";

import { StatusBar, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import { synchronize } from "@nozbe/watermelondb/sync";
import { useNetInfo } from "@react-native-community/netinfo";
// import { Ionicons } from "@expo/vector-icons";

// import Animated, {
//   useAnimatedGestureHandler,
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
// } from "react-native-reanimated";

// import { RectButton, PanGestureHandler } from "react-native-gesture-handler";

// const ButtonAnimated = Animated.createAnimatedComponent(RectButton);

import api from "../../services/api";

import Logo from "../../assets/logo.svg";

import { Container, Header, TotalCars, HeaderContent, CarList } from "./style";

import { Car } from "../../components/Car";
import { LoadAnimation } from "../../components/LoadAnimation";

import { database } from "../../database";
import { Car as ModelCar } from '../../database/models/Car';

export function Home() {
  const [cars, setCars] = useState<ModelCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // const positionY = useSharedValue(0);
  // const positionX = useSharedValue(0);

  // const myCarsButtonStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       { translateX: positionX.value },
  //       { translateY: positionY.value },
  //     ],
  //   };
  // });

  // const onGestureEvent = useAnimatedGestureHandler({
  //   onStart(_, ctx: any) {
  //     ctx.positionX = positionX.value;
  //     ctx.positionY = positionY.value;
  //   },
  //   onActive(event, ctx: any) {
  //     positionX.value = ctx.positionX + event.translationX;
  //     positionY.value = ctx.positionY + event.translationY;
  //   },
  //   onEnd() {
  //     positionX.value = withSpring(0);
  //     positionY.value = withSpring(0);
  //   }
  // })

  const netInfo = useNetInfo();
  const navigation = useNavigation();
  // const theme = useTheme();

  function handleCarDetails(car: ModelCar) {
    navigation.navigate("CarDetails", { car });
  }

  async function offlineSynchronize() {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {

        const { data } = await api.get(
          `cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`
        );

        const { changes, latestVersion } = data; //response.data
        return { changes, timestamp: latestVersion }

      },
      pushChanges: async ({ changes }) => {
        const user = changes.users;
        if (user.updated.length > 0) {
          await api.post('/users/sync', user);
        }
      },
    });
  }

  // function handleOpenMyCars() {
  //   navigation.navigate("MyCars");
  // }

  useEffect(() => {
    let isMounted = true;

    async function fetchCars() {
      try {
        const carCollection = database.get<ModelCar>('cars');
        const cars = await carCollection.query().fetch();

        if (isMounted) {
          setCars(cars);
        }
      } catch (error) {
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchCars();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (netInfo.isConnected === true) {
      offlineSynchronize();
    }
  }, [netInfo.isConnected]);

  return (
    <Container>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={"transparent"}
        translucent
      />
      <Header>
        <HeaderContent>
          <Logo width={RFValue(108)} height={RFValue(12)} />
          <TotalCars>{!isLoading && `Total ${cars.length} carros`}</TotalCars>
        </HeaderContent>
      </Header>
      {isLoading ? (
        <LoadAnimation />
      ) : (
        <CarList
          data={cars}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Car data={item} onPress={() => handleCarDetails(item)} />
          )}
        />
      )}

      {/* <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View
          style={[
            myCarsButtonStyle,
            {
              position: "absolute",
              bottom: 13,
              right: 22,
            },
          ]}
        >
          <ButtonAnimated
            onPress={handleOpenMyCars}
            style={[styles.button, { backgroundColor: theme.colors.main }]}
          >
            <Ionicons
              name="ios-car-sport"
              size={32}
              color={theme.colors.shape}
            />
          </ButtonAnimated>
        </Animated.View>
      </PanGestureHandler> */}
    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
