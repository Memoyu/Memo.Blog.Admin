import { FC, useEffect, useState } from 'react';
import { Typography } from '@douyinfe/semi-ui';

import ColorScale from './components/color-scale';

import './index.scss';
import { ColorConfigModel } from '@src/common/model';

interface ComProps {
    color: ColorConfigModel | undefined;
    onChange?: (color: ColorConfigModel) => void;
}

type ColorType = 'primary' | 'secondary' | 'tertiary';

const { Text } = Typography;

const Index: FC<ComProps> = ({ color, onChange }) => {
    const [colorConfig, setColorConfig] = useState<ColorConfigModel>();

    const handleColorChange = (type: ColorType, colors: Array<string>) => {
        if (colorConfig == undefined) return;
        switch (type) {
            case 'primary':
                colorConfig.primary = colors;
                break;
            case 'secondary':
                colorConfig.secondary = colors;
                break;
            case 'tertiary':
                colorConfig.tertiary = colors;
                break;
        }
        // console.log('color config', config);
        onChange && onChange(colorConfig);
    };

    const getBaseColor = (type: ColorType) => {
        let color = undefined;

        switch (type) {
            case 'primary':
                color = colorConfig?.primary[5];
                break;
            case 'secondary':
                color = colorConfig?.secondary[5];
                break;
            case 'tertiary':
                color = colorConfig?.tertiary[5];
                break;
        }

        if (color == undefined) return;
        if (color.startsWith('#')) return color;
        return color.substring(0, color.lastIndexOf('-'));
    };

    useEffect(() => {
        // console.log('颜色配置', color);

        if (color == undefined) return;
        setColorConfig(color);
    }, [color]);

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
                        base={getBaseColor('primary')}
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
                        base={getBaseColor('secondary')}
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
                        base={getBaseColor('tertiary')}
                        onChange={(colors) => handleColorChange('tertiary', colors)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Index;
