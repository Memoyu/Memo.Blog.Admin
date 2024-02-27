import { useState } from 'react';

export interface IModal {
    key?: any;
    visible: boolean;
    loading: boolean;
}

const defaultIModal: IModal = {
    key: null,
    visible: false,
    loading: false,
};

export function useModal(
    iModal: IModal = defaultIModal
): [
    key: any,
    (key: any) => void,
    visible: boolean,
    (visible: boolean) => void,
    (modal: IModal) => void,
] {
    const [modal, setModal] = useState(iModal);

    const setVisible = (visible: boolean) => {
        setModal({ ...modal, visible: visible });
    };

    const setKey = (key: any) => {
        setModal({ ...modal, key: key });
    };

    return [modal.key, setKey, modal.visible, setVisible, setModal];
}
