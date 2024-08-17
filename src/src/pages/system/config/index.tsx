import { ReactNode, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { Button, Collapse, Space, Toast, Typography } from '@douyinfe/semi-ui';

import PageBanner from './components/page/banner';
import StyleColor from './components/style/color';

import './index.scss';
import {
    BannerConfigModel,
    ConfigModel,
    ColorConfigModel,
    ConfigEditRequest,
} from '@src/common/model';
import { configGet, configUpdate } from '@src/utils/request';

interface ConfidPanel {
    label: string;
    key: string;
    content?: ReactNode;
}

const { Title } = Typography;

const violets = Array.from({ length: 10 }, (_, i) => `violet-${i}`);
const init: ConfigModel = {
    banner: {
        home: '',
        article: '',
        lab: '',
        moment: '',
        about: '',
    },
    color: {
        primary: violets,
        secondary: violets,
        tertiary: violets,
    },
};

const Index: React.FC = () => {
    const [initConfig, setInitConfig] = useState<ConfigModel>(init);
    const [bannerConfig, setBannerConfig] = useState<BannerConfigModel>(cloneDeep(init.banner));
    const [colorConfig, setColorConfig] = useState<ColorConfigModel>(cloneDeep(init.color));

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
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            if (!res.data) return;

            setInitConfig(res.data);
            let clone = cloneDeep(res.data);
            setBannerConfig(clone.banner);
            setColorConfig(clone.color);
        });
    };

    const handleResetConfigClick = () => {
        // console.log('重置', bannerConfig, initConfig);
        setBannerConfig(cloneDeep(initConfig.banner));
        setColorConfig(cloneDeep(initConfig.color));
    };

    const handleSaveConfigClick = () => {
        let edit: ConfigEditRequest = { banner: bannerConfig, color: colorConfig };
        // console.log(edit);
        configUpdate(edit).then((res) => {
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }

            setInitConfig({ banner: bannerConfig, color: colorConfig });
            Toast.success('保存配置成功');
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
                <Button theme="borderless" type="danger" onClick={() => handleResetConfigClick()}>
                    还原
                </Button>
                <Button onClick={() => handleSaveConfigClick()}>保存配置</Button>
            </Space>
        </div>
    );
};

export default Index;
