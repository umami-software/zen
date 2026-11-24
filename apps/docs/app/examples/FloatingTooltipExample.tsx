import { Box, FloatingTooltip, Text } from '@umami/react-zen';
import { useState } from 'react';

export function FloatingTooltipExample() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Box
        backgroundColor="muted"
        borderRadius
        width="400px"
        height="300px"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      />
      <FloatingTooltip open={show}>
        <Text color="background">Hello</Text>
      </FloatingTooltip>
    </>
  );
}
