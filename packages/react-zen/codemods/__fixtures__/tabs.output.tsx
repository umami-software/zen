import { Column, TabsTrigger, TabsList, TabsContent, Tabs } from '@umami/react-zen';
import { useState } from 'react';

export function UserSettings({ t, labels }: any) {
  return (
    <Column gap="6">
      <Tabs>
        <TabsList>
          <TabsTrigger value="details">{t(labels.details)}</TabsTrigger>
          <TabsTrigger value="websites">{t(labels.websites)}</TabsTrigger>
        </TabsList>
        <TabsContent value="details" style={{ width: 500 }}>
          details
        </TabsContent>
        <TabsContent value="websites">websites</TabsContent>
      </Tabs>
    </Column>
  );
}

export function ControlledTabs({ tabs }: { tabs: { id: string; label: string }[] }) {
  const [tab, setTab] = useState('overview');

  return (
    <Tabs value={tab} onValueChange={key => setTab(key as string)}>
      <TabsList>
        {tabs.map(({ id, label }) => (
          <TabsTrigger key={id} value={id}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="overview">overview</TabsContent>
    </Tabs>
  );
}

export function DefaultTabs() {
  return (
    <Tabs defaultValue="b">
      <TabsList>
        <TabsTrigger value="a">A</TabsTrigger>
        <TabsTrigger value="b">B</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
