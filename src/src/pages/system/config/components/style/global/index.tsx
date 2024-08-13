import { FC, useEffect, useState } from 'react';
import { Form, Typography, Button, Space, ColorPicker, Tooltip } from '@douyinfe/semi-ui';

import { ColorValue } from '@douyinfe/semi-ui/lib/es/colorPicker';
import { getScaleColors } from '@src/utils/color';

import './index.scss';

const { Section } = Form;
const { Text } = Typography;

const Index: FC = () => {
    const [selectedColor, setSelectedColor] = useState<string>();
    const [colors, setColors] = useState<Array<string>>();
    const [colorFirst, setColorFirst] = useState<ColorValue>(
        ColorPicker.colorStringToValue('#002f61')
    );
    const [colorLast, setColorLast] = useState<ColorValue>(
        ColorPicker.colorStringToValue('#ffff00')
    );

    const handleGenColors = () => {
        let keys = [colorFirst.hex, colorLast.hex];
        let colors = getScaleColors(keys);
        // console.log(colors, keys);
        setColors(colors);
    };

    useEffect(() => {
        handleGenColors();
    }, [colorFirst, colorLast]);

    return (
        <div className="config-global-style">
            <Section text={'主题色'}>
                <div style={{ display: 'flex' }}>
                    <ColorPicker
                        value={colorFirst}
                        alpha={false}
                        onChange={setColorFirst}
                        usePopover={true}
                        popoverProps={{ trigger: 'click' }}
                    />

                    <Text strong style={{ fontSize: 15 }}>
                        --
                    </Text>
                    <ColorPicker
                        value={colorLast}
                        alpha={false}
                        onChange={setColorLast}
                        usePopover={true}
                        popoverProps={{ trigger: 'click' }}
                    />
                </div>

                <div className="color-block-list">
                    {colors?.map((color, index) => {
                        return (
                            <Tooltip content={color}>
                                <div
                                    key={index + color}
                                    className={
                                        `color-block` +
                                        (selectedColor === color ? ' color-block-active' : '')
                                    }
                                    onClick={() => setSelectedColor(color)}
                                    style={{
                                        backgroundColor: color,
                                    }}
                                >
                                    <div className="color-block-index">{index}</div>
                                </div>
                            </Tooltip>
                        );
                    })}
                </div>
            </Section>
        </div>
    );
};

export default Index;
