import React, { useState } from "react";
import { useTheme } from "styled-components";
import { useNavigation, useRoute } from "@react-navigation/native";

import { BackButton } from "../../components/BackButton";
import { Calendar, DayProps, MarkedDateProps } from "../../components/Calendar";

import ArrowSvg from "../../assets/arrow.svg";

import {
  Container,
  Content,
  DateInfo,
  DateTitle,
  DateValue,
  Footer,
  Header,
  RentalPeriod,
  Title,
} from "./style";
import { Alert, StatusBar } from "react-native";
import { Button } from "../../components/Button";
import { generateInterval } from "../../components/Calendar/generateInterval";
import { format } from "date-fns";
import { getPlataformDate } from "../../utils/getPlataformDate";
import { CarDTO } from "../../dtos/CarDTO";

interface RentalPeriod {
  startFormatted: string;
  endFormatted: string;
}

interface Params {
  car: CarDTO;
}

export function Scheduling() {
  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>(
    {} as DayProps
  );
  const [markedDates, setMarketDates] = useState<MarkedDateProps>(
    {} as MarkedDateProps
  );
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>(
    {} as RentalPeriod
  );

  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const { car } = route.params as Params;

  function handleConfirmSchedule() {
    navigation.navigate("SchedulingDetails", {
      car,
      dates: Object.keys(markedDates),
    });
  }

  function handleChangeDate(date: DayProps) {
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    if (start.timestamp > end.timestamp) {
      start = end;
      end = start;
    }

    setLastSelectedDate(end);
    const interval = generateInterval(start, end);
    setMarketDates(interval);

    const firstDate = Object.keys(interval)[0];
    const endDate = Object.keys(interval)[Object.keys(interval).length - 1];

    setRentalPeriod({
      startFormatted: format(
        getPlataformDate(new Date(firstDate)),
        "dd/MM/yyyy"
      ),
      endFormatted: format(getPlataformDate(new Date(endDate)), "dd/MM/yyyy"),
    });
  }

  return (
    <Container>
      <Header>
        <StatusBar
          barStyle={"light-content"}
          translucent
          backgroundColor={"transparent"}
        />
        <BackButton onPress={() => {}} color={theme.colors.shape} />

        <Title>
          Escolha uma {"\n"}
          data de início e {"\n"}
          fim do aluguel
        </Title>

        <RentalPeriod>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue selected={!!rentalPeriod?.startFormatted}>
              {rentalPeriod?.startFormatted}
            </DateValue>
          </DateInfo>

          <ArrowSvg />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue selected={!!rentalPeriod?.endFormatted}>
              {rentalPeriod?.endFormatted}
            </DateValue>
          </DateInfo>
        </RentalPeriod>
      </Header>

      <Content>
        <Calendar markedDates={markedDates} onDayPress={handleChangeDate} />
      </Content>

      <Footer>
        <Button
          title="Confirmar"
          onPress={handleConfirmSchedule}
          enabled={!!rentalPeriod.startFormatted}
        />
      </Footer>
    </Container>
  );
}
