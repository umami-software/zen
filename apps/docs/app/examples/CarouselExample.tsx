'use client';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Column,
  Row,
  Text,
} from '@umami/react-zen';
import { useEffect, useState } from 'react';

function Slide({ index }: { index: number }) {
  return (
    <Row
      alignItems="center"
      justifyContent="center"
      border
      borderRadius="lg"
      backgroundColor="muted"
      className="aspect-square text-4xl font-semibold"
    >
      {index + 1}
    </Row>
  );
}

export function CarouselSizesExample() {
  return (
    <Carousel className="w-full max-w-sm">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2 lg:basis-1/3">
            <Slide index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export function CarouselApiExample() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <Column alignItems="center" gap="2" className="w-full max-w-xs">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <Slide index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <Text size="sm" color="muted-foreground">
        Slide {current} of {count}
      </Text>
    </Column>
  );
}
