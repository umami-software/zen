import type { SVGProps } from 'react';

const SvgEye = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
    <path fill="none" d="M0 0h256v256H0z" />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={16}
      d="M128 56c-80 0-112 72-112 72s32 72 112 72 112-72 112-72-32-72-112-72"
    />
    <circle
      cx={128}
      cy={128}
      r={40}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={16}
    />
  </svg>
);
export default SvgEye;
