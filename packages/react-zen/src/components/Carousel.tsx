import useEmblaCarousel from 'embla-carousel-react';
import {
  Children,
  createContext,
  type HTMLAttributes,
  isValidElement,
  type KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ChevronLeft, ChevronRight } from '@/components/icons';
import { Button, type ButtonProps } from './Button';
import { cn } from './lib/tailwind';

type EmblaOptions = NonNullable<Parameters<typeof useEmblaCarousel>[0]>;
export type CarouselApi = ReturnType<typeof useEmblaCarousel>[1];

export type CarouselOrientation = 'horizontal' | 'vertical';

export interface CarouselContextValue {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi;
  orientation: CarouselOrientation;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  slideCount: number;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useCarousel() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: CarouselOrientation;
  loop?: boolean;
  /** Render the built-in previous/next controls. */
  showArrows?: boolean;
  /** Render the built-in pagination dots. */
  showDots?: boolean;
  opts?: EmblaOptions;
  setApi?: (api: CarouselApi) => void;
  onIndexChange?: (index: number) => void;
}

export function Carousel({
  orientation = 'horizontal',
  loop,
  showArrows = true,
  showDots,
  opts,
  setApi,
  onIndexChange,
  className,
  children,
  ...props
}: CarouselProps) {
  const [carouselRef, emblaApi] = useEmblaCarousel({
    axis: orientation === 'vertical' ? 'y' : 'x',
    loop,
    ...opts,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
    onIndexChange?.(emblaApi.selectedScrollSnap());
  }, [emblaApi, onIndexChange]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    setSlideCount(emblaApi.scrollSnapList().length);
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi) {
      setApi?.(emblaApi);
    }
  }, [emblaApi, setApi]);

  // Backwards compatible: when the parts API is not used, slides passed as
  // direct children are wrapped in a <CarouselContent /> automatically.
  const usesParts = Children.toArray(children).some(
    child => isValidElement(child) && child.type === CarouselContent,
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    props.onKeyDownCapture?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';

    if (event.key === prevKey) {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === nextKey) {
      event.preventDefault();
      scrollNext();
    }
  };

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: emblaApi,
        orientation,
        scrollPrev,
        scrollNext,
        scrollTo,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        slideCount,
      }}
    >
      <div
        {...props}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        data-orientation={orientation}
        className={cn('relative', className)}
        onKeyDownCapture={handleKeyDown}
      >
        {usesParts ? children : <CarouselContent>{children}</CarouselContent>}
        {showArrows && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
        {showDots && <CarouselDots />}
      </div>
    </CarouselContext.Provider>
  );
}

export interface CarouselContentProps extends HTMLAttributes<HTMLDivElement> {}

export function CarouselContent({ className, children, ...props }: CarouselContentProps) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} data-slot="carousel-content" className="overflow-hidden">
      <div
        {...props}
        className={cn('flex', orientation === 'vertical' && 'max-h-full flex-col', className)}
      >
        {children}
      </div>
    </div>
  );
}

export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {}

export function CarouselItem({ className, children, ...props }: CarouselItemProps) {
  return (
    <div
      {...props}
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn('min-w-0 shrink-0 grow-0 basis-full', className)}
    >
      {children}
    </div>
  );
}

export interface CarouselArrowProps extends Omit<ButtonProps, 'size'> {}

export function CarouselPrevious({
  className,
  variant = 'outline',
  children,
  ...props
}: CarouselArrowProps) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  const isVertical = orientation === 'vertical';

  return (
    <Button
      {...props}
      data-slot="carousel-previous"
      variant={variant}
      size="icon"
      aria-label={props['aria-label'] ?? 'Previous slide'}
      isDisabled={props.isDisabled ?? !canScrollPrev}
      className={cn(
        'absolute rounded-full',
        isVertical
          ? 'top-2 left-1/2 -translate-x-1/2 rotate-90'
          : 'top-1/2 left-2 -translate-y-1/2',
        className,
      )}
      onPress={scrollPrev}
    >
      {children ?? <ChevronLeft />}
    </Button>
  );
}

export function CarouselNext({
  className,
  variant = 'outline',
  children,
  ...props
}: CarouselArrowProps) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  const isVertical = orientation === 'vertical';

  return (
    <Button
      {...props}
      data-slot="carousel-next"
      variant={variant}
      size="icon"
      aria-label={props['aria-label'] ?? 'Next slide'}
      isDisabled={props.isDisabled ?? !canScrollNext}
      className={cn(
        'absolute rounded-full',
        isVertical
          ? 'bottom-2 left-1/2 -translate-x-1/2 rotate-90'
          : 'top-1/2 right-2 -translate-y-1/2',
        className,
      )}
      onPress={scrollNext}
    >
      {children ?? <ChevronRight />}
    </Button>
  );
}

export interface CarouselDotsProps extends HTMLAttributes<HTMLDivElement> {}

export function CarouselDots({ className, ...props }: CarouselDotsProps) {
  const { slideCount, selectedIndex, scrollTo } = useCarousel();

  if (slideCount <= 1) {
    return null;
  }

  return (
    <div
      {...props}
      data-slot="carousel-dots"
      className={cn(
        'absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5',
        className,
      )}
    >
      {Array.from({ length: slideCount }, (_, index) => (
        <button
          // biome-ignore lint/suspicious/noArrayIndexKey: each dot represents a fixed slide position
          key={`carousel-dot-${index}`}
          type="button"
          data-slot="carousel-dot"
          data-active={index === selectedIndex || undefined}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === selectedIndex ? 'true' : undefined}
          className={cn(
            'size-2 cursor-pointer rounded-full transition-colors outline-none',
            'focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
            index === selectedIndex ? 'bg-primary' : 'bg-interactive hover:bg-interactive-hover',
          )}
          onClick={() => scrollTo(index)}
        />
      ))}
    </div>
  );
}
