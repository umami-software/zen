import { TabsTrigger, TabsTrigger as LegacyTab, TabsList, Tabs } from '@umami/react-zen';
import { TabsContent } from '@umami/react-zen';

export function Mixed() {
  return (
    <Tabs>
      <TabsList>
        <LegacyTab value="a">A</LegacyTab>
        <TabsTrigger value="b">B</TabsTrigger>
      </TabsList>
      <TabsContent value="a">A</TabsContent>
      <TabsContent value="b">B</TabsContent>
    </Tabs>
  );
}
