import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Accordion, List } from '@ant-design/react-native';
import AppSwitch from '../Switch/AppSwitch';
import { useAppContext } from '../../../context/AppContext';
import { DisplayPreferences } from '../../../context/AppContext';

const Item = List.Item;

type TranslationsCardProps = {
  title: string;
  items: { label: string; preferenceKey: keyof DisplayPreferences }[];
};

export default function TranslationsCard({ title, items }: TranslationsCardProps) {
  const [activeSections, setActiveSections] = React.useState([]);
  const { displayPreferences, setDisplayPreference } = useAppContext();
  console.log(activeSections);
  
  return (
    <View>
      <Accordion
        activeSections={activeSections}
        onChange={(sections: any) => setActiveSections(sections)}
        duration={400}
      >
        <Accordion.Panel header={title}>
          <List>
            {items.map(item => (
              <Item
                extra={
                  <AppSwitch
                    switchProps={{
                      checked: displayPreferences[item.preferenceKey],
                      onChange: (val: boolean) =>
                        setDisplayPreference(item.preferenceKey, val),
                      style: styles.switch,
                    }}
                  />
                }
                key={item.label}
              >
                {item.label}
              </Item>
            ))}
          </List>
        </Accordion.Panel>
      </Accordion>
    </View>
  );
}

const styles = StyleSheet.create({
  switch: {
    fontSize: 10,
  },
});
