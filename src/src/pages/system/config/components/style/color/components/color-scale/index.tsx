import { FC, useEffect, useState } from 'react';
import './index.scss';
import { ColorPicker, Select, TabPane, Tabs, Tooltip } from '@douyinfe/semi-ui';
import Icon, { IconTick } from '@douyinfe/semi-icons';

import { getDarken, getSaturate, getScaleColors } from '@src/utils/color';

import { optionRenderProps } from '@douyinfe/semi-ui/lib/es/select';

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

    const [color, setColor] = useState<string>();

    const [colorTabKey, setColorTabKey] = useState<ColorTypeKey>('semi');
    const [selectedColor, setSelectedColor] = useState<string>();
    const [pickerdColor, setPickerColor] = useState<string>();

    const [activeColor, setActiveColor] = useState<number>(5);
    const [colors, setColors] = useState<Array<string>>();

    useEffect(() => {
        //console.log('外部基础色变更', base);
        let key: ColorTypeKey = 'custom';
        if (!base || inSemiColor(base)) key = 'semi';
        setColorTabKey(key);

        setColor(base);
    }, [base]);

    useEffect(() => {
        //console.log('内部基础色变更', color);
        setConvertCurrentColor(color);
    }, [color]);

    // 是否在semi初始色阶中
    const inSemiColor = (color?: string) => {
        if (!color) return false;
        return optionList[0].findIndex((o) => color.startsWith(o.value)) > -1;
    };

    // 生成根据主色生成颜色阶
    const setConvertCurrentColor = (color?: string) => {
        //console.log('生成色阶', color);
        setSelectedColor(color);

        let colors: Array<string> = [];
        if (color) {
            if (colorTabKey == 'semi') {
                colors = Array.from({ length: 10 }, (_, i) => `${color}-${i}`);
            } else {
                setPickerColor(color);

                // console.log('color', color);

                let lights = getScaleColors(['#ffffff', color], 20);
                // console.log('lights', lights);
                let light = lights[4];

                let dark = getDarken(color, 1.9);
                dark = getSaturate(dark, 2.3);
                let darks = getScaleColors([dark, '#000000'], 20);
                // console.log('darks', darks);
                dark = darks[6];

                // 获取前五个颜色
                let lightColors = getScaleColors([light, color], 6);
                // 获取后五个深颜色
                let darkColors = getScaleColors([color, dark], 5);

                lightColors.pop();

                // console.log('colors', lightColors, darkColors);
                colors = [...lightColors, ...darkColors];
            }
        }

        setColors(colors);
        onChange && onChange(colors);
    };

    // 构造semi预设rgba
    const getSemiColorRgba = (color: string, index: number) => {
        return `rgba(var(--semi-${color}-${index}), 1)`;
    };

    // 获取色阶色块颜色
    const getBlockColor = (color: string) => {
        if (colorTabKey == 'semi') color = `rgba(var(--semi-${color}), 1)`;
        return color;
    };

    // 渲染semi预设色阶选项
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

    // 渲染主颜色选中项
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
                        value={
                            pickerdColor == undefined
                                ? pickerdColor
                                : ColorPicker.colorStringToValue(pickerdColor)
                        }
                        alpha={false}
                        onChange={(c) => setColor(c.hex)}
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
                    onSelect={(val) => setColor(val as string)}
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
