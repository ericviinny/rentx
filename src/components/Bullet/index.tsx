import React from 'react';

import {
  Container
} from './style';

interface Props {
  active?: boolean;
}

export function Bullet({ active = false }: Props){
  return (
    <Container active={active} />
  );
}