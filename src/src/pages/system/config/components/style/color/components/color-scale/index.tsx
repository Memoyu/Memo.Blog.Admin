import { FC, useEffect, useState } from 'react';
import { ColorPicker, Select, TabPane, Tabs, Tooltip } from '@douyinfe/semi-ui';

import {
    getBrighten,
    getDarken,
    getDesaturate,
    getSaturate,
    getScaleColors,
} from '@src/utils/color';

import './index.scss';
import { optionRenderProps } from '@douyinfe/semi-ui/lib/es/select';
import Icon, { IconTick } from '@douyinfe/semi-icons';

interface ComProps {
    light: string;
    dark: string;
    onChange?: (colors: string[]) => void;
}

const Index: FC<ComProps> = ({ light, dark, onChange }) => {
    const optionList = [
        [
            { value: 'amber', label: 'amber' },
            { value: 'blue', label: 'blue' },
            { value: 'cyan', label: 'cyan' },
            { value: 'green', label: 'green' },
            { value: 'grey', label: 'grey' },
            { value: 'indigo', label: 'indigo' },
            { value: 'light-blue', label: 'light-blue' },
            { value: 'light-green', label: 'light-green' },
            { value: 'lime', label: 'lime' },
            { value: 'orange', label: 'orange' },
            { value: 'pink', label: 'pink' },
            { value: 'purple', label: 'purple' },
            { value: 'red', label: 'red' },
            { value: 'teal', label: 'teal' },
            { value: 'violet', label: 'violet' },
            { value: 'yellow', label: 'yellow' },
        ],
        [],
    ];

    const [colorTabKey, setColorTabKey] = useState('0');
    const [selectedColor, setSelectedColor] = useState<string>('#4183aa');
    const [pickerdColor, setPickerColor] = useState<string>('#9E28B3');

    const [activeColor, setActiveColor] = useState<string>();
    const [colors, setColors] = useState<Array<string>>();
    const [colorDark, setColorDark] = useState<string>();
    const [colorLight, setColorLight] = useState<string>();

    const handleGenColors = () => {
        if (
            colorLight == undefined ||
            colorDark == undefined ||
            colorLight == '' ||
            colorDark == ''
        )
            return;
        let keys = [colorLight, colorDark];
        // console.log('keys', keys);
        let colors = getScaleColors(keys);
        onChange && onChange(colors);
        setColors(colors);
    };
    useEffect(() => {
        setConvertCurrentColor('#38AA43', '1');
    }, [light]);

    const setConvertCurrentColor = (val: string, key: string) => {
        setSelectedColor(val);
        setColorTabKey(key);

        console.log('key', key);

        if (key == '0') {
            setColors(Array.from({ length: 10 }, (_, i) => `rgba(var(--semi-${val}-${i}), 1)`));
        } else {
            setPickerColor(val);

            let lights = getScaleColors(['#ffffff', val], 20);
            // console.log('lights', lights);
            let light = lights[4];

            let darkTemp = getDarken(val, 1.9);
            darkTemp = getSaturate(darkTemp, 2.3);
            let darks = getScaleColors([darkTemp, '#000000'], 20);
            // console.log('darks', darks);
            let dark = darks[6];

            // // 获取后五个深颜色
            let lightColors = getScaleColors([light, val], 6);
            let darkColors = getScaleColors([val, dark], 5);

            lightColors.pop();
            setColors([...lightColors, ...darkColors]);
            //setColors([...darks]);
        }
    };

    const renderOptionItemWithColor = (renderProps: optionRenderProps) => {
        const { disabled, selected, label, value, focused, onMouseEnter, onClick } = renderProps;

        let cls =
            'semi-select-option' +
            (focused ? ' semi-select-option-focused' : '') +
            (disabled ? ' semi-select-option-disabled' : '') +
            (selected ? ' semi-select-option-selected' : '');

        let color = `rgba(var(--semi-${value}-5), 1)`;
        if (optionList[0].findIndex((o) => o.value == value) < 0) color = value as string;

        return (
            <div
                style={{ display: 'flex', alignItems: 'center', fontSize: 15 }}
                className={cls}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
            >
                <Icon style={{ width: 12 }} svg={selected ? <IconTick /> : undefined} />
                <div
                    style={{
                        width: 20,
                        height: 20,
                        margin: '0 8px',
                        borderRadius: 9999,
                        backgroundColor: color,
                    }}
                />
                {label}
            </div>
        );
    };

    const renderSelectItemWithColor = (optionNode: Record<string, any>) => {
        let value = optionNode.value;
        let color = `rgba(var(--semi-${value}-5), 1)`;
        if (optionList[0].findIndex((o) => o.value == value) < 0) color = value as string;
        let content = (
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 15 }}>
                <div
                    style={{
                        width: 20,
                        height: 20,
                        margin: '0 8px',
                        borderRadius: 9999,
                        backgroundColor: color,
                    }}
                />
                {optionNode.label}
            </div>
        );
        return content;
    };

    const outerTopSlotNode = (
        <div style={{ margin: 10 }}>
            <Tabs activeKey={colorTabKey} onChange={(key: string) => setColorTabKey(key)}>
                <TabPane tab={'Semi色阶'} itemKey="0" />
                <TabPane tab={'自定义'} itemKey="1">
                    <ColorPicker
                        value={ColorPicker.colorStringToValue(pickerdColor)}
                        alpha={false}
                        onChange={(c) => setConvertCurrentColor(c.hex, '1')}
                    />
                </TabPane>
            </Tabs>
        </div>
    );

    return (
        <div className="color-scale">
            <div className="color-scale-key">
                <Select
                    placeholder="选择颜色"
                    optionList={optionList[Number(colorTabKey)]}
                    outerTopSlot={outerTopSlotNode}
                    position="top"
                    value={selectedColor}
                    onChange={(val) => val && setConvertCurrentColor(val.toString(), '0')}
                    emptyContent={<></>}
                    maxHeight={344}
                    style={{ width: 150 }}
                    dropdownStyle={{ width: 300 }}
                    renderOptionItem={renderOptionItemWithColor}
                    renderSelectedItem={renderSelectItemWithColor}
                />
            </div>

            <div className="color-scale-block-list">
                {colors?.map((color, index) => {
                    return (
                        <Tooltip content={color} key={index + color}>
                            <div
                                className={
                                    `color-block color-block-item` +
                                    (activeColor === color ? ' color-block-item-active' : '')
                                }
                                onClick={() => setActiveColor(color)}
                                style={{
                                    backgroundColor: color,
                                }}
                            >
                                <div
                                    className="color-block-index"
                                    style={{ color: index <= 5 ? 'black' : 'white' }}
                                >
                                    {index}
                                </div>
                            </div>
                        </Tooltip>
                    );
                })}
            </div>
        </div>
    );
};

export default Index;
