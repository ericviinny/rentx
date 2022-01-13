import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { Car as ModelCar } from '../../database/models/Car';

import {
  Container,
  Details,
  Brand,
  Name,
  About,
  Rent,
  Period,
  Price,
  Type,
  CarImage,
} from './style';

interface Props extends TouchableOpacityProps {
  data: ModelCar;
}

export function Car({ data, ...rest }: Props){
  const MotorIcon = getAccessoryIcon(data.fuel_type);

  const netInfo = useNetInfo();

  return (
    <Container {...rest} activeOpacity={0.7} >
      <Details>
        <Brand>{data.brand}</Brand>
        <Name>{data.name}</Name>

        <About>
          <Rent>
            <Period>{data.period}</Period>
            <Price>{netInfo.isConnected === true ? data.price : '...'}</Price>
          </Rent>

          <Type>
            <MotorIcon />
          </Type>
        </About>
      </Details>

      <CarImage source={{ uri: data.thumbnail }} resizeMode='contain' />
    </Container>
  );
}