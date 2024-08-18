import { FC, useEffect, useState } from 'react';
import { Typography } from '@douyinfe/semi-ui';
import './index.scss';

import ColorScale from './components/color-scale';

import { ColorConfigModel } from '@src/common/model';

interface ComProps {
    color: ColorConfigModel | undefined;
    onChange?: (color: ColorConfigModel) => void;
}

type ColorType = 'primary' | 'secondary' | 'tertiary';

const { Text } = Typography;

const Index: FC<ComProps> = ({ color, onChange }) => {
    const [colorConfig, setColorConfig] = useState<ColorConfigModel>();
    const [primary, setPrimary] = useState<string>();
    const [secondary, setSecondary] = useState<string>();
    const [tertiary, setTertiary] = useState<string>();

    const handleColorChange = (type: ColorType, colors: Array<string>) => {
        let cc = colorConfig ? colorConfig : { primary: [], secondary: [], tertiary: [] };
        //console.log('色阶变更', cc, colors);
        switch (type) {
            case 'primary':
                cc.primary = colors;
                setPrimary(getBaseColor(colors[5]));
                break;
            case 'secondary':
                cc.secondary = colors;
                setSecondary(getBaseColor(colors[5]));
                break;
            case 'tertiary':
                cc.tertiary = colors;
                setTertiary(getBaseColor(colors[5]));
                break;
        }
        // setColorConfig(cc);
        onChange && onChange(cc);
    };

    const getBaseColor = (color?: string) => {
        if (color?.startsWith('#')) return color;
        return color?.substring(0, color.lastIndexOf('-'));
    };

    useEffect(() => {
        setColorConfig(color);
    }, [color]);

    useEffect(() => {
        // console.log('颜色配置变更', color, colorConfig);
        setPrimary(getBaseColor(colorConfig?.primary[5]));
        setSecondary(getBaseColor(colorConfig?.secondary[5]));
        setTertiary(getBaseColor(colorConfig?.tertiary[5]));
    }, [colorConfig]);

    return (
        <div className="config-style-color">
            <div className="color-scale-group">
                <div className="color-scale-group-item">
                    <Text strong>主要颜色</Text>
                    <Text type="tertiary" style={{ marginLeft: 10 }}>
                        (default: 5, hover: 6, active: 7, disabled: 2, light-default: 0,
                        light-hover: 1, light-active: 2)
                    </Text>
                    <ColorScale
                        base={primary}
                        onChange={(colors) => handleColorChange('primary', colors)}
                    />
                </div>
                <div className="color-scale-group-item">
                    <Text strong>次要颜色</Text>
                    <Text type="tertiary" style={{ marginLeft: 10 }}>
                        (default: 5, hover: 6, active: 7, disabled: 2, light-default: 0,
                        light-hover: 1, light-active: 2)
                    </Text>
                    <ColorScale
                        base={secondary}
                        onChange={(colors) => handleColorChange('secondary', colors)}
                    />
                </div>
                <div className="color-scale-group-item">
                    <Text strong>第三颜色</Text>
                    <Text type="tertiary" style={{ marginLeft: 10 }}>
                        (default: 5, hover: 6, active: 7, light-default: 0, light-hover: 1,
                        light-active: 2)
                    </Text>
                    <ColorScale
                        base={tertiary}
                        onChange={(colors) => handleColorChange('tertiary', colors)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Index;
