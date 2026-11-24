import {
  Button,
  Button as Btn,
  FormButtons,
  FormResetButton,
  FormSubmitButton,
  Icon,
  LoadingButton,
  Row,
} from '@umami/react-zen';
import { Button as OtherButton } from '@/components/common/Button';

export function Buttons({ isPending, variant, onClose, props }: any) {
  return (
    <Row gap="3">
      <Button onPress={onClose}>Cancel</Button>
      <Button variant="default">Default</Button>
      <Button variant="primary" onPress={onClose}>
        Save
      </Button>
      <Button variant={'primary'}>Braced</Button>
      <Button variant="quiet" size="sm">
        <Icon>
          <span />
        </Icon>
      </Button>
      <Button data-test="button-delete" variant="danger">
        Delete
      </Button>
      <Button variant="outline" size="md">
        Outline
      </Button>
      <Button variant="zero" isDisabled={isPending}>
        Zero
      </Button>
      <Button variant="link" size="xl">
        Link
      </Button>
      <Button
        variant={isPending ? 'primary' : 'quiet'}
        isDisabled={isPending}
        onPress={() => {
          onClose();
        }}
      >
        Conditional
      </Button>
      <Button variant={isPending ? undefined : 'quiet'}>Conditional undefined</Button>
      <Button variant={variant}>Non-literal</Button>
      <Button {...props} onPress={onClose} />
      <Button />
      <Button size="md">Size only</Button>
      <Button
        size="md"
        isDisabled={isPending}
        onPress={onClose}
      >
        Multiline no variant
      </Button>
      <Btn variant="primary" isDisabled>
        Aliased
      </Btn>
      <OtherButton variant="primary" isDisabled onPress={onClose}>
        Not zen
      </OtherButton>
      <LoadingButton isLoading={isPending} onPress={onClose}>
        Loading
      </LoadingButton>
      <FormButtons>
        <FormResetButton>Reset</FormResetButton>
        <FormSubmitButton isDisabled={isPending}>Save</FormSubmitButton>
        <FormSubmitButton variant="primary" isLoading={isPending}>
          Save
        </FormSubmitButton>
        <FormSubmitButton variant="danger">Delete</FormSubmitButton>
        <FormSubmitButton variant="default">Gray submit</FormSubmitButton>
      </FormButtons>
    </Row>
  );
}
