import * as Zen from '@umami/react-zen';
import { Alert, AlertTitle, Badge } from '@umami/react-zen';

export function Status({ enabled }: any) {
  return (
    <Zen.Column>
      <Badge>Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant={enabled ? 'outline' : 'red'}>Palette</Badge>
      <Alert variant="danger">
        <AlertTitle>Oops</AlertTitle>
      </Alert>
      <Zen.Button variant="quiet" onPress={() => {}}>
        Namespaced
      </Zen.Button>
      <Zen.Tabs selectedKey="a">
        <Zen.TabList>
          <Zen.Tab id="a">A</Zen.Tab>
        </Zen.TabList>
      </Zen.Tabs>
    </Zen.Column>
  );
}
