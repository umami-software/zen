'use client';
import {
  Button,
  Column,
  Form,
  FormButtons,
  FormController,
  FormFieldArray,
  FormResetButton,
  FormSubmitButton,
  Row,
  TextField,
} from '@umami/react-zen';

const defaultValues = { items: [{ name: 'Item 1' }] };

export function FormFieldArrayExample() {
  const handleSubmit = (values: any) => {
    console.log({ values });
  };

  return (
    <Form defaultValues={defaultValues} onSubmit={handleSubmit}>
      <FormFieldArray name="items" label="Items">
        {({ fields, append, remove, control }) => {
          return (
            <Column gap>
              {fields.map((field: any, index: number) => {
                return (
                  <Row key={field.id} gap>
                    <FormController control={control} name={`items.${index}.name`}>
                      {({ field }) => {
                        return (
                          <TextField
                            name={`items.${index}.name`}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        );
                      }}
                    </FormController>
                    <Button onPress={() => remove(index)}>Remove</Button>
                  </Row>
                );
              })}
              <Button onPress={() => append({ name: `Item ${fields.length + 1}` })}>Add</Button>
            </Column>
          );
        }}
      </FormFieldArray>
      <FormButtons>
        <FormResetButton>Reset</FormResetButton>
        <FormSubmitButton variant="primary">Submit</FormSubmitButton>
      </FormButtons>
    </Form>
  );
}
