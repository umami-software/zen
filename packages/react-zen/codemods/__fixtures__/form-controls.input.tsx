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
        isSelected={isEnabled}
        isDisabled={isEnabled && isRequired}
        onChange={value => setValue('allowFilter', value, { shouldDirty: true })}
      />
      <Switch isSelected={watch('allowFilter')} onChange={onChange}>
        Allow filter
      </Switch>
      <FormField name="filters">
        <Checkbox>Filters</Checkbox>
      </FormField>
      <Checkbox
        isSelected={value}
        defaultSelected={false}
        isIndeterminate={!value}
        onChange={onChange}
      />
      <TextField value={value} onChange={onChange} autoComplete="off" />
      <TextField value={value} isReadOnly allowCopy />
      <TextField
        value={String(value ?? '')}
        onChange={(value: string) => onChange(value)}
        isRequired
        isInvalid={!value}
      />
      <PasswordField onChange={onChange} />
      <SearchField value={value} onSearch={onChange} delay={300} />
      <SearchField onChange={onChange} />
      <NumberField value={1} onChange={onChange} />
      <Toggle isSelected={value} onChange={onChange} size="md">
        B
      </Toggle>
      <ToggleGroup
        value={[value]}
        onChange={e => {
          onChange?.(e[0]);
        }}
      >
        {items.map(({ id, label }: any) => (
          <ToggleGroupItem key={id} id={id}>
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ToggleGroup selectedKeys={new Set(['a'])} onSelectionChange={onChange}>
        <ToggleGroupItem id="a" value="a">
          A
        </ToggleGroupItem>
      </ToggleGroup>
      <Switch isDisabled disabled={false} />
    </Column>
  );
}
