// Run with --wrappers=LinkButton: no @umami/react-zen import is needed in this file.
import { LinkButton } from '@/components/common/LinkButton';
import { PageHeader } from '@/components/common/PageHeader';

export function Header({ websiteId, isPending }: any) {
  return (
    <PageHeader title="Website">
      <LinkButton href={`/websites/${websiteId}`} variant="quiet">
        View
      </LinkButton>
      <LinkButton href="/new" variant="primary">
        New
      </LinkButton>
      <LinkButton href="/x" variant={isPending ? 'primary' : 'danger'}>
        X
      </LinkButton>
      <LinkButton href="/settings">Settings</LinkButton>
      <PageHeader title="nested" variant="quiet" />
    </PageHeader>
  );
}
