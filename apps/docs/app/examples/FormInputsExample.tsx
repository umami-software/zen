'use client';
import {
  Checkbox,
  Form,
  FormButtons,
  FormField,
  FormResetButton,
  FormSubmitButton,
  List,
  ListItem,
  PasswordField,
  Radio,
  RadioGroup,
  SearchField,
  Select,
  Slider,
  Switch,
  TextField,
  Toggle,
} from '@umami/react-zen';

const defaultValues = {
  name: '',
  bio: '',
  password: '',
  search: '',
  select: '',
  checkbox: false,
  radio: '',
  toggle: '',
  switch: false,
  slider: 0,
  list: [],
};

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
        <Select items={['One', 'Two', 'Three']} />
      </FormField>
      <FormField name="checkbox" label="Checkbox">
        <Checkbox>Checkbox</Checkbox>
      </FormField>
      <FormField name="radio" label="Radio">
        <RadioGroup>
          <Radio value="one">Option one</Radio>
          <Radio value="two">Option two</Radio>
          <Radio value="three">Option three</Radio>
        </RadioGroup>
      </FormField>
      <FormField name="toggle" label="Toggle">
        <Toggle>B</Toggle>
      </FormField>
      <FormField name="switch" label="Switch">
        <Switch />
      </FormField>
      <FormField name="slider" label="Slider">
        <Slider />
      </FormField>
      <FormField name="list" label="List">
        <List selectionMode="multiple">
          <ListItem id="one">One</ListItem>
          <ListItem id="two">Two</ListItem>
          <ListItem id="three">Three</ListItem>
          <ListItem id="four">Four</ListItem>
          <ListItem id="five">Five</ListItem>
        </List>
      </FormField>
      <FormButtons>
        <FormResetButton>Reset</FormResetButton>
        <FormSubmitButton variant="primary">Submit</FormSubmitButton>
      </FormButtons>
    </Form>
  );
}
