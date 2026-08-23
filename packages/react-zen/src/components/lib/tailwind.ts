import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Breakpoint prefixes - aligned with Tailwind 4 defaults
type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

// Padding maps - explicit class names for Tailwind JIT detection
const paddingMap: Record<string, string> = {
  '0': 'p-0',
  px: 'p-px',
  '0.5': 'p-0.5',
  '1': 'p-1',
  '1.5': 'p-1.5',
  '2': 'p-2',
  '2.5': 'p-2.5',
  '3': 'p-3',
  '3.5': 'p-3.5',
  '4': 'p-4',
  '5': 'p-5',
  '6': 'p-6',
  '7': 'p-7',
  '8': 'p-8',
  '9': 'p-9',
  '10': 'p-10',
  '11': 'p-11',
  '12': 'p-12',
  '14': 'p-14',
  '16': 'p-16',
  '20': 'p-20',
  '24': 'p-24',
  '28': 'p-28',
  '32': 'p-32',
  '36': 'p-36',
  '40': 'p-40',
  '44': 'p-44',
  '48': 'p-48',
  '52': 'p-52',
  '56': 'p-56',
  '60': 'p-60',
  '64': 'p-64',
  '72': 'p-72',
  '80': 'p-80',
  '96': 'p-96',
  true: 'px-[var(--padding-x-default)] py-[var(--padding-y-default)]',
};
const pxMap: Record<string, string> = {
  '0': 'px-0',
  px: 'px-px',
  '0.5': 'px-0.5',
  '1': 'px-1',
  '1.5': 'px-1.5',
  '2': 'px-2',
  '2.5': 'px-2.5',
  '3': 'px-3',
  '3.5': 'px-3.5',
  '4': 'px-4',
  '5': 'px-5',
  '6': 'px-6',
  '7': 'px-7',
  '8': 'px-8',
  '9': 'px-9',
  '10': 'px-10',
  '11': 'px-11',
  '12': 'px-12',
  '14': 'px-14',
  '16': 'px-16',
  '20': 'px-20',
  '24': 'px-24',
  '28': 'px-28',
  '32': 'px-32',
  '36': 'px-36',
  '40': 'px-40',
  '44': 'px-44',
  '48': 'px-48',
  '52': 'px-52',
  '56': 'px-56',
  '60': 'px-60',
  '64': 'px-64',
  '72': 'px-72',
  '80': 'px-80',
  '96': 'px-96',
  true: 'px-[var(--padding-x-default)]',
};
const pyMap: Record<string, string> = {
  '0': 'py-0',
  px: 'py-px',
  '0.5': 'py-0.5',
  '1': 'py-1',
  '1.5': 'py-1.5',
  '2': 'py-2',
  '2.5': 'py-2.5',
  '3': 'py-3',
  '3.5': 'py-3.5',
  '4': 'py-4',
  '5': 'py-5',
  '6': 'py-6',
  '7': 'py-7',
  '8': 'py-8',
  '9': 'py-9',
  '10': 'py-10',
  '11': 'py-11',
  '12': 'py-12',
  '14': 'py-14',
  '16': 'py-16',
  '20': 'py-20',
  '24': 'py-24',
  '28': 'py-28',
  '32': 'py-32',
  '36': 'py-36',
  '40': 'py-40',
  '44': 'py-44',
  '48': 'py-48',
  '52': 'py-52',
  '56': 'py-56',
  '60': 'py-60',
  '64': 'py-64',
  '72': 'py-72',
  '80': 'py-80',
  '96': 'py-96',
  true: 'py-[var(--padding-y-default)]',
};
const ptMap: Record<string, string> = {
  '0': 'pt-0',
  px: 'pt-px',
  '0.5': 'pt-0.5',
  '1': 'pt-1',
  '1.5': 'pt-1.5',
  '2': 'pt-2',
  '2.5': 'pt-2.5',
  '3': 'pt-3',
  '3.5': 'pt-3.5',
  '4': 'pt-4',
  '5': 'pt-5',
  '6': 'pt-6',
  '7': 'pt-7',
  '8': 'pt-8',
  '9': 'pt-9',
  '10': 'pt-10',
  '11': 'pt-11',
  '12': 'pt-12',
  '14': 'pt-14',
  '16': 'pt-16',
  '20': 'pt-20',
  '24': 'pt-24',
  '28': 'pt-28',
  '32': 'pt-32',
  '36': 'pt-36',
  '40': 'pt-40',
  '44': 'pt-44',
  '48': 'pt-48',
  '52': 'pt-52',
  '56': 'pt-56',
  '60': 'pt-60',
  '64': 'pt-64',
  '72': 'pt-72',
  '80': 'pt-80',
  '96': 'pt-96',
};
const prMap: Record<string, string> = {
  '0': 'pr-0',
  px: 'pr-px',
  '0.5': 'pr-0.5',
  '1': 'pr-1',
  '1.5': 'pr-1.5',
  '2': 'pr-2',
  '2.5': 'pr-2.5',
  '3': 'pr-3',
  '3.5': 'pr-3.5',
  '4': 'pr-4',
  '5': 'pr-5',
  '6': 'pr-6',
  '7': 'pr-7',
  '8': 'pr-8',
  '9': 'pr-9',
  '10': 'pr-10',
  '11': 'pr-11',
  '12': 'pr-12',
  '14': 'pr-14',
  '16': 'pr-16',
  '20': 'pr-20',
  '24': 'pr-24',
  '28': 'pr-28',
  '32': 'pr-32',
  '36': 'pr-36',
  '40': 'pr-40',
  '44': 'pr-44',
  '48': 'pr-48',
  '52': 'pr-52',
  '56': 'pr-56',
  '60': 'pr-60',
  '64': 'pr-64',
  '72': 'pr-72',
  '80': 'pr-80',
  '96': 'pr-96',
};
const pbMap: Record<string, string> = {
  '0': 'pb-0',
  px: 'pb-px',
  '0.5': 'pb-0.5',
  '1': 'pb-1',
  '1.5': 'pb-1.5',
  '2': 'pb-2',
  '2.5': 'pb-2.5',
  '3': 'pb-3',
  '3.5': 'pb-3.5',
  '4': 'pb-4',
  '5': 'pb-5',
  '6': 'pb-6',
  '7': 'pb-7',
  '8': 'pb-8',
  '9': 'pb-9',
  '10': 'pb-10',
  '11': 'pb-11',
  '12': 'pb-12',
  '14': 'pb-14',
  '16': 'pb-16',
  '20': 'pb-20',
  '24': 'pb-24',
  '28': 'pb-28',
  '32': 'pb-32',
  '36': 'pb-36',
  '40': 'pb-40',
  '44': 'pb-44',
  '48': 'pb-48',
  '52': 'pb-52',
  '56': 'pb-56',
  '60': 'pb-60',
  '64': 'pb-64',
  '72': 'pb-72',
  '80': 'pb-80',
  '96': 'pb-96',
};
const plMap: Record<string, string> = {
  '0': 'pl-0',
  px: 'pl-px',
  '0.5': 'pl-0.5',
  '1': 'pl-1',
  '1.5': 'pl-1.5',
  '2': 'pl-2',
  '2.5': 'pl-2.5',
  '3': 'pl-3',
  '3.5': 'pl-3.5',
  '4': 'pl-4',
  '5': 'pl-5',
  '6': 'pl-6',
  '7': 'pl-7',
  '8': 'pl-8',
  '9': 'pl-9',
  '10': 'pl-10',
  '11': 'pl-11',
  '12': 'pl-12',
  '14': 'pl-14',
  '16': 'pl-16',
  '20': 'pl-20',
  '24': 'pl-24',
  '28': 'pl-28',
  '32': 'pl-32',
  '36': 'pl-36',
  '40': 'pl-40',
  '44': 'pl-44',
  '48': 'pl-48',
  '52': 'pl-52',
  '56': 'pl-56',
  '60': 'pl-60',
  '64': 'pl-64',
  '72': 'pl-72',
  '80': 'pl-80',
  '96': 'pl-96',
};

