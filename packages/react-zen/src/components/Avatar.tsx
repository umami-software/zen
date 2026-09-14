import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './lib/tailwind';
import { type AvatarVariants, avatar } from './variants';

export interface AvatarProps extends BaseAvatar.Root.Props {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  size?: AvatarVariants['size'];
}

function getInitials(name?: string) {
  if (!name) {
    return null;
  }
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word.charAt(0))
    .join('');
}

export function Avatar({ src, alt, fallback, size, className, children, ...props }: AvatarProps) {
  const styles = avatar({ size });

  return (
    <BaseAvatar.Root
      {...props}
      data-slot="avatar"
      data-size={size ?? 'md'}
      className={cn(styles.root(), className)}
    >
      {src && <AvatarImage src={src} alt={alt} className={styles.image()} />}
      <AvatarFallback className={styles.fallback()}>{fallback ?? getInitials(alt)}</AvatarFallback>
      {children}
    </BaseAvatar.Root>
  );
}

export interface AvatarImageProps extends BaseAvatar.Image.Props {}

export function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <BaseAvatar.Image
      {...props}
      data-slot="avatar-image"
      className={cn('aspect-square size-full object-cover', className)}
    />
  );
}

export interface AvatarFallbackProps extends BaseAvatar.Fallback.Props {}

export function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <BaseAvatar.Fallback
      {...props}
      data-slot="avatar-fallback"
      className={cn(
        'flex size-full items-center justify-center font-medium uppercase text-fg',
        className,
      )}
    />
  );
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {}

/** Overlapping stack of `Avatar`s. */
export function AvatarGroup({ className, ...props }: AvatarGroupProps) {
  return (
    <div
      {...props}
      data-slot="avatar-group"
      className={cn(
        'flex items-center -space-x-2',
        '*:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-surface',
        className,
      )}
    />
  );
}
