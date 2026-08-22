'use client';
import { Form, FormButtons, FormField, FormSubmitButton, TextField } from '@umami/react-zen';
import { useState } from 'react';

export function FormErrorExample() {
  const [error, setError] = useState<string | null>('Invalid credentials. Please try again.');

  const handleSubmit = async (values: any) => {
    // Simulate API error
    setError('Invalid credentials. Please try again.');
    console.log(values);
  };

  return (
    <Form defaultValues={{ email: '' }} error={error} onSubmit={handleSubmit}>
      <FormField name="email" label="Email">
        <TextField />
      </FormField>
      <FormButtons>
        <FormSubmitButton variant="primary">Submit</FormSubmitButton>
      </FormButtons>
    </Form>
  );
}