// Margin maps
const marginMap: Record<string, string> = {
  auto: 'm-auto',
  '0': 'm-0',
  px: 'm-px',
  '0.5': 'm-0.5',
  '1': 'm-1',
  '1.5': 'm-1.5',
  '2': 'm-2',
  '2.5': 'm-2.5',
  '3': 'm-3',
  '3.5': 'm-3.5',
  '4': 'm-4',
  '5': 'm-5',
  '6': 'm-6',
  '7': 'm-7',
  '8': 'm-8',
  '9': 'm-9',
  '10': 'm-10',
  '11': 'm-11',
  '12': 'm-12',
  '14': 'm-14',
  '16': 'm-16',
  '20': 'm-20',
  '24': 'm-24',
  '28': 'm-28',
  '32': 'm-32',
  '36': 'm-36',
  '40': 'm-40',
  '44': 'm-44',
  '48': 'm-48',
  '52': 'm-52',
  '56': 'm-56',
  '60': 'm-60',
  '64': 'm-64',
  '72': 'm-72',
  '80': 'm-80',
  '96': 'm-96',
  '-px': '-m-px',
  '-0.5': '-m-0.5',
  '-1': '-m-1',
  '-1.5': '-m-1.5',
  '-2': '-m-2',
  '-2.5': '-m-2.5',
  '-3': '-m-3',
  '-3.5': '-m-3.5',
  '-4': '-m-4',
  '-5': '-m-5',
  '-6': '-m-6',
  '-7': '-m-7',
  '-8': '-m-8',
  '-9': '-m-9',
  '-10': '-m-10',
  '-11': '-m-11',
  '-12': '-m-12',
  '-14': '-m-14',
  '-16': '-m-16',
  '-20': '-m-20',
  '-24': '-m-24',
};
const mxMap: Record<string, string> = {
  auto: 'mx-auto',
  '0': 'mx-0',
  px: 'mx-px',
  '0.5': 'mx-0.5',
  '1': 'mx-1',
  '1.5': 'mx-1.5',
  '2': 'mx-2',
  '2.5': 'mx-2.5',
  '3': 'mx-3',
  '3.5': 'mx-3.5',
  '4': 'mx-4',
  '5': 'mx-5',
  '6': 'mx-6',
  '7': 'mx-7',
  '8': 'mx-8',
  '9': 'mx-9',
  '10': 'mx-10',
  '11': 'mx-11',
  '12': 'mx-12',
  '14': 'mx-14',
  '16': 'mx-16',
  '20': 'mx-20',
  '24': 'mx-24',
  '28': 'mx-28',
  '32': 'mx-32',
  '36': 'mx-36',
  '40': 'mx-40',
  '-px': '-mx-px',
  '-0.5': '-mx-0.5',
  '-1': '-mx-1',
  '-1.5': '-mx-1.5',
  '-2': '-mx-2',
  '-2.5': '-mx-2.5',
  '-3': '-mx-3',
  '-3.5': '-mx-3.5',
  '-4': '-mx-4',
};
const myMap: Record<string, string> = {
  auto: 'my-auto',
  '0': 'my-0',
  px: 'my-px',
  '0.5': 'my-0.5',
  '1': 'my-1',
  '1.5': 'my-1.5',
  '2': 'my-2',
  '2.5': 'my-2.5',
  '3': 'my-3',
  '3.5': 'my-3.5',
  '4': 'my-4',
  '5': 'my-5',
  '6': 'my-6',
  '7': 'my-7',
  '8': 'my-8',
  '9': 'my-9',
  '10': 'my-10',
  '11': 'my-11',
  '12': 'my-12',
  '14': 'my-14',
  '16': 'my-16',
  '20': 'my-20',
  '24': 'my-24',
  '28': 'my-28',
  '32': 'my-32',
  '36': 'my-36',
  '40': 'my-40',
  '-px': '-my-px',
  '-0.5': '-my-0.5',
  '-1': '-my-1',
  '-1.5': '-my-1.5',
  '-2': '-my-2',
  '-2.5': '-my-2.5',
  '-3': '-my-3',
  '-3.5': '-my-3.5',
  '-4': '-my-4',
};
const mtMap: Record<string, string> = {
  auto: 'mt-auto',
  '0': 'mt-0',
  px: 'mt-px',
  '0.5': 'mt-0.5',
  '1': 'mt-1',
  '1.5': 'mt-1.5',
  '2': 'mt-2',
  '2.5': 'mt-2.5',
  '3': 'mt-3',
  '3.5': 'mt-3.5',
  '4': 'mt-4',
  '5': 'mt-5',
  '6': 'mt-6',
  '7': 'mt-7',
  '8': 'mt-8',
  '9': 'mt-9',
  '10': 'mt-10',
  '11': 'mt-11',
  '12': 'mt-12',
  '14': 'mt-14',
  '16': 'mt-16',
  '20': 'mt-20',
  '24': 'mt-24',
  '28': 'mt-28',
  '32': 'mt-32',
  '36': 'mt-36',
  '40': 'mt-40',
  '-px': '-mt-px',
  '-0.5': '-mt-0.5',
  '-1': '-mt-1',
  '-1.5': '-mt-1.5',
  '-2': '-mt-2',
  '-2.5': '-mt-2.5',
  '-3': '-mt-3',
  '-3.5': '-mt-3.5',
  '-4': '-mt-4',
};
const mrMap: Record<string, string> = {
  auto: 'mr-auto',
  '0': 'mr-0',
  px: 'mr-px',
  '0.5': 'mr-0.5',
  '1': 'mr-1',
  '1.5': 'mr-1.5',
  '2': 'mr-2',
  '2.5': 'mr-2.5',
  '3': 'mr-3',
  '3.5': 'mr-3.5',
  '4': 'mr-4',
  '5': 'mr-5',
  '6': 'mr-6',
  '7': 'mr-7',
  '8': 'mr-8',
  '9': 'mr-9',
  '10': 'mr-10',
  '11': 'mr-11',
  '12': 'mr-12',
  '14': 'mr-14',
  '16': 'mr-16',
  '20': 'mr-20',
  '24': 'mr-24',
  '28': 'mr-28',
  '32': 'mr-32',
  '36': 'mr-36',
  '40': 'mr-40',
  '-px': '-mr-px',
  '-0.5': '-mr-0.5',
  '-1': '-mr-1',
  '-1.5': '-mr-1.5',
  '-2': '-mr-2',
  '-2.5': '-mr-2.5',
  '-3': '-mr-3',
  '-3.5': '-mr-3.5',
  '-4': '-mr-4',
};
const mbMap: Record<string, string> = {
  auto: 'mb-auto',
  '0': 'mb-0',
  px: 'mb-px',
  '0.5': 'mb-0.5',
  '1': 'mb-1',
  '1.5': 'mb-1.5',
  '2': 'mb-2',
  '2.5': 'mb-2.5',
  '3': 'mb-3',
  '3.5': 'mb-3.5',
  '4': 'mb-4',
  '5': 'mb-5',
  '6': 'mb-6',
  '7': 'mb-7',
  '8': 'mb-8',
  '9': 'mb-9',
  '10': 'mb-10',
  '11': 'mb-11',
  '12': 'mb-12',
  '14': 'mb-14',
  '16': 'mb-16',
  '20': 'mb-20',
  '24': 'mb-24',
  '28': 'mb-28',
  '32': 'mb-32',
  '36': 'mb-36',
  '40': 'mb-40',
  '-px': '-mb-px',
  '-0.5': '-mb-0.5',
  '-1': '-mb-1',
  '-1.5': '-mb-1.5',
  '-2': '-mb-2',
  '-2.5': '-mb-2.5',
  '-3': '-mb-3',
  '-3.5': '-mb-3.5',
  '-4': '-mb-4',
};
const mlMap: Record<string, string> = {
  auto: 'ml-auto',
  '0': 'ml-0',
  px: 'ml-px',
  '0.5': 'ml-0.5',
  '1': 'ml-1',
  '1.5': 'ml-1.5',
  '2': 'ml-2',
  '2.5': 'ml-2.5',
  '3': 'ml-3',
  '3.5': 'ml-3.5',
  '4': 'ml-4',
  '5': 'ml-5',
  '6': 'ml-6',
  '7': 'ml-7',
  '8': 'ml-8',
  '9': 'ml-9',
  '10': 'ml-10',
  '11': 'ml-11',
  '12': 'ml-12',
  '14': 'ml-14',
  '16': 'ml-16',
  '20': 'ml-20',
  '24': 'ml-24',
  '28': 'ml-28',
  '32': 'ml-32',
  '36': 'ml-36',
  '40': 'ml-40',
  '-px': '-ml-px',
  '-0.5': '-ml-0.5',
  '-1': '-ml-1',
  '-1.5': '-ml-1.5',
  '-2': '-ml-2',
  '-2.5': '-ml-2.5',
  '-3': '-ml-3',
  '-3.5': '-ml-3.5',
  '-4': '-ml-4',
};

