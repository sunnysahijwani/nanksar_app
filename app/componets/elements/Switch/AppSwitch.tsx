import { Switch } from '@ant-design/react-native'
import React from 'react'
import { View } from 'react-native'

type AppSwitchProps = {
    switchProps: any;
}

export default function AppSwitch({
    switchProps,

}: AppSwitchProps) {
    return (
        <View>
            <Switch {...switchProps} />
        </View>
    )
}
