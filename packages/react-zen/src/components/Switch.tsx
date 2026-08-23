import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { ReactNode } from 'react';
import { Column } from './Column';
import { useFieldId } from './hooks/useFieldId';
import { Label } from './Label';
import { cn } from './lib/tailwind';
import { switchVariant } from './variants';

export interface SwitchProps
  extends Omit<
    BaseSwitch.Root.Props,
    'checked' | 'defaultChecked' | 'disabled' | 'onCheckedChange' | 'value'
  > {
  children?: ReactNode;
  label?: string;
  value?: string | boolean;
  isSelected?: boolean;
  defaultSelected?: boolean;
  isDisabled?: boolean;
  onChange?: (selected: boolean) => void;
}

export function Switch({
  label,
  children,
  className,
  isSelected,
  defaultSelected,
  isDisabled,
  onChange,
  value,
  id,
  ...props
}: SwitchProps) {
  const checked = isSelected ?? (typeof value === 'boolean' ? value : undefined);
  const styles = switchVariant();
  const fieldId = useFieldId(id);

  return (
    <Column gap="1">
      {label && <Label htmlFor={fieldId}>{label}</Label>}
      <BaseSwitch.Root
        {...props}
        id={fieldId}
        value={typeof value === 'string' ? value : undefined}
        checked={checked}
        defaultChecked={defaultSelected}
        disabled={isDisabled}
        className={cn(styles.root(), className)}
        onCheckedChange={onChange}
      >
        <span className={styles.track()}>
          <BaseSwitch.Thumb className={styles.thumb()} />
        </span>
        {children}
      </BaseSwitch.Root>
    </Column>
  );
}