// Gap maps
const gapMap: Record<string, string> = {
  '0': 'gap-0',
  px: 'gap-px',
  '0.5': 'gap-0.5',
  '1': 'gap-1',
  '1.5': 'gap-1.5',
  '2': 'gap-2',
  '2.5': 'gap-2.5',
  '3': 'gap-3',
  '3.5': 'gap-3.5',
  '4': 'gap-4',
  '5': 'gap-5',
  '6': 'gap-6',
  '7': 'gap-7',
  '8': 'gap-8',
  '9': 'gap-9',
  '10': 'gap-10',
  '11': 'gap-11',
  '12': 'gap-12',
  '14': 'gap-14',
  '16': 'gap-16',
  '20': 'gap-20',
  '24': 'gap-24',
  '28': 'gap-28',
  '32': 'gap-32',
  '36': 'gap-36',
  '40': 'gap-40',
  '44': 'gap-44',
  '48': 'gap-48',
  '52': 'gap-52',
  '56': 'gap-56',
  '60': 'gap-60',
  '64': 'gap-64',
  '72': 'gap-72',
  '80': 'gap-80',
  '96': 'gap-96',
  true: 'gap-[var(--gap-default)]',
};
const gapXMap: Record<string, string> = {
  '0': 'gap-x-0',
  px: 'gap-x-px',
  '0.5': 'gap-x-0.5',
  '1': 'gap-x-1',
  '1.5': 'gap-x-1.5',
  '2': 'gap-x-2',
  '2.5': 'gap-x-2.5',
  '3': 'gap-x-3',
  '3.5': 'gap-x-3.5',
  '4': 'gap-x-4',
  '5': 'gap-x-5',
  '6': 'gap-x-6',
  '7': 'gap-x-7',
  '8': 'gap-x-8',
  '9': 'gap-x-9',
  '10': 'gap-x-10',
  '11': 'gap-x-11',
  '12': 'gap-x-12',
  '14': 'gap-x-14',
  '16': 'gap-x-16',
  '20': 'gap-x-20',
  '24': 'gap-x-24',
  '28': 'gap-x-28',
  '32': 'gap-x-32',
  true: 'gap-x-[var(--gap-default)]',
};
const gapYMap: Record<string, string> = {
  '0': 'gap-y-0',
  px: 'gap-y-px',
  '0.5': 'gap-y-0.5',
  '1': 'gap-y-1',
  '1.5': 'gap-y-1.5',
  '2': 'gap-y-2',
  '2.5': 'gap-y-2.5',
  '3': 'gap-y-3',
  '3.5': 'gap-y-3.5',
  '4': 'gap-y-4',
  '5': 'gap-y-5',
  '6': 'gap-y-6',
  '7': 'gap-y-7',
  '8': 'gap-y-8',
  '9': 'gap-y-9',
  '10': 'gap-y-10',
  '11': 'gap-y-11',
  '12': 'gap-y-12',
  '14': 'gap-y-14',
  '16': 'gap-y-16',
  '20': 'gap-y-20',
  '24': 'gap-y-24',
  '28': 'gap-y-28',
  '32': 'gap-y-32',
  true: 'gap-y-[var(--gap-default)]',
};

// Space-between maps (for child spacing utilities)
const spaceXMap: Record<string, string> = {
  '0': 'space-x-0',
  px: 'space-x-px',
  '0.5': 'space-x-0.5',
  '1': 'space-x-1',
  '1.5': 'space-x-1.5',
  '2': 'space-x-2',
  '2.5': 'space-x-2.5',
  '3': 'space-x-3',
  '3.5': 'space-x-3.5',
  '4': 'space-x-4',
  '5': 'space-x-5',
  '6': 'space-x-6',
  '7': 'space-x-7',
  '8': 'space-x-8',
  '9': 'space-x-9',
  '10': 'space-x-10',
  '11': 'space-x-11',
  '12': 'space-x-12',
  '14': 'space-x-14',
  '16': 'space-x-16',
  '20': 'space-x-20',
  '24': 'space-x-24',
  '28': 'space-x-28',
  '32': 'space-x-32',
  '36': 'space-x-36',
  '40': 'space-x-40',
  '44': 'space-x-44',
  '48': 'space-x-48',
  '52': 'space-x-52',
  '56': 'space-x-56',
  '60': 'space-x-60',
  '64': 'space-x-64',
  '72': 'space-x-72',
  '80': 'space-x-80',
  '96': 'space-x-96',
};
const spaceYMap: Record<string, string> = {
  '0': 'space-y-0',
  px: 'space-y-px',
  '0.5': 'space-y-0.5',
  '1': 'space-y-1',
  '1.5': 'space-y-1.5',
  '2': 'space-y-2',
  '2.5': 'space-y-2.5',
  '3': 'space-y-3',
  '3.5': 'space-y-3.5',
  '4': 'space-y-4',
  '5': 'space-y-5',
  '6': 'space-y-6',
  '7': 'space-y-7',
  '8': 'space-y-8',
  '9': 'space-y-9',
  '10': 'space-y-10',
  '11': 'space-y-11',
  '12': 'space-y-12',
  '14': 'space-y-14',
  '16': 'space-y-16',
  '20': 'space-y-20',
  '24': 'space-y-24',
  '28': 'space-y-28',
  '32': 'space-y-32',
  '36': 'space-y-36',
  '40': 'space-y-40',
  '44': 'space-y-44',
  '48': 'space-y-48',
  '52': 'space-y-52',
  '56': 'space-y-56',
  '60': 'space-y-60',
  '64': 'space-y-64',
  '72': 'space-y-72',
  '80': 'space-y-80',
  '96': 'space-y-96',
};

// Font size mapping - Tailwind-compatible names backed by Zen's isolated type scale
const fontSizeMap: Record<string, string> = {
  xs: 'text-[length:var(--zen-font-size-xs)]/[var(--zen-line-height-xs)]',
  sm: 'text-[length:var(--zen-font-size-sm)]/[var(--zen-line-height-sm)]',
  base: 'text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)]',
  lg: 'text-[length:var(--zen-font-size-lg)]/[var(--zen-line-height-lg)]',
  xl: 'text-[length:var(--zen-font-size-xl)]/[var(--zen-line-height-xl)]',
  '2xl': 'text-[length:var(--zen-font-size-2xl)]/[var(--zen-line-height-2xl)]',
  '3xl': 'text-[length:var(--zen-font-size-3xl)]/[var(--zen-line-height-3xl)]',
  '4xl': 'text-[length:var(--zen-font-size-4xl)]/[var(--zen-line-height-4xl)]',
  '5xl': 'text-[length:var(--zen-font-size-5xl)]/[var(--zen-line-height-5xl)]',
  '6xl': 'text-[length:var(--zen-font-size-6xl)]/[var(--zen-line-height-6xl)]',
  '7xl': 'text-[length:var(--zen-font-size-7xl)]/[var(--zen-line-height-7xl)]',
  '8xl': 'text-[length:var(--zen-font-size-8xl)]/[var(--zen-line-height-8xl)]',
  '9xl': 'text-[length:var(--zen-font-size-9xl)]/[var(--zen-line-height-9xl)]',
};

