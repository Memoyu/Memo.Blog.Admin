import { ReactNode, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { Button, Collapse, Space, Toast, Typography } from '@douyinfe/semi-ui';

import PageBanner from './components/page/banner';
import StyleColor from './components/style/color';

import './index.scss';
import { ConfigModel, ConfigEditRequest } from '@src/common/model';
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
    const [config, setConfig] = useState<ConfigModel>(init);
    const [editConfig, setEditConfig] = useState<ConfigEditRequest>({} as ConfigEditRequest);

    const confidPanels: Array<ConfidPanel> = [
        {
            label: '头图配置',
            key: '0',
            content: <PageBanner banner={editConfig.banner} />,
        },
        {
            label: '颜色配置',
            key: '1',
            content: <StyleColor color={editConfig.color} />,
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
            setEditConfig(cloneDeep(res.data));
        });
    };

    const handleResetConfigClick = () => {
        console.log('重置', config);
        //if (!editConfig) return;
        setEditConfig(cloneDeep(config));
    };

    const handleSaveConfigClick = () => {
        if (editConfig == undefined) {
            Toast.error('请选择配置');
            return;
        }
        // console.log(edit);
        configUpdate(editConfig).then((res) => {
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }

            setConfig({ banner: editConfig.banner, color: editConfig.color });
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
