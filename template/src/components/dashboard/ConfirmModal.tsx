import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import Translate from '../../hooks/Translate';
import { ConfirmModalStyles } from './DashboardStyles';

interface ConfirmModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal = React.memo<ConfirmModalProps>(({
    visible,
    onConfirm,
    onCancel,
}) => (
    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onCancel}
    >
        <View style={ConfirmModalStyles.centeredView}>
            <View style={ConfirmModalStyles.modalView}>
                <Text style={ConfirmModalStyles.modalText}>
                    {Translate('You want to open screen ?')}
                </Text>
                <View style={ConfirmModalStyles.buttonContainer}>
                    <Pressable
                        style={[ConfirmModalStyles.button, ConfirmModalStyles.buttonClose]}
                        onPress={onConfirm}
                    >
                        <Text style={ConfirmModalStyles.textStyle}>
                            {Translate('Open')}
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[ConfirmModalStyles.button, ConfirmModalStyles.buttonClose]}
                        onPress={onCancel}
                    >
                        <Text style={ConfirmModalStyles.textStyle}>
                            {Translate('Cancel')}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    </Modal>
));

ConfirmModal.displayName = 'ConfirmModal';

