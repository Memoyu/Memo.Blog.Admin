import { FC, useEffect, useState } from 'react';
import { ColorPicker, Tooltip } from '@douyinfe/semi-ui';

import { getBrighten, getScaleColors } from '@src/utils/color';

import './index.scss';

interface ComProps {
    light: string;
    dark: string;
    onChange?: (colors: string[]) => void;
}

const Index: FC<ComProps> = ({ light, dark, onChange }) => {
    const [selectedColor, setSelectedColor] = useState<string>();
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
        console.log('keys', keys);
        let colors = getScaleColors(keys);
        onChange && onChange(colors);
        setColors(colors);
    };

    useEffect(() => {
        handleGenColors();
    }, [colorDark, colorLight]);

    useEffect(() => {
        let li = getBrighten(dark);
        console.log('li', li);
        setColorLight(li);
        setColorDark(dark);

        handleGenColors();
    }, [light, dark]);

    const stringToColor = (str?: string) => {
        if (str == undefined || str == '') str = '#4E31AA';
        return ColorPicker.colorStringToValue(str);
    };

    return (
        <div className="color-scale">
            <div className="color-scale-key">
                <ColorPicker
                    value={stringToColor(colorLight)}
                    alpha={false}
                    onChange={(c) => setColorLight(c.hex)}
                    usePopover={true}
                    popoverProps={{ trigger: 'click' }}
                >
                    <div
                        className="color-block"
                        style={{
                            backgroundColor: colorLight,
                            color: 'black',
                        }}
                    >
                        浅
                    </div>
                </ColorPicker>
                <ColorPicker
                    value={stringToColor(colorDark)}
                    alpha={false}
                    onChange={(c) => setColorDark(c.hex)}
                    usePopover={true}
                    popoverProps={{ trigger: 'click' }}
                >
                    <div
                        className="color-block"
                        style={{
                            marginLeft: 10,
                            backgroundColor: colorDark,
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
