import { FC, useEffect, useState } from 'react';
import { Typography } from '@douyinfe/semi-ui';

import ColorScale from './components/color-scale';

import './index.scss';
import { ColorConfigModel } from '@src/common/model';

interface ComProps {
    color: ColorConfigModel | undefined;
    onChange?: (banner: ColorConfigModel) => void;
}

const { Text } = Typography;

const Index: FC<ComProps> = ({ color, onChange }) => {
    const [primary, setPrimary] = useState<Array<string>>([]);
    const [secondary, setSecondary] = useState<Array<string>>([]);
    const [tertiary, setTertiary] = useState<Array<string>>([]);

    const [primaryColors, setPrimaryColors] = useState<Array<string>>();
    const [secondaryColors, setSecondaryColors] = useState<Array<string>>();
    const [tertiaryColors, setTertiaryColors] = useState<Array<string>>();

    useEffect(() => {
        let pc = color?.primary ?? ['', ''];
        setPrimary(pc);

        let sc = color?.secondary ?? ['', ''];
        setSecondary(sc);

        let tc = color?.tertiary ?? ['', ''];
        setTertiary(tc);
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
                    <ColorScale light={primary[0]} dark={primary[1]} onChange={setPrimaryColors} />
                </div>
                <div className="color-scale-group-item">
                    <Text strong>次要颜色</Text>
                    <Text type="tertiary" style={{ marginLeft: 10 }}>
                        (default: 5, hover: 6, active: 7, disabled: 2, light-default: 0,
                        light-hover: 1, light-active: 2)
                    </Text>
                    <ColorScale
                        light={secondary[0]}
                        dark={secondary[1]}
                        onChange={setSecondaryColors}
                    />
                </div>
                <div className="color-scale-group-item">
                    <Text strong>第三颜色</Text>
                    <Text type="tertiary" style={{ marginLeft: 10 }}>
                        (default: 5, hover: 6, active: 7, light-default: 0, light-hover: 1,
                        light-active: 2)
                    </Text>
                    <ColorScale
                        light={tertiary[0]}
                        dark={tertiary[1]}
                        onChange={setTertiaryColors}
                    />
                </div>
            </div>
        </div>
    );
};

export default Index;