// Heading size mapping
const headingSizeMap: Record<string, string> = {
  sm: 'text-[length:var(--zen-font-size-sm)]/[var(--zen-line-height-sm)]',
  base: 'text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)]',
  lg: 'text-[length:var(--zen-font-size-lg)]/[var(--zen-line-height-lg)]',
  xl: 'text-[length:var(--zen-font-size-xl)]/[var(--zen-line-height-xl)]',
  '2xl': 'text-[length:var(--zen-font-size-2xl)]/[var(--zen-line-height-2xl)]',
  '3xl': 'text-[length:var(--zen-font-size-3xl)]/[var(--zen-line-height-3xl)]',
  '4xl': 'text-[length:var(--zen-font-size-4xl)]/[var(--zen-line-height-4xl)]',
  '5xl': 'text-[length:var(--zen-font-size-5xl)]/[var(--zen-line-height-5xl)]',
  '6xl': 'text-[length:var(--zen-font-size-6xl)]/[var(--zen-line-height-6xl)]',
  '7xl': 'text-[length:var(--zen-font-size-7xl)]/[var(--zen-line-height-7xl)]',
  '8xl': 'text-[length:var(--zen-font-size-8xl)]/[var(--zen-line-height-8xl)]',
  '9xl': 'text-[length:var(--zen-font-size-9xl)]/[var(--zen-line-height-9xl)]',
};

// Font weight mapping - Tailwind native names
const fontWeightMap: Record<string, string> = {
  thin: 'font-thin',
  extralight: 'font-extralight',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
};

// Border radius mapping - Tailwind native names
const borderRadiusMap: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
  true: 'rounded-[var(--radius-default)]',
};

// Border width mapping - sm=1, md=2, lg=4, xl=8
const borderWidthMap: Record<string, string> = {
  sm: 'border',
  md: 'border-2',
  lg: 'border-4',
  xl: 'border-8',
};

// Box shadow mapping - Tailwind native names
const shadowMap: Record<string, string> = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  inner: 'shadow-inner',
  true: 'shadow-[var(--shadow-default)]',
};

// Semantic color mapping
const semanticColorMap: Record<string, { text: string; bg: string }> = {
  primary: { text: 'text-foreground-primary', bg: 'bg-primary' },
  muted: { text: 'text-foreground-muted', bg: 'bg-surface-raised' },
  inverted: { text: 'text-surface-base', bg: 'bg-surface-inverted' },
  disabled: { text: 'text-foreground-disabled', bg: 'bg-surface-disabled' },
  transparent: { text: 'text-transparent', bg: 'bg-transparent' },
  true: { text: 'text-foreground-primary', bg: 'bg-interactive' },
  // Surface colors
  'surface-base': { text: '', bg: 'bg-surface-base' },
  'surface-raised': { text: '', bg: 'bg-surface-raised' },
  'surface-sunken': { text: '', bg: 'bg-surface-sunken' },
  'surface-overlay': { text: '', bg: 'bg-surface-overlay' },
  'surface-inverted': { text: '', bg: 'bg-surface-inverted' },
  'surface-disabled': { text: '', bg: 'bg-surface-disabled' },
  // Interactive colors
  interactive: { text: '', bg: 'bg-interactive' },
  'interactive-hover': { text: '', bg: 'bg-interactive-hover' },
  'interactive-pressed': { text: '', bg: 'bg-interactive-pressed' },
};

// Tailwind color names for pattern matching
const tailwindColors = new Set([
  'gray',
  'slate',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
]);

// Check if value is a Tailwind color (base or with shade)
function isTailwindColor(value: string): boolean {
  // Check for color-shade format (e.g., 'blue-500')
  const parts = value.split('-');
  if (parts.length === 2 && tailwindColors.has(parts[0]) && /^\d+$/.test(parts[1])) {
    return true;
  }
  // Check for base color name (e.g., 'blue')
  return tailwindColors.has(value);
}

// Get Tailwind color class (handles both 'blue' and 'blue-500' formats)
function getTailwindColorClass(value: string, prefix: 'text' | 'bg' | 'border'): string {
  // If it's a base color without shade, default to 500
  if (tailwindColors.has(value)) {
    return `${prefix}-${value}-500`;
  }
  // Otherwise use the full color-shade value
  return `${prefix}-${value}`;
}

// Display mapping
const displayMap: Record<string, string> = {
  none: 'hidden',
  block: 'block',
  inline: 'inline',
  'inline-block': 'inline-block',
  flex: 'flex',
  'inline-flex': 'inline-flex',
  grid: 'grid',
  'inline-grid': 'inline-grid',
};

// Position mapping
const positionMap: Record<string, string> = {
  static: 'static',
  relative: 'relative',
  absolute: 'absolute',
  fixed: 'fixed',
  sticky: 'sticky',
};

// Overflow mapping
const overflowMap: Record<string, string> = {
  visible: 'overflow-visible',
  hidden: 'overflow-hidden',
  clip: 'overflow-clip',
  scroll: 'overflow-scroll',
  auto: 'overflow-auto',
};
const overflowXMap: Record<string, string> = {
  visible: 'overflow-x-visible',
  hidden: 'overflow-x-hidden',
  clip: 'overflow-x-clip',
  scroll: 'overflow-x-scroll',
  auto: 'overflow-x-auto',
};
const overflowYMap: Record<string, string> = {
  visible: 'overflow-y-visible',
  hidden: 'overflow-y-hidden',
  clip: 'overflow-y-clip',
  scroll: 'overflow-y-scroll',
  auto: 'overflow-y-auto',
};

// Cursor mapping
const cursorMap: Record<string, string> = {
  auto: 'cursor-auto',
  default: 'cursor-default',
  pointer: 'cursor-pointer',
  wait: 'cursor-wait',
  text: 'cursor-text',
  move: 'cursor-move',
  help: 'cursor-help',
  'not-allowed': 'cursor-not-allowed',
  none: 'cursor-none',
  grab: 'cursor-grab',
  grabbing: 'cursor-grabbing',
};

// Opacity mapping
const opacityMap: Record<string, string> = {
  '0': 'opacity-0',
  '5': 'opacity-5',
  '10': 'opacity-10',
  '15': 'opacity-15',
  '20': 'opacity-20',
  '25': 'opacity-25',
  '30': 'opacity-30',
  '35': 'opacity-35',
  '40': 'opacity-40',
  '45': 'opacity-45',
  '50': 'opacity-50',
  '55': 'opacity-55',
  '60': 'opacity-60',
  '65': 'opacity-65',
  '70': 'opacity-70',
  '75': 'opacity-75',
  '80': 'opacity-80',
  '85': 'opacity-85',
  '90': 'opacity-90',
  '95': 'opacity-95',
  '100': 'opacity-100',
};

// Pointer events mapping
const pointerEventsMap: Record<string, string> = {
  none: 'pointer-events-none',
  auto: 'pointer-events-auto',
};

// Flex direction mapping
const flexDirectionMap: Record<string, string> = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  column: 'flex-col',
  'column-reverse': 'flex-col-reverse',
};

// Flex wrap mapping
const flexWrapMap: Record<string, string> = {
  wrap: 'flex-wrap',
  nowrap: 'flex-nowrap',
  'wrap-reverse': 'flex-wrap-reverse',
};

// Justify content mapping
const justifyContentMap: Record<string, string> = {
  center: 'justify-center',
  start: 'justify-start',
  end: 'justify-end',
  'flex-start': 'justify-start',
  'flex-end': 'justify-end',
  'space-between': 'justify-between',
  'space-around': 'justify-around',
  'space-evenly': 'justify-evenly',
  stretch: 'justify-stretch',
};

// Justify items mapping
const justifyItemsMap: Record<string, string> = {
  start: 'justify-items-start',
  end: 'justify-items-end',
  center: 'justify-items-center',
  stretch: 'justify-items-stretch',
};

// Align content mapping
const alignContentMap: Record<string, string> = {
  center: 'content-center',
  start: 'content-start',
  end: 'content-end',
  'flex-start': 'content-start',
  'flex-end': 'content-end',
  'space-between': 'content-between',
  'space-around': 'content-around',
  'space-evenly': 'content-evenly',
  stretch: 'content-stretch',
  baseline: 'content-baseline',
};

