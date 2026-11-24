'use client';
import {
  Form,
  FormButtons,
  FormField,
  FormResetButton,
  FormSubmitButton,
  TextField,
} from '@umami/react-zen';

export function FormValidationExample() {
  const validateAge = (value: string) => {
    const age = Number(value);
    if (Number.isNaN(age)) return 'Must enter a number';
    if (age <= 18) return 'You must be older than 18';
    if (age >= 100) return 'Age must be less than 100';
    return true;
  };

  return (
    <Form defaultValues={{ name: '', age: '' }} onSubmit={values => console.log(values)}>
      <FormField name="name" label="Name" rules={{ required: 'Name is required' }}>
        <TextField />
      </FormField>
      <FormField
        name="age"
        label="Age"
        rules={{ required: 'Age is required', validate: validateAge }}
      >
        <TextField />
      </FormField>
      <FormButtons>
        <FormResetButton>Reset</FormResetButton>
        <FormSubmitButton>Submit</FormSubmitButton>
      </FormButtons>
    </Form>
  );
}
