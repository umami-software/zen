export { cn } from 'cn';

export function debounce(func: (...args: any[]) => void, delay: number) {
  let timer: number;

  return (...args: any[]) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function mapIdProperty(data: any[]) {
  return data.length && data?.[0]?.id === undefined
    ? data.map((row, id) => ({ ...row, id }))
    : data;
}