// Align items mapping
const alignItemsMap: Record<string, string> = {
  center: 'items-center',
  start: 'items-start',
  end: 'items-end',
  'flex-start': 'items-start',
  'flex-end': 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

// Align self mapping
const alignSelfMap: Record<string, string> = {
  auto: 'self-auto',
  center: 'self-center',
  start: 'self-start',
  end: 'self-end',
  'flex-start': 'self-start',
  'flex-end': 'self-end',
  stretch: 'self-stretch',
  baseline: 'self-baseline',
};

// Text align mapping
const textAlignMap: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

// Text wrap mapping
const textWrapMap: Record<string, string> = {
  wrap: 'text-wrap',
  nowrap: 'text-nowrap',
  balance: 'text-balance',
  pretty: 'text-pretty',
};

// Text transform mapping
const textTransformMap: Record<string, string> = {
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
  none: 'normal-case',
};

// Letter spacing mapping - Tailwind native names
const letterSpacingMap: Record<string, string> = {
  tighter: 'tracking-tighter',
  tight: 'tracking-tight',
  normal: 'tracking-normal',
  wide: 'tracking-wide',
  wider: 'tracking-wider',
  widest: 'tracking-widest',
};

// Line height mapping
const lineHeightMap: Record<string, string> = {
  none: 'leading-none',
  tight: 'leading-tight',
  snug: 'leading-snug',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
  '3': 'leading-3',
  '4': 'leading-4',
  '5': 'leading-5',
  '6': 'leading-6',
  '7': 'leading-7',
  '8': 'leading-8',
  '9': 'leading-9',
  '10': 'leading-10',
};

// Whitespace mapping
const whitespaceMap: Record<string, string> = {
  normal: 'whitespace-normal',
  nowrap: 'whitespace-nowrap',
  pre: 'whitespace-pre',
  'pre-line': 'whitespace-pre-line',
  'pre-wrap': 'whitespace-pre-wrap',
  'break-spaces': 'whitespace-break-spaces',
};

// Word break mapping
const wordBreakMap: Record<string, string> = {
  normal: 'break-normal',
  words: 'break-words',
  all: 'break-all',
  keep: 'break-keep',
};

// Vertical align mapping
const verticalAlignMap: Record<string, string> = {
  baseline: 'align-baseline',
  top: 'align-top',
  middle: 'align-middle',
  bottom: 'align-bottom',
  'text-top': 'align-text-top',
  'text-bottom': 'align-text-bottom',
  sub: 'align-sub',
  super: 'align-super',
};

// Text decoration style mapping
const textDecorationStyleMap: Record<string, string> = {
  solid: 'decoration-solid',
  double: 'decoration-double',
  dotted: 'decoration-dotted',
  dashed: 'decoration-dashed',
  wavy: 'decoration-wavy',
};

// Text indent mapping
const textIndentMap: Record<string, string> = {
  '0': 'indent-0',
  px: 'indent-px',
  '0.5': 'indent-0.5',
  '1': 'indent-1',
  '1.5': 'indent-1.5',
  '2': 'indent-2',
  '2.5': 'indent-2.5',
  '3': 'indent-3',
  '3.5': 'indent-3.5',
  '4': 'indent-4',
  '5': 'indent-5',
  '6': 'indent-6',
  '7': 'indent-7',
  '8': 'indent-8',
  '9': 'indent-9',
  '10': 'indent-10',
  '11': 'indent-11',
  '12': 'indent-12',
  '14': 'indent-14',
  '16': 'indent-16',
  '20': 'indent-20',
  '24': 'indent-24',
};

// Grid auto flow mapping
const gridAutoFlowMap: Record<string, string> = {
  row: 'grid-flow-row',
  column: 'grid-flow-col',
  dense: 'grid-flow-dense',
  'row-dense': 'grid-flow-row-dense',
  'column-dense': 'grid-flow-col-dense',
};

// Grid columns mapping
const gridColumnsMap: Record<string, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-2',
  '3': 'grid-cols-3',
  '4': 'grid-cols-4',
  '5': 'grid-cols-5',
  '6': 'grid-cols-6',
  '7': 'grid-cols-7',
  '8': 'grid-cols-8',
  '9': 'grid-cols-9',
  '10': 'grid-cols-10',
  '11': 'grid-cols-11',
  '12': 'grid-cols-12',
  none: 'grid-cols-none',
  subgrid: 'grid-cols-subgrid',
};

// Grid rows mapping
const gridRowsMap: Record<string, string> = {
  '1': 'grid-rows-1',
  '2': 'grid-rows-2',
  '3': 'grid-rows-3',
  '4': 'grid-rows-4',
  '5': 'grid-rows-5',
  '6': 'grid-rows-6',
  '7': 'grid-rows-7',
  '8': 'grid-rows-8',
  '9': 'grid-rows-9',
  '10': 'grid-rows-10',
  '11': 'grid-rows-11',
  '12': 'grid-rows-12',
  none: 'grid-rows-none',
  subgrid: 'grid-rows-subgrid',
};

// Border mapping
const borderMap: Record<string, string> = {
  true: 'border border-edge',
  none: 'border-0',
  top: 'border-t border-edge',
  right: 'border-r border-edge',
  bottom: 'border-b border-edge',
  left: 'border-l border-edge',
};

// Semantic border color mapping
const semanticBorderColorMap: Record<string, string> = {
  true: 'border-edge',
  transparent: 'border-transparent',
  primary: 'border-primary',
  muted: 'border-edge-muted',
  strong: 'border-edge-strong',
  disabled: 'border-edge-muted',
};

// Helper to handle responsive values
function mapResponsive<T extends string | number | boolean>(
  value: Responsive<T> | undefined,
  mapper: (val: T) => string | undefined,
): string {
  if (value === undefined || value === null) return '';

  if (typeof value === 'object' && !Array.isArray(value)) {
    const classes: string[] = [];
    for (const [breakpoint, val] of Object.entries(value)) {
      if (val === undefined) continue;
      const mapped = mapper(val as T);
      if (mapped) {
        // 'base' means mobile-first styles, no prefix needed
        if (breakpoint === 'base') {
          classes.push(mapped);
        } else {
          classes.push(`${breakpoint}:${mapped}`);
        }
      }
    }
    return classes.join(' ');
  }

  return mapper(value as T) || '';
}

// Props to Tailwind class mappers
export function mapDisplay(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => displayMap[v] || v);
}

export function mapPosition(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => positionMap[v]);
}

export function mapOverflow(value: Responsive<string> | undefined, axis?: 'x' | 'y'): string {
  const map = axis === 'x' ? overflowXMap : axis === 'y' ? overflowYMap : overflowMap;
  return mapResponsive(value, v => map[v]);
}

export function mapCursor(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => cursorMap[v]);
}

export function mapOpacity(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => opacityMap[v]);
}

export function mapPointerEvents(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => pointerEventsMap[v]);
}

export function mapPadding(value: Responsive<string> | undefined, side?: string): string {
  const map =
    side === 'x'
      ? pxMap
      : side === 'y'
        ? pyMap
        : side === 't'
          ? ptMap
          : side === 'r'
            ? prMap
            : side === 'b'
              ? pbMap
              : side === 'l'
                ? plMap
                : paddingMap;
  return mapResponsive(value, v => map[String(v)]);
}

export function mapMargin(value: Responsive<string> | undefined, side?: string): string {
  const map =
    side === 'x'
      ? mxMap
      : side === 'y'
        ? myMap
        : side === 't'
          ? mtMap
          : side === 'r'
            ? mrMap
            : side === 'b'
              ? mbMap
              : side === 'l'
                ? mlMap
                : marginMap;
  return mapResponsive(value, v => map[String(v)]);
}

export function mapGap(value: Responsive<string> | undefined, axis?: 'x' | 'y'): string {
  const map = axis === 'x' ? gapXMap : axis === 'y' ? gapYMap : gapMap;
  return mapResponsive(value, v => map[String(v)]);
}

export function mapSpace(value: Responsive<string> | undefined, axis: 'x' | 'y'): string {
  const map = axis === 'x' ? spaceXMap : spaceYMap;
  return mapResponsive(value, v => map[String(v)]);
}

export function mapFontSize(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => fontSizeMap[v]);
}

export function mapHeadingSize(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => headingSizeMap[v]);
}

export function mapFontWeight(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => fontWeightMap[v]);
}

export function mapTextColor(value: string | undefined): string {
  if (!value) return '';
  // Check semantic colors first
  if (semanticColorMap[value]) {
    return semanticColorMap[value].text;
  }
  // Check Tailwind colors
  if (isTailwindColor(value)) {
    return getTailwindColorClass(value, 'text');
  }
  return '';
}

