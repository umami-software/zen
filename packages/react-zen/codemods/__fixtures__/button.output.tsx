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
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button variant="secondary">Default</Button>
      <Button onClick={onClose}>
        Save
      </Button>
      <Button>Braced</Button>
      <Button variant="ghost" size="sm">
        <Icon>
          <span />
        </Icon>
      </Button>
      <Button data-test="button-delete" variant="destructive">
        Delete
      </Button>
      <Button variant="outline">
        Outline
      </Button>
      {/* TODO(zen-1.0): <Button>: variant="zero" (borderless, transparent, no hover) has no shadcn equivalent; mapped to "ghost" which HAS a hover background. Consider className="h-auto p-0 hover:bg-transparent" */}
      <Button variant="ghost" disabled={isPending}>
        Zero
      </Button>
      {/* TODO(zen-1.0): <Button>: size="xl" has no shadcn equivalent; mapped to "lg" (one step smaller) */}
      <Button variant="link" size="lg">
        Link
      </Button>
      <Button
        variant={isPending ? 'default' : 'ghost'}
        disabled={isPending}
        onClick={() => {
          onClose();
        }}
      >
        Conditional
      </Button>
      <Button variant={isPending ? 'secondary' : 'ghost'}>Conditional undefined</Button>
      {/* TODO(zen-1.0): <Button variant={...}> is not a literal; map old values by hand (default->secondary, primary->default, quiet->ghost, danger->destructive, zero->ghost) */}
      <Button variant={variant}>Non-literal</Button>
      <Button variant="secondary" {...props} onClick={onClose} />
      <Button variant="secondary" />
      <Button variant="secondary">Size only</Button>
      <Button
        variant="secondary"
        disabled={isPending}
        onClick={onClose}
      >
        Multiline no variant
      </Button>
      <Btn disabled>
        Aliased
      </Btn>
      <OtherButton variant="primary" isDisabled onPress={onClose}>
        Not zen
      </OtherButton>
      <LoadingButton variant="secondary" loading={isPending} onClick={onClose}>
        Loading
      </LoadingButton>
      <FormButtons>
        <FormResetButton variant="secondary">Reset</FormResetButton>
        <FormSubmitButton disabled={isPending}>Save</FormSubmitButton>
        <FormSubmitButton loading={isPending}>
          Save
        </FormSubmitButton>
        <FormSubmitButton variant="destructive">Delete</FormSubmitButton>
        <FormSubmitButton variant="secondary">Gray submit</FormSubmitButton>
      </FormButtons>
    </Row>
  );
}
