'use client';

import {
  Button,
  Row,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@umami/react-zen';

const sides = ['top', 'right', 'bottom', 'left'] as const;

export function SheetExample() {
  return (
    <Row gap="2" wrap="wrap" justifyContent="center">
      {sides.map(side => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline" className="capitalize" />}>
            {side}
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>This sheet slides in from the {side}.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </Row>
  );
}
