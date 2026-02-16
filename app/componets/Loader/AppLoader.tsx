import React from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Modal,
} from 'react-native';

type Props = {
    visible?: boolean;
    fullScreen?: boolean;
    size?: 'small' | 'large';
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inline: {
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const AppLoader: React.FC<Props> = ({
    visible = true,
    fullScreen = false,
    size = 'large',
}) => {
    if (!visible) return null;

    if (fullScreen) {
        return (
            <Modal transparent animationType="fade">
                <View style={styles.overlay}>
                    <ActivityIndicator size={size} />
                </View>
            </Modal>
        );
    }

    return (
        <View style={styles.inline}>
            <ActivityIndicator size={size} />
        </View>
    );
};

export default AppLoader;
