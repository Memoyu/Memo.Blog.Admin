import { FC, ReactNode, useState } from 'react';

import { Button, Input, Layout, Space, Tree, Typography } from '@douyinfe/semi-ui';
import { TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree';

import PageBanner from './components/page/banner';
import StyleGlobal from './components/style/global';

import './index.scss';

export interface TreeNode extends TreeNodeData {
    content?: ReactNode;
    children?: TreeNode[];
}

const { Text } = Typography;

const Index: React.FC = () => {
    const getLabelNode = (title: string) => (
        <div style={{ margin: '5px 0' }}>
            <Text strong>{title}</Text>
        </div>
    );

    const treeData: Array<TreeNode> = [
        // 可以嵌套
        // {
        //     label: '页面配置',
        //     value: 'page',
        //     key: '0',
        //     children: [
        //         {
        //             label: '头图配置',
        //             value: 'banner',
        //             key: '0-0',
        //             content: <PageBanner />,
        //         },
        //     ],
        // },
        {
            label: getLabelNode('头图配置'),
            value: 'banner',
            key: '0-0',
            content: <PageBanner />,
        },
        {
            label: getLabelNode('样式配置'),
            value: 'style',
            key: '1',
            content: <StyleGlobal />,
        },
    ];

    const [configContent, setConfigContent] = useState<ReactNode>();

    const handleConfigSelected = (
        selectedKey: string,
        selected: boolean,
        selectedNode: TreeNode
    ) => {
        if (selectedNode.content == undefined) return;
        setConfigContent(selectedNode.content);
    };

    return (
        <Layout>
            <Layout.Sider style={{ minWidth: '240px' }}>
                <Tree
                    expandAll={true}
                    filterTreeNode
                    searchRender={({ prefix, ...restProps }) => (
                        <Input prefix="搜索" {...restProps} />
                    )}
                    treeData={treeData}
                    onSelect={handleConfigSelected}
                />
            </Layout.Sider>
            <Layout>
                <Layout.Content style={{ padding: 15 }}>{configContent} </Layout.Content>
                <Layout.Footer>
                    <Space spacing="loose">
                        <Button type="danger">还原</Button>
                        <Button>保存配置</Button>
                    </Space>
                </Layout.Footer>
            </Layout>
        </Layout>
    );
};

export default Index;
