import { FC, useEffect, useState } from 'react';
import { ColorPicker, Tooltip } from '@douyinfe/semi-ui';

import { ColorValue } from '@douyinfe/semi-ui/lib/es/colorPicker';
import { getScaleColors } from '@src/utils/color';

import './index.scss';

interface ComProps {
    light: string;
    dark: string;
    onChange?: (colors: string[]) => void;
}

const Index: FC<ComProps> = ({ light, dark, onChange }) => {
    const [selectedColor, setSelectedColor] = useState<string>();
    const [colors, setColors] = useState<Array<string>>();
    const [colorDark, setColorDark] = useState<ColorValue>(ColorPicker.colorStringToValue(dark));
    const [colorLight, setColorLight] = useState<ColorValue>(ColorPicker.colorStringToValue(light));

    const handleGenColors = () => {
        let keys = [colorLight.hex, colorDark.hex];
        let colors = getScaleColors(keys);
        onChange && onChange(colors);
        setColors(colors);
    };

    useEffect(() => {
        handleGenColors();
    }, [colorDark, colorLight]);

    useEffect(() => {
        setColorLight(ColorPicker.colorStringToValue(light));
        setColorDark(ColorPicker.colorStringToValue(dark));
        handleGenColors();
    }, [light, dark]);

    return (
        <div className="color-scale">
            <div className="color-scale-key">
                <ColorPicker
                    value={colorLight}
                    alpha={false}
                    onChange={setColorLight}
                    usePopover={true}
                    popoverProps={{ trigger: 'click' }}
                >
                    <div
                        className="color-block"
                        style={{
                            backgroundColor: colorLight.hex,
                            color: 'black',
                        }}
                    >
                        浅
                    </div>
                </ColorPicker>
                <ColorPicker
                    value={colorDark}
                    alpha={false}
                    onChange={setColorDark}
                    usePopover={true}
                    popoverProps={{ trigger: 'click' }}
                >
                    <div
                        className="color-block"
                        style={{
                            marginLeft: 10,
                            backgroundColor: colorDark.hex,
                        }}
                    >
                        深
                    </div>
                </ColorPicker>
            </div>

            <div className="color-scale-block-list">
                {colors?.map((color, index) => {
                    return (
                        <Tooltip content={color}>
                            <div
                                key={index + color}
                                className={
                                    `color-block color-block-item` +
                                    (selectedColor === color ? ' color-block-item-active' : '')
                                }
                                onClick={() => setSelectedColor(color)}
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
