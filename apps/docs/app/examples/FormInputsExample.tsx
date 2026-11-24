'use client';
import {
  Checkbox,
  Form,
  FormButtons,
  FormField,
  FormResetButton,
  FormSubmitButton,
  Label,
  List,
  ListItem,
  PasswordField,
  RadioGroup,
  RadioGroupItem,
  Row,
  SearchField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Switch,
  TextField,
  Toggle,
} from '@umami/react-zen';
import { Bold } from 'lucide-react';

const defaultValues = {
  name: '',
  bio: '',
  password: '',
  search: '',
  select: null,
  checkbox: false,
  radio: '',
  toggle: false,
  switch: false,
  slider: [50],
  list: [],
};

const options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' },
];

export function FormInputsExample() {
  const handleSubmit = (values: any) => {
    console.log({ values });
  };

  return (
    <Form defaultValues={defaultValues} onSubmit={handleSubmit}>
      <FormField name="name" label="Name">
        <TextField autoComplete="off" />
      </FormField>
      <FormField name="bio" label="Bio">
        <TextField autoComplete="off" asTextArea />
      </FormField>
      <FormField name="password" label="Password">
        <PasswordField autoComplete="off" />
      </FormField>
      <FormField name="search" label="Search">
        <SearchField autoComplete="off" />
      </FormField>
      <FormField name="select" label="Select">
        <Select items={options}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField name="checkbox" label="Checkbox" orientation="horizontal">
        <Checkbox />
      </FormField>
      <FormField name="radio" label="Radio">
        <RadioGroup>
          {options.map(option => (
            <Row key={option.value} alignItems="center" gap="2">
              <RadioGroupItem id={`radio-${option.value}`} value={option.value} />
              <Label htmlFor={`radio-${option.value}`}>{option.label}</Label>
            </Row>
          ))}
        </RadioGroup>
      </FormField>
      <FormField name="toggle" label="Toggle">
        <Toggle variant="outline" aria-label="Bold">
          <Bold />
        </Toggle>
      </FormField>
      <FormField name="switch" label="Switch" orientation="horizontal">
        <Switch />
      </FormField>
      <FormField name="slider" label="Slider">
        <Slider />
      </FormField>
      <FormField name="list" label="List">
        <List selectionMode="multiple">
          <ListItem value="one">One</ListItem>
          <ListItem value="two">Two</ListItem>
          <ListItem value="three">Three</ListItem>
          <ListItem value="four">Four</ListItem>
          <ListItem value="five">Five</ListItem>
        </List>
      </FormField>
      <FormButtons>
        <FormResetButton>Reset</FormResetButton>
        <FormSubmitButton>Submit</FormSubmitButton>
      </FormButtons>
    </Form>
  );
}
