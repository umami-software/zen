import {
  Checkbox,
  Column,
  FormField,
  NumberField,
  PasswordField,
  SearchField,
  Switch,
  TextField,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
} from '@umami/react-zen';

export function Controls({ watch, setValue, value, onChange, items, isEnabled, isRequired }: any) {
  return (
    <Column>
      <Switch
        checked={isEnabled}
        disabled={isEnabled && isRequired}
        onCheckedChange={value => setValue('allowFilter', value, { shouldDirty: true })}
      />
      {/* TODO(zen-1.0): <Switch> children are no longer rendered as a label (shadcn Switch ignores children). Wrap in <Label> / <Field orientation="horizontal"> with the text as a sibling */}
      <Switch checked={watch('allowFilter')} onCheckedChange={onChange}>
        Allow filter
      </Switch>
      <FormField name="filters">
        {/* TODO(zen-1.0): <Checkbox> children are no longer rendered as a label (shadcn Checkbox ignores children). Wrap in <Label> / <Field orientation="horizontal"> with the text as a sibling */}
        <Checkbox>Filters</Checkbox>
      </FormField>
      <Checkbox
        checked={value}
        defaultChecked={false}
        indeterminate={!value}
        onCheckedChange={onChange}
      />
      <TextField value={value} onValueChange={onChange} autoComplete="off" />
      <TextField value={value} readOnly allowCopy />
      <TextField
        value={String(value ?? '')}
        onValueChange={(value: string) => onChange(value)}
        required
        aria-invalid={!value}
      />
      <PasswordField onValueChange={onChange} />
      <SearchField value={value} onSearch={onChange} delay={300} />
      <SearchField onValueChange={onChange} />
      <NumberField value={1} onValueChange={onChange} />
      <Toggle pressed={value} onPressedChange={onChange}>
        B
      </Toggle>
      <ToggleGroup
        value={[value]}
        onValueChange={e => {
          onChange?.(e[0]);
        }}
      >
        {items.map(({ id, label }: any) => (
          <ToggleGroupItem key={id} value={id}>
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {/* TODO(zen-1.0): <ToggleGroup selectedKeys> -> value: value is now a string[] (was a Set/Iterable); check the value / callback argument */}
      {/* TODO(zen-1.0): <ToggleGroup onSelectionChange> -> onValueChange: value is now a string[] (was a Set/Iterable); check the value / callback argument */}
      <ToggleGroup value={new Set(['a'])} onValueChange={onChange}>
        <ToggleGroupItem id="a" value="a">
          A
        </ToggleGroupItem>
      </ToggleGroup>
      {/* TODO(zen-1.0): <Switch> has both isDisabled and disabled; merge them by hand */}
      <Switch isDisabled disabled={false} />
    </Column>
  );
}
