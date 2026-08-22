'use client';
import { Form, FormButtons, FormField, FormSubmitButton, TextField } from '@umami/react-zen';

export function FormLoadingExample() {
  const handleSubmit = async (values: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Submitted:', values);
  };

  return (
    <Form defaultValues={{ name: '' }} onSubmit={handleSubmit}>
      <FormField name="name" label="Name" rules={{ required: 'Name is required' }}>
        <TextField />
      </FormField>
      <FormButtons>
        <FormSubmitButton variant="primary">Save</FormSubmitButton>
      </FormButtons>
    </Form>
  );
}
