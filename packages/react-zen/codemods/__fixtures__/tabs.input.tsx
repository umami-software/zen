import { Column, Tab, TabList, TabPanel, Tabs } from '@umami/react-zen';
import { useState } from 'react';

export function UserSettings({ t, labels }: any) {
  return (
    <Column gap="6">
      <Tabs>
        <TabList>
          <Tab id="details">{t(labels.details)}</Tab>
          <Tab id="websites">{t(labels.websites)}</Tab>
        </TabList>
        <TabPanel id="details" style={{ width: 500 }}>
          details
        </TabPanel>
        <TabPanel id="websites">websites</TabPanel>
      </Tabs>
    </Column>
  );
}

export function ControlledTabs({ tabs }: { tabs: { id: string; label: string }[] }) {
  const [tab, setTab] = useState('overview');

  return (
    <Tabs selectedKey={tab} onSelectionChange={key => setTab(key as string)}>
      <TabList>
        {tabs.map(({ id, label }) => (
          <Tab key={id} id={id}>
            {label}
          </Tab>
        ))}
      </TabList>
      <TabPanel id="overview">overview</TabPanel>
    </Tabs>
  );
}

export function DefaultTabs() {
  return (
    <Tabs defaultSelectedKey="b">
      <TabList>
        <Tab id="a">A</Tab>
        <Tab id="b">B</Tab>
      </TabList>
    </Tabs>
  );
}
