import { FC, useState } from 'react';
import { Form, Typography } from '@douyinfe/semi-ui';

import ColorScale from './components/color-scale';

import './index.scss';

const { Section } = Form;
const { Text } = Typography;

const Index: FC = () => {
    const [primaryColors, setPrimaryColors] = useState<Array<string>>(['#f3edf9', '#281475']);
    const [secondaryColors, setSecondaryColors] = useState<Array<string>>(['#f7e9f7', '#490a61']);
    const [tertiaryColors, setTertiaryColors] = useState<Array<string>>(['#f8f8f8', '#525068']);

    return (
        <div className="config-global-style">
            <Section text={'主题色'}>
                <div className="color-scale-group">
                    <div className="color-scale-group-item">
                        <Text strong>主要颜色</Text>
                        <Text type="tertiary" style={{ marginLeft: 10 }}>
                            (default: 6, hover: 5, active: 7, disabled: 1, light-default: 1,
                            light-hover: 2, light-active: 3)
                        </Text>
                        <ColorScale
                            light={primaryColors[0]}
                            dark={primaryColors[primaryColors.length - 1]}
                            onChange={setPrimaryColors}
                        />
                    </div>
                    <div className="color-scale-group-item">
                        <Text strong>次要颜色</Text>
                        <Text type="tertiary" style={{ marginLeft: 10 }}>
                            (default: 6, hover: 5, active: 7, disabled: 1, light-default: 0,
                            light-hover: 1, light-active: 2)
                        </Text>
                        <ColorScale
                            light={secondaryColors[0]}
                            dark={secondaryColors[secondaryColors.length - 1]}
                            onChange={setSecondaryColors}
                        />
                    </div>
                    <div className="color-scale-group-item">
                        <Text strong>第三颜色</Text>
                        <Text type="tertiary" style={{ marginLeft: 10 }}>
                            (default: 8, hover: 7, active: 9, light-default: 0, light-hover: 1,
                            light-active: 2)
                        </Text>
                        <ColorScale
                            light={tertiaryColors[0]}
                            dark={tertiaryColors[tertiaryColors.length - 1]}
                            onChange={setTertiaryColors}
                        />
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default Index;
