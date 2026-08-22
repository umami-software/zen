import {
  Form,
  FormButtons,
  FormField,
  FormResetButton,
  FormSubmitButton,
  TextField,
} from '@umami/react-zen';

export function FormValidationExample() {
  const validateAge = (value: number) => {
    if (Number.isNaN(Number(value))) return 'Must enter a number';
    if (value <= 18) return 'You must be older than 18';
    if (value >= 100) return 'Age must be less than 100';
    return true;
  };

  return (
    <Form onSubmit={values => console.log(values)}>
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
        <FormSubmitButton isDisabled={false}>Submit</FormSubmitButton>
      </FormButtons>
    </Form>
  );
}
