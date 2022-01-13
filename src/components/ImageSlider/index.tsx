import React, { useRef, useState } from "react";
import { FlatList, ViewToken } from "react-native";
import { Bullet } from "../Bullet";

import {
  CarImage,
  CarImageWrapper,
  Container,
  ImageIndexes,
} from "./style";

interface Props {
  imagesUrl: {
    id: string;
    photo: string;
  }[]
}

interface ChangeImageProps {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

export function ImageSlider({ imagesUrl }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);

  const indexChanged = useRef((info: ChangeImageProps) => {
    const index = info.viewableItems[0].index!;
   setSelectedImage(index) 
  });

  return (
    <Container>
      <ImageIndexes>
        {imagesUrl.map((item, i) => (
          <Bullet active={i === selectedImage} key={item.id} />
        ))}
      </ImageIndexes>

      <FlatList
        data={imagesUrl}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarImageWrapper>
            <CarImage source={{ uri: item.photo }} resizeMode={"contain"} />
          </CarImageWrapper>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        pagingEnabled
        onViewableItemsChanged={indexChanged.current}
      />
    </Container>
  );
}
