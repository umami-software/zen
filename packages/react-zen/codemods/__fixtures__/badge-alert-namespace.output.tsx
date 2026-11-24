import * as Zen from '@umami/react-zen';
import { Alert, AlertTitle, Badge } from '@umami/react-zen';

export function Status({ enabled }: any) {
  return (
    <Zen.Column>
      <Badge variant="secondary">Default</Badge>
      <Badge>Primary</Badge>
      <Badge variant="destructive">Error</Badge>
      {/* TODO(zen-1.0): <Badge>: Badge variant "success" does not exist in shadcn Badge (default/secondary/destructive/outline/ghost/link); use className for color */}
      <Badge variant="success">Success</Badge>
      {/* TODO(zen-1.0): <Badge>: Badge variant "red" does not exist in shadcn Badge (default/secondary/destructive/outline/ghost/link); use className for color */}
      <Badge variant={enabled ? 'outline' : 'red'}>Palette</Badge>
      <Alert variant="destructive">
        <AlertTitle>Oops</AlertTitle>
      </Alert>
      <Zen.Button variant="ghost" onClick={() => {}}>
        Namespaced
      </Zen.Button>
      <Zen.Tabs value="a">
        <Zen.TabsList>
          <Zen.TabsTrigger value="a">A</Zen.TabsTrigger>
        </Zen.TabsList>
      </Zen.Tabs>
    </Zen.Column>
  );
}