export function mapBackgroundColor(value: string | undefined): string {
  if (!value) return '';
  // Check semantic colors first
  if (semanticColorMap[value]) {
    return semanticColorMap[value].bg;
  }
  // Check Tailwind colors
  if (isTailwindColor(value)) {
    return getTailwindColorClass(value, 'bg');
  }
  return '';
}

export function mapBorderRadius(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => borderRadiusMap[String(v)]);
}

export function mapBorderWidth(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => borderWidthMap[v]);
}

export function mapShadow(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => shadowMap[v]);
}

export function mapFlexDirection(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => flexDirectionMap[v]);
}

export function mapFlexWrap(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => flexWrapMap[v]);
}

export function mapJustifyContent(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => justifyContentMap[v]);
}

export function mapJustifyItems(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => justifyItemsMap[v]);
}

export function mapAlignContent(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => alignContentMap[v]);
}

export function mapAlignItems(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => alignItemsMap[v]);
}

export function mapAlignSelf(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => alignSelfMap[v]);
}

export function mapTextAlign(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => textAlignMap[v]);
}

export function mapTextWrap(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => textWrapMap[v]);
}

export function mapTextTransform(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => textTransformMap[v]);
}

export function mapLetterSpacing(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => letterSpacingMap[v]);
}

export function mapLineHeight(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => lineHeightMap[v]);
}

export function mapWhitespace(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => whitespaceMap[v]);
}

export function mapWordBreak(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => wordBreakMap[v]);
}

export function mapVerticalAlign(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => verticalAlignMap[v]);
}

export function mapTextDecorationStyle(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => textDecorationStyleMap[v]);
}

export function mapTextIndent(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => textIndentMap[v]);
}

export function mapGridAutoFlow(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => gridAutoFlowMap[v]);
}

export function mapGridColumns(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => gridColumnsMap[v]);
}

export function mapGridRows(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => gridRowsMap[v]);
}

export function mapBorder(value: Responsive<string | boolean> | undefined): string {
  return mapResponsive(value, v => borderMap[String(v)]);
}

export function mapBorderColor(value: string | undefined): string {
  if (!value) return '';
  // Check semantic colors first
  if (semanticBorderColorMap[value]) {
    return semanticBorderColorMap[value];
  }
  // Check Tailwind colors
  if (isTailwindColor(value)) {
    return getTailwindColorClass(value, 'border');
  }
  return '';
}

// Semantic CSS color values for SVG stroke/fill
const semanticCssColorValues: Record<string, string> = {
  primary: 'var(--text-primary)',
  muted: 'var(--text-muted)',
  disabled: 'var(--text-disabled)',
};

// Tailwind color hex values (500 shade as default)
const tailwindColorHex: Record<string, Record<string, string>> = {
  gray: {
    '50': '#f9fafb',
    '100': '#f3f4f6',
    '200': '#e5e7eb',
    '300': '#d1d5db',
    '400': '#9ca3af',
    '500': '#6b7280',
    '600': '#4b5563',
    '700': '#374151',
    '800': '#1f2937',
    '900': '#111827',
    '950': '#030712',
  },
  slate: {
    '50': '#f8fafc',
    '100': '#f1f5f9',
    '200': '#e2e8f0',
    '300': '#cbd5e1',
    '400': '#94a3b8',
    '500': '#64748b',
    '600': '#475569',
    '700': '#334155',
    '800': '#1e293b',
    '900': '#0f172a',
    '950': '#020617',
  },
  zinc: {
    '50': '#fafafa',
    '100': '#f4f4f5',
    '200': '#e4e4e7',
    '300': '#d4d4d8',
    '400': '#a1a1aa',
    '500': '#71717a',
    '600': '#52525b',
    '700': '#3f3f46',
    '800': '#27272a',
    '900': '#18181b',
    '950': '#09090b',
  },
  neutral: {
    '50': '#fafafa',
    '100': '#f5f5f5',
    '200': '#e5e5e5',
    '300': '#d4d4d4',
    '400': '#a3a3a3',
    '500': '#737373',
    '600': '#525252',
    '700': '#404040',
    '800': '#262626',
    '900': '#171717',
    '950': '#0a0a0a',
  },
  stone: {
    '50': '#fafaf9',
    '100': '#f5f5f4',
    '200': '#e7e5e4',
    '300': '#d6d3d1',
    '400': '#a8a29e',
    '500': '#78716c',
    '600': '#57534e',
    '700': '#44403c',
    '800': '#292524',
    '900': '#1c1917',
    '950': '#0c0a09',
  },
  red: {
    '50': '#fef2f2',
    '100': '#fee2e2',
    '200': '#fecaca',
    '300': '#fca5a5',
    '400': '#f87171',
    '500': '#ef4444',
    '600': '#dc2626',
    '700': '#b91c1c',
    '800': '#991b1b',
    '900': '#7f1d1d',
    '950': '#450a0a',
  },
  orange: {
    '50': '#fff7ed',
    '100': '#ffedd5',
    '200': '#fed7aa',
    '300': '#fdba74',
    '400': '#fb923c',
    '500': '#f97316',
    '600': '#ea580c',
    '700': '#c2410c',
    '800': '#9a3412',
    '900': '#7c2d12',
    '950': '#431407',
  },
  amber: {
    '50': '#fffbeb',
    '100': '#fef3c7',
    '200': '#fde68a',
    '300': '#fcd34d',
    '400': '#fbbf24',
    '500': '#f59e0b',
    '600': '#d97706',
    '700': '#b45309',
    '800': '#92400e',
    '900': '#78350f',
    '950': '#451a03',
  },
  yellow: {
    '50': '#fefce8',
    '100': '#fef9c3',
    '200': '#fef08a',
    '300': '#fde047',
    '400': '#facc15',
    '500': '#eab308',
    '600': '#ca8a04',
    '700': '#a16207',
    '800': '#854d0e',
    '900': '#713f12',
    '950': '#422006',
  },
  lime: {
    '50': '#f7fee7',
    '100': '#ecfccb',
    '200': '#d9f99d',
    '300': '#bef264',
    '400': '#a3e635',
    '500': '#84cc16',
    '600': '#65a30d',
    '700': '#4d7c0f',
    '800': '#3f6212',
    '900': '#365314',
    '950': '#1a2e05',
  },
  green: {
    '50': '#f0fdf4',
    '100': '#dcfce7',
    '200': '#bbf7d0',
    '300': '#86efac',
    '400': '#4ade80',
    '500': '#22c55e',
    '600': '#16a34a',
    '700': '#15803d',
    '800': '#166534',
    '900': '#14532d',
    '950': '#052e16',
  },
  emerald: {
    '50': '#ecfdf5',
    '100': '#d1fae5',
    '200': '#a7f3d0',
    '300': '#6ee7b7',
    '400': '#34d399',
    '500': '#10b981',
    '600': '#059669',
    '700': '#047857',
    '800': '#065f46',
    '900': '#064e3b',
    '950': '#022c22',
  },
  teal: {
    '50': '#f0fdfa',
    '100': '#ccfbf1',
    '200': '#99f6e4',
    '300': '#5eead4',
    '400': '#2dd4bf',
    '500': '#14b8a6',
    '600': '#0d9488',
    '700': '#0f766e',
    '800': '#115e59',
    '900': '#134e4a',
    '950': '#042f2e',
  },
  cyan: {
    '50': '#ecfeff',
    '100': '#cffafe',
    '200': '#a5f3fc',
    '300': '#67e8f9',
    '400': '#22d3ee',
    '500': '#06b6d4',
    '600': '#0891b2',
    '700': '#0e7490',
    '800': '#155e75',
    '900': '#164e63',
    '950': '#083344',
  },
  sky: {
    '50': '#f0f9ff',
    '100': '#e0f2fe',
    '200': '#bae6fd',
    '300': '#7dd3fc',
    '400': '#38bdf8',
    '500': '#0ea5e9',
    '600': '#0284c7',
    '700': '#0369a1',
    '800': '#075985',
    '900': '#0c4a6e',
    '950': '#082f49',
  },
  blue: {
    '50': '#eff6ff',
    '100': '#dbeafe',
    '200': '#bfdbfe',
    '300': '#93c5fd',
    '400': '#60a5fa',
    '500': '#3b82f6',
    '600': '#2563eb',
    '700': '#1d4ed8',
    '800': '#1e40af',
    '900': '#1e3a8a',
    '950': '#172554',
  },
  indigo: {
    '50': '#eef2ff',
    '100': '#e0e7ff',
    '200': '#c7d2fe',
    '300': '#a5b4fc',
    '400': '#818cf8',
    '500': '#6366f1',
    '600': '#4f46e5',
    '700': '#4338ca',
    '800': '#3730a3',
    '900': '#312e81',
    '950': '#1e1b4b',
  },
  violet: {
    '50': '#f5f3ff',
    '100': '#ede9fe',
    '200': '#ddd6fe',
    '300': '#c4b5fd',
    '400': '#a78bfa',
    '500': '#8b5cf6',
    '600': '#7c3aed',
    '700': '#6d28d9',
    '800': '#5b21b6',
    '900': '#4c1d95',
    '950': '#2e1065',
  },
  purple: {
    '50': '#faf5ff',
    '100': '#f3e8ff',
    '200': '#e9d5ff',
    '300': '#d8b4fe',
    '400': '#c084fc',
    '500': '#a855f7',
    '600': '#9333ea',
    '700': '#7e22ce',
    '800': '#6b21a8',
    '900': '#581c87',
    '950': '#3b0764',
  },
  fuchsia: {
    '50': '#fdf4ff',
    '100': '#fae8ff',
    '200': '#f5d0fe',
    '300': '#f0abfc',
    '400': '#e879f9',
    '500': '#d946ef',
    '600': '#c026d3',
    '700': '#a21caf',
    '800': '#86198f',
    '900': '#701a75',
    '950': '#4a044e',
  },
  pink: {
    '50': '#fdf2f8',
    '100': '#fce7f3',
    '200': '#fbcfe8',
    '300': '#f9a8d4',
    '400': '#f472b6',
    '500': '#ec4899',
    '600': '#db2777',
    '700': '#be185d',
    '800': '#9d174d',
    '900': '#831843',
    '950': '#500724',
  },
  rose: {
    '50': '#fff1f2',
    '100': '#ffe4e6',
    '200': '#fecdd3',
    '300': '#fda4af',
    '400': '#fb7185',
    '500': '#f43f5e',
    '600': '#e11d48',
    '700': '#be123c',
    '800': '#9f1239',
    '900': '#881337',
    '950': '#4c0519',
  },
};

