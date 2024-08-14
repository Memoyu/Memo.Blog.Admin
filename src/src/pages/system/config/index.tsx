import { ReactNode, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { Button, Collapse, Space, Toast, Typography } from '@douyinfe/semi-ui';

import PageBanner from './components/page/banner';
import StyleColor from './components/style/color';

import './index.scss';
import { BannerConfigModel, ConfigModel, ColorConfigModel } from '@src/common/model';
import { configGet } from '@src/utils/request';

interface ConfidPanel {
    label: string;
    key: string;
    content?: ReactNode;
}

const { Title } = Typography;

const Index: React.FC = () => {
    const [config, setConfig] = useState<ConfigModel>();
    const [bannerConfig, setBannerConfig] = useState<BannerConfigModel>();
    const [colorConfig, setColorConfig] = useState<ColorConfigModel>();

    const confidPanels: Array<ConfidPanel> = [
        {
            label: '头图配置',
            key: '0',
            content: <PageBanner banner={bannerConfig} onChange={setBannerConfig} />,
        },
        {
            label: '颜色配置',
            key: '1',
            content: <StyleColor color={colorConfig} onChange={setColorConfig} />,
        },
    ];

    const getConfig = () => {
        configGet().then((res) => {
            if (!res.isSuccess || !res.data) {
                Toast.error(res.message);
                return;
            }
            setConfig(res.data);
            let banner = cloneDeep(res.data.banner);
            setBannerConfig(banner);
            let color = cloneDeep(res.data.color);
            setColorConfig(color);
        });
    };

    useEffect(() => {
        getConfig();
    }, []);

    return (
        <div className="config-container">
            <Collapse defaultActiveKey={confidPanels.map((p) => p.key)}>
                {confidPanels.map((p) => (
                    <Collapse.Panel
                        header={<Title heading={4}>{p.label}</Title>}
                        itemKey={p.key}
                        key={p.key}
                    >
                        <div style={{ margin: 15 }}>{p.content}</div>
                    </Collapse.Panel>
                ))}
            </Collapse>
            <Space spacing="loose" style={{ marginTop: 30 }}>
                <Button type="danger">还原</Button>
                <Button>保存配置</Button>
            </Space>
        </div>
    );
};

export default Index;
