import { FC, ReactNode, useState } from 'react';

import { Button, Input, Layout, Tree } from '@douyinfe/semi-ui';
import { TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree';

import PageBanner from './components/page/banner';
import StyleGlobal from './components/style/global';

import './index.scss';

export interface TreeNode extends TreeNodeData {
    content?: ReactNode;
    children?: TreeNode[];
}

const Index: React.FC = () => {
    const treeData: Array<TreeNode> = [
        {
            label: '页面配置',
            value: 'page',
            key: '0',
            children: [
                {
                    label: '头图配置',
                    value: 'banner',
                    key: '0-0',
                    content: <PageBanner />,
                },
            ],
        },
        {
            label: '样式配置',
            value: 'style',
            key: '1',
            children: [
                {
                    label: '全局样式',
                    value: 'global',
                    key: '1-0',
                    content: <StyleGlobal />,
                },
            ],
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
            <Layout.Sider style={{ width: '320px' }}>
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
                    <Button>保存配置</Button>
                </Layout.Footer>
            </Layout>
        </Layout>
    );
};

export default Index;