export function getCssColorValue(value: string | undefined): string | undefined {
  if (!value) return undefined;

  // Check semantic colors first
  if (semanticCssColorValues[value]) {
    return semanticCssColorValues[value];
  }

  // Check Tailwind colors
  const parts = value.split('-');
  if (parts.length === 2 && tailwindColors.has(parts[0])) {
    return tailwindColorHex[parts[0]]?.[parts[1]];
  }

  // Base color without shade defaults to 500
  if (tailwindColors.has(value)) {
    return tailwindColorHex[value]?.['500'];
  }

  return undefined;
}

// Width mapping - spacing scale + fractions + special values
const widthMap: Record<string, string> = {
  // Spacing scale
  '0': 'w-0',
  px: 'w-px',
  '0.5': 'w-0.5',
  '1': 'w-1',
  '1.5': 'w-1.5',
  '2': 'w-2',
  '2.5': 'w-2.5',
  '3': 'w-3',
  '3.5': 'w-3.5',
  '4': 'w-4',
  '5': 'w-5',
  '6': 'w-6',
  '7': 'w-7',
  '8': 'w-8',
  '9': 'w-9',
  '10': 'w-10',
  '11': 'w-11',
  '12': 'w-12',
  '14': 'w-14',
  '16': 'w-16',
  '20': 'w-20',
  '24': 'w-24',
  '28': 'w-28',
  '32': 'w-32',
  '36': 'w-36',
  '40': 'w-40',
  '44': 'w-44',
  '48': 'w-48',
  '52': 'w-52',
  '56': 'w-56',
  '60': 'w-60',
  '64': 'w-64',
  '72': 'w-72',
  '80': 'w-80',
  '96': 'w-96',
  // Fractions
  '1/2': 'w-1/2',
  '1/3': 'w-1/3',
  '2/3': 'w-2/3',
  '1/4': 'w-1/4',
  '2/4': 'w-2/4',
  '3/4': 'w-3/4',
  '1/5': 'w-1/5',
  '2/5': 'w-2/5',
  '3/5': 'w-3/5',
  '4/5': 'w-4/5',
  '1/6': 'w-1/6',
  '2/6': 'w-2/6',
  '3/6': 'w-3/6',
  '4/6': 'w-4/6',
  '5/6': 'w-5/6',
  '1/12': 'w-1/12',
  '2/12': 'w-2/12',
  '3/12': 'w-3/12',
  '4/12': 'w-4/12',
  '5/12': 'w-5/12',
  '6/12': 'w-6/12',
  '7/12': 'w-7/12',
  '8/12': 'w-8/12',
  '9/12': 'w-9/12',
  '10/12': 'w-10/12',
  '11/12': 'w-11/12',
  // Special values
  auto: 'w-auto',
  full: 'w-full',
  screen: 'w-screen',
  svw: 'w-svw',
  lvw: 'w-lvw',
  dvw: 'w-dvw',
  min: 'w-min',
  max: 'w-max',
  fit: 'w-fit',
};

// Height mapping - spacing scale + fractions + special values
const heightMap: Record<string, string> = {
  // Spacing scale
  '0': 'h-0',
  px: 'h-px',
  '0.5': 'h-0.5',
  '1': 'h-1',
  '1.5': 'h-1.5',
  '2': 'h-2',
  '2.5': 'h-2.5',
  '3': 'h-3',
  '3.5': 'h-3.5',
  '4': 'h-4',
  '5': 'h-5',
  '6': 'h-6',
  '7': 'h-7',
  '8': 'h-8',
  '9': 'h-9',
  '10': 'h-10',
  '11': 'h-11',
  '12': 'h-12',
  '14': 'h-14',
  '16': 'h-16',
  '20': 'h-20',
  '24': 'h-24',
  '28': 'h-28',
  '32': 'h-32',
  '36': 'h-36',
  '40': 'h-40',
  '44': 'h-44',
  '48': 'h-48',
  '52': 'h-52',
  '56': 'h-56',
  '60': 'h-60',
  '64': 'h-64',
  '72': 'h-72',
  '80': 'h-80',
  '96': 'h-96',
  // Fractions
  '1/2': 'h-1/2',
  '1/3': 'h-1/3',
  '2/3': 'h-2/3',
  '1/4': 'h-1/4',
  '2/4': 'h-2/4',
  '3/4': 'h-3/4',
  '1/5': 'h-1/5',
  '2/5': 'h-2/5',
  '3/5': 'h-3/5',
  '4/5': 'h-4/5',
  '1/6': 'h-1/6',
  '2/6': 'h-2/6',
  '3/6': 'h-3/6',
  '4/6': 'h-4/6',
  '5/6': 'h-5/6',
  // Special values
  auto: 'h-auto',
  full: 'h-full',
  screen: 'h-screen',
  svh: 'h-svh',
  lvh: 'h-lvh',
  dvh: 'h-dvh',
  min: 'h-min',
  max: 'h-max',
  fit: 'h-fit',
};

