import { FC, useEffect, useState } from 'react';
import { ColorPicker, Select, TabPane, Tabs, Tooltip } from '@douyinfe/semi-ui';
import Icon, { IconTick } from '@douyinfe/semi-icons';

import { getDarken, getSaturate, getScaleColors } from '@src/utils/color';

import { optionRenderProps } from '@douyinfe/semi-ui/lib/es/select';

import './index.scss';

interface ComProps {
    base?: string;
    onChange?: (colors: string[]) => void;
}

type ColorTypeKey = 'semi' | 'custom';

const Index: FC<ComProps> = ({ base, onChange }) => {
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

    const [colorTabKey, setColorTabKey] = useState<ColorTypeKey>('semi');
    const [selectedColor, setSelectedColor] = useState<string>();
    const [pickerdColor, setPickerColor] = useState<string>('#6A3AC7');

    const [activeColor, setActiveColor] = useState<number>(5);
    const [colors, setColors] = useState<Array<string>>();

    useEffect(() => {
        // console.log('base color', base);
        let color = base;
        if (color == undefined || color.length < 1) {
            color = 'violet';
        }

        let key: ColorTypeKey = 'custom';
        if (inSemiColor(color)) key = 'semi';

        setConvertCurrentColor(color, key);
    }, [base]);

    // 是否在semi初始色阶中
    const inSemiColor = (color: string) => {
        return optionList[0].findIndex((o) => color.startsWith(o.value)) > -1;
    };

    // 生成根据主色生成颜色阶
    const setConvertCurrentColor = (val: string, key: ColorTypeKey) => {
        setSelectedColor(val);
        setColorTabKey(key);

        let colors: Array<string> = [];
        if (key == 'semi') {
            colors = Array.from({ length: 10 }, (_, i) => `${val}-${i}`);
        } else {
            setPickerColor(val);

            let lights = getScaleColors(['#ffffff', val], 20);
            // console.log('lights', lights);
            let light = lights[4];

            let dark = getDarken(val, 1.9);
            dark = getSaturate(dark, 2.3);
            let darks = getScaleColors([dark, '#000000'], 20);
            // console.log('darks', darks);
            dark = darks[6];

            // 获取前五个颜色
            let lightColors = getScaleColors([light, val], 6);
            // 获取后五个深颜色
            let darkColors = getScaleColors([val, dark], 5);

            lightColors.pop();

            // console.log('colors', lightColors, darkColors);
            colors = [...lightColors, ...darkColors];
        }

        setColors(colors);
        onChange && onChange(colors);
    };

    const getSemiColorRgba = (color: string, index: number) => {
        return `rgba(var(--semi-${color}-${index}), 1)`;
    };

    const getBlockColor = (color: string) => {
        if (colorTabKey == 'semi') {
            color = `rgba(var(--semi-${color}), 1)`;
        }

        return color;
    };

    const renderOptionItemWithColor = (renderProps: optionRenderProps) => {
        const { disabled, selected, label, value, focused, onMouseEnter, onClick } = renderProps;

        let cls =
            'semi-select-option' +
            (focused ? ' semi-select-option-focused' : '') +
            (disabled ? ' semi-select-option-disabled' : '') +
            (selected ? ' semi-select-option-selected' : '');

        let color = value as string;
        if (inSemiColor(color)) color = getSemiColorRgba(color, 5);

        return (
            <div
                style={{ display: 'flex', alignItems: 'center', fontSize: 15 }}
                className={cls}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
            >
                <Icon style={{ width: 15 }} svg={selected ? <IconTick /> : undefined} />
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
        let color = value as string;
        if (inSemiColor(color)) color = getSemiColorRgba(color, 5);
        let content = (
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 15 }}>
                <div
                    style={{
                        width: 20,
                        height: 20,
                        margin: '0 8px 0 0',
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
            <Tabs
                activeKey={colorTabKey}
                onChange={(key: string) => setColorTabKey(key as ColorTypeKey)}
            >
                <TabPane tab={'Semi色阶'} itemKey={'semi'} />
                <TabPane tab={'自定义'} itemKey={'custom'}>
                    <ColorPicker
                        value={ColorPicker.colorStringToValue(pickerdColor)}
                        alpha={false}
                        onChange={(c) => setConvertCurrentColor(c.hex, 'custom')}
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
                    optionList={colorTabKey == 'semi' ? optionList[0] : []}
                    outerTopSlot={outerTopSlotNode}
                    position="top"
                    value={selectedColor}
                    onChange={(val) => setConvertCurrentColor(val as string, 'semi')}
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
                                    (activeColor === index ? ' color-block-item-active' : '')
                                }
                                onClick={() => setActiveColor(index)}
                                style={{
                                    backgroundColor: getBlockColor(color),
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
