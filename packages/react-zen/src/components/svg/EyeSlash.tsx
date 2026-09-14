import type { SVGProps } from 'react';

const SvgEyeSlash = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
    <path fill="none" d="M0 0h256v256H0z" />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={16}
      d="m48 40 160 176M154.91 157.6a40 40 0 0 1-53.82-59.2M135.53 88.71a40 40 0 0 1 32.3 35.53"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={16}
      d="M208.61 169.1C230.41 149.58 240 128 240 128s-32-72-112-72a126 126 0 0 0-20.68 1.68M74 68.6C33.23 89.24 16 128 16 128s32 72 112 72a118.05 118.05 0 0 0 54-12.6"
    />
  </svg>
);
export default SvgEyeSlash;