// Min-width mapping
const minWidthMap: Record<string, string> = {
  '0': 'min-w-0',
  px: 'min-w-px',
  '0.5': 'min-w-0.5',
  '1': 'min-w-1',
  '1.5': 'min-w-1.5',
  '2': 'min-w-2',
  '2.5': 'min-w-2.5',
  '3': 'min-w-3',
  '3.5': 'min-w-3.5',
  '4': 'min-w-4',
  '5': 'min-w-5',
  '6': 'min-w-6',
  '7': 'min-w-7',
  '8': 'min-w-8',
  '9': 'min-w-9',
  '10': 'min-w-10',
  '11': 'min-w-11',
  '12': 'min-w-12',
  '14': 'min-w-14',
  '16': 'min-w-16',
  '20': 'min-w-20',
  '24': 'min-w-24',
  '28': 'min-w-28',
  '32': 'min-w-32',
  '36': 'min-w-36',
  '40': 'min-w-40',
  '44': 'min-w-44',
  '48': 'min-w-48',
  '52': 'min-w-52',
  '56': 'min-w-56',
  '60': 'min-w-60',
  '64': 'min-w-64',
  '72': 'min-w-72',
  '80': 'min-w-80',
  '96': 'min-w-96',
  full: 'min-w-full',
  min: 'min-w-min',
  max: 'min-w-max',
  fit: 'min-w-fit',
};

// Max-width mapping (includes container sizes)
const maxWidthMap: Record<string, string> = {
  '0': 'max-w-0',
  px: 'max-w-px',
  '0.5': 'max-w-0.5',
  '1': 'max-w-1',
  '1.5': 'max-w-1.5',
  '2': 'max-w-2',
  '2.5': 'max-w-2.5',
  '3': 'max-w-3',
  '3.5': 'max-w-3.5',
  '4': 'max-w-4',
  '5': 'max-w-5',
  '6': 'max-w-6',
  '7': 'max-w-7',
  '8': 'max-w-8',
  '9': 'max-w-9',
  '10': 'max-w-10',
  '11': 'max-w-11',
  '12': 'max-w-12',
  '14': 'max-w-14',
  '16': 'max-w-16',
  '20': 'max-w-20',
  '24': 'max-w-24',
  '28': 'max-w-28',
  '32': 'max-w-32',
  '36': 'max-w-36',
  '40': 'max-w-40',
  '44': 'max-w-44',
  '48': 'max-w-48',
  '52': 'max-w-52',
  '56': 'max-w-56',
  '60': 'max-w-60',
  '64': 'max-w-64',
  '72': 'max-w-72',
  '80': 'max-w-80',
  '96': 'max-w-96',
  // Container sizes
  none: 'max-w-none',
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
  min: 'max-w-min',
  max: 'max-w-max',
  fit: 'max-w-fit',
  prose: 'max-w-prose',
  'screen-sm': 'max-w-screen-sm',
  'screen-md': 'max-w-screen-md',
  'screen-lg': 'max-w-screen-lg',
  'screen-xl': 'max-w-screen-xl',
  'screen-2xl': 'max-w-screen-2xl',
};

// Min-height mapping
const minHeightMap: Record<string, string> = {
  '0': 'min-h-0',
  px: 'min-h-px',
  '0.5': 'min-h-0.5',
  '1': 'min-h-1',
  '1.5': 'min-h-1.5',
  '2': 'min-h-2',
  '2.5': 'min-h-2.5',
  '3': 'min-h-3',
  '3.5': 'min-h-3.5',
  '4': 'min-h-4',
  '5': 'min-h-5',
  '6': 'min-h-6',
  '7': 'min-h-7',
  '8': 'min-h-8',
  '9': 'min-h-9',
  '10': 'min-h-10',
  '11': 'min-h-11',
  '12': 'min-h-12',
  '14': 'min-h-14',
  '16': 'min-h-16',
  '20': 'min-h-20',
  '24': 'min-h-24',
  '28': 'min-h-28',
  '32': 'min-h-32',
  '36': 'min-h-36',
  '40': 'min-h-40',
  '44': 'min-h-44',
  '48': 'min-h-48',
  '52': 'min-h-52',
  '56': 'min-h-56',
  '60': 'min-h-60',
  '64': 'min-h-64',
  '72': 'min-h-72',
  '80': 'min-h-80',
  '96': 'min-h-96',
  full: 'min-h-full',
  screen: 'min-h-screen',
  svh: 'min-h-svh',
  lvh: 'min-h-lvh',
  dvh: 'min-h-dvh',
  min: 'min-h-min',
  max: 'min-h-max',
  fit: 'min-h-fit',
};

// Max-height mapping
const maxHeightMap: Record<string, string> = {
  '0': 'max-h-0',
  px: 'max-h-px',
  '0.5': 'max-h-0.5',
  '1': 'max-h-1',
  '1.5': 'max-h-1.5',
  '2': 'max-h-2',
  '2.5': 'max-h-2.5',
  '3': 'max-h-3',
  '3.5': 'max-h-3.5',
  '4': 'max-h-4',
  '5': 'max-h-5',
  '6': 'max-h-6',
  '7': 'max-h-7',
  '8': 'max-h-8',
  '9': 'max-h-9',
  '10': 'max-h-10',
  '11': 'max-h-11',
  '12': 'max-h-12',
  '14': 'max-h-14',
  '16': 'max-h-16',
  '20': 'max-h-20',
  '24': 'max-h-24',
  '28': 'max-h-28',
  '32': 'max-h-32',
  '36': 'max-h-36',
  '40': 'max-h-40',
  '44': 'max-h-44',
  '48': 'max-h-48',
  '52': 'max-h-52',
  '56': 'max-h-56',
  '60': 'max-h-60',
  '64': 'max-h-64',
  '72': 'max-h-72',
  '80': 'max-h-80',
  '96': 'max-h-96',
  none: 'max-h-none',
  full: 'max-h-full',
  screen: 'max-h-screen',
  svh: 'max-h-svh',
  lvh: 'max-h-lvh',
  dvh: 'max-h-dvh',
  min: 'max-h-min',
  max: 'max-h-max',
  fit: 'max-h-fit',
};

// Sizing mapper functions
export function mapWidth(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => widthMap[v]);
}

export function mapHeight(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => heightMap[v]);
}

export function mapMinWidth(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => minWidthMap[v]);
}

export function mapMaxWidth(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => maxWidthMap[v]);
}

export function mapMinHeight(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => minHeightMap[v]);
}

export function mapMaxHeight(value: Responsive<string> | undefined): string {
  return mapResponsive(value, v => maxHeightMap[v]);
}

// Check if a value is a known preset (returns true if it should use Tailwind class)
export function isWidthPreset(value: string): boolean {
  return value in widthMap;
}

export function isHeightPreset(value: string): boolean {
  return value in heightMap;
}

export function isMinWidthPreset(value: string): boolean {
  return value in minWidthMap;
}

export function isMaxWidthPreset(value: string): boolean {
  return value in maxWidthMap;
}

export function isMinHeightPreset(value: string): boolean {
  return value in minHeightMap;
}

export function isMaxHeightPreset(value: string): boolean {
  return value in maxHeightMap;
}

// State styles mapping (hover, focus, active)
type StatePrefix = 'hover' | 'focus' | 'active';

interface StateStylesInput {
  color?: string | boolean;
  backgroundColor?: string | boolean;
  borderColor?: string | boolean;
  opacity?: string;
}

function addStatePrefix(prefix: StatePrefix, className: string): string {
  if (!className) return '';
  // Handle multiple classes
  return className
    .split(' ')
    .filter(Boolean)
    .map(cls => `${prefix}:${cls}`)
    .join(' ');
}

export function mapStateStyles(prefix: StatePrefix, styles: StateStylesInput | undefined): string {
  if (!styles) return '';

  const classes: string[] = [];

  if (styles.color !== undefined) {
    const colorClass = mapTextColor(
      typeof styles.color === 'boolean' ? 'true' : String(styles.color),
    );
    if (colorClass) classes.push(addStatePrefix(prefix, colorClass));
  }

  if (styles.backgroundColor !== undefined) {
    const bgClass = mapBackgroundColor(
      typeof styles.backgroundColor === 'boolean' ? 'true' : String(styles.backgroundColor),
    );
    if (bgClass) classes.push(addStatePrefix(prefix, bgClass));
  }

  if (styles.borderColor !== undefined) {
    const borderClass = mapBorderColor(
      typeof styles.borderColor === 'boolean' ? 'true' : String(styles.borderColor),
    );
    if (borderClass) classes.push(addStatePrefix(prefix, borderClass));
  }

  if (styles.opacity !== undefined) {
    const opacityClass = mapOpacity(styles.opacity);
    if (opacityClass) classes.push(addStatePrefix(prefix, opacityClass));
  }

  return classes.join(' ');
}
