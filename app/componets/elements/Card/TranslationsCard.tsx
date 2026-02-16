import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Accordion, List } from '@ant-design/react-native'
import AppSwitch from '../Switch/AppSwitch';
import { style } from '../../../screens/splash/style';


const Item = List.Item



// this card help to switch on or off the translations
export default function TranslationsCard() {

    const [activeSections, setActiveSections] = useState([]);
    const translations = [
        {
            key: 'English Translation',
            value: 'english',
        },
        {
            key: 'Punjabi Translation',
            value: 'punjabi',
        },
        {
            key: 'Hindi Translation',
            value: 'hindi',
        },
    ]

    const MySwitch = () => {
        return (
            <AppSwitch

                switchProps={
                    {
                        onChange: () => { },
                        style: styles.switch
                    }
                }
            />
        )
    }

    return (
        <View>
            <Accordion
                activeSections={activeSections}
                onChange={(sections: any) => setActiveSections(sections)}
                duration={400}
            >
                <Accordion.Panel header="Translation">
                    <List>
                        {translations.map((translation) => (
                            <Item
                                extra={<MySwitch />}
                                key={translation.key}>
                                {translation.key}
                            </Item>
                        ))}

                    </List>
                </Accordion.Panel>
            </Accordion>
        </View>
    )
}


const styles = StyleSheet.create({
    switch: {
        fontSize: 10
    }
})