import { ReactNode, useEffect, useState } from 'react';
import './index.scss';
import { cloneDeep } from 'lodash';
import { Button, Collapse, Space, Toast, Typography } from '@douyinfe/semi-ui';

import PageBanner from './components/page/banner';
import StyleColor from './components/style/color';
import AdminColor from './components/admin';

import {
    ConfigModel,
    BannerConfigModel,
    ColorConfigModel,
    AdminConfigModel,
} from '@src/common/model';
import { configGet, configUpdate } from '@src/utils/request';

interface ConfidPanel {
    label: string;
    key: string;
    content?: ReactNode;
}

const { Title } = Typography;

const admin: AdminConfigModel = {
    visitorId: '',
};

const banner: BannerConfigModel = {
    home: {},
    article: {},
    lab: {},
    moment: {},
    about: {},
};
const color: ColorConfigModel = {
    primary: [],
    secondary: [],
    tertiary: [],
};

const Index: React.FC = () => {
    const [config, setConfig] = useState<ConfigModel>({ admin, banner, color });
    const [adminConfig, setAdminConfig] = useState<AdminConfigModel>({ ...admin });
    const [bannerConfig, setBannerConfig] = useState<BannerConfigModel>({ ...banner });
    const [colorConfig, setColorConfig] = useState<ColorConfigModel>({ ...color });

    const confidPanels: Array<ConfidPanel> = [
        {
            label: '管理配置',
            key: 'admin',
            content: <AdminColor admin={adminConfig} onChange={setAdminConfig} />,
        },
        {
            label: '头图配置',
            key: 'banner',
            content: <PageBanner banner={bannerConfig} onChange={setBannerConfig} />,
        },
        {
            label: '颜色配置',
            key: 'color',
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

            setConfig(res.data);
            setColorConfig({ ...res.data.color });
            setBannerConfig({ ...res.data.banner });
        });
    };

    const handleResetConfigClick = () => {
        // console.log('重置', resetConfig);
        setColorConfig({ ...config.color });
        setBannerConfig({ ...config.banner });
    };

    const handleSaveConfigClick = () => {
        console.log('编辑配置', bannerConfig, colorConfig);
        if (
            colorConfig.primary.length < 1 ||
            colorConfig.secondary.length < 1 ||
            colorConfig.tertiary.length < 1
        ) {
            Toast.error('请选择颜色配置');
            return;
        }

        let req = { admin: adminConfig, banner: bannerConfig, color: colorConfig };
        configUpdate(req).then((res) => {
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }

            setConfig(cloneDeep(req));
            Toast.success('保存配置成功');
        });
    };

    useEffect(() => {
        getConfig();
    }, []);

    return (
        <div className="config-container">
            <Collapse defaultActiveKey={confidPanels.map((p) => p.key)} keepDOM={true}>
                {confidPanels.map((p) => (
                    <Collapse.Panel
                        header={<Title heading={4}>{p.label}</Title>}
                        itemKey={p.key}
                        key={p.key + 'key'}
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
