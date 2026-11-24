import { TabsTrigger, Tab as LegacyTab, TabList, Tabs } from '@umami/react-zen';
import { TabPanel } from '@umami/react-zen';
import { TabsContent } from '@umami/react-zen';

export function Mixed() {
  return (
    <Tabs>
      <TabList>
        <LegacyTab id="a">A</LegacyTab>
        <TabsTrigger value="b">B</TabsTrigger>
      </TabList>
      <TabPanel id="a">A</TabPanel>
      <TabsContent value="b">B</TabsContent>
    </Tabs>
  );
}
