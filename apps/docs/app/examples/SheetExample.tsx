'use client';

import { Button, DialogTrigger, Row, Sheet, SheetHeader, Text } from '@umami/react-zen';

const sides = ['left', 'right', 'top', 'bottom'] as const;

export function SheetExample() {
  return (
    <Row gap wrap="wrap" justifyContent="center">
      {sides.map(side => (
        <DialogTrigger key={side}>
          <Button variant="outline">{side.charAt(0).toUpperCase() + side.slice(1)}</Button>
          <Sheet side={side}>
            <SheetHeader title="Settings" />
            <Text>Sheet content slides in from the {side}.</Text>
          </Sheet>
        </DialogTrigger>
      ))}
    </Row>
  );
}
