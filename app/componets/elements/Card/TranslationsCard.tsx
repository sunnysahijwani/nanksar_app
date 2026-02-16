import React from 'react'
import { View } from 'react-native'
import { List } from '@ant-design/react-native'


const Item = List.Item

// this card help to switch on or off the translations
export default function TranslationsCard() {
    return (
        <View>
            {/* <List> */}
            <Item wrap
                arrow="horizontal"
            >
                Translation
            </Item>
            {/* </List> */}
        </View>
    )
}
