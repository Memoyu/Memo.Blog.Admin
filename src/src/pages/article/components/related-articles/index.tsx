import { FC, ReactNode } from 'react';
import { Typography, Popover, List, Button } from '@douyinfe/semi-ui';

import ListEmpty from '@src/components/list-empty';

import { useData } from '@src/hooks/useData';

import { articleRelatedList } from '@src/utils/request';

import { ArticleRelatedModel } from '@src/common/model';

import './index.scss';

const { Text } = Typography;

interface SummaryCardProps {
    type: 'category' | 'tag';
    id: string;
    children?: ReactNode;
}

const Index: FC<SummaryCardProps> = ({ type, id, children }) => {
    const [articles, articlesLoading, setArticles, setArticlesLoading] =
        useData<Array<ArticleRelatedModel>>();

    const getArticleRelatedList = (id: string) => {
        setArticlesLoading(true);

        articleRelatedList(type == 'category' ? 1 : 2, id)
            .then((res) => {
                if (!res.isSuccess || !res.data) return;
                setArticles(res.data);
            })
            .finally(() => setArticlesLoading(false));
    };

    const handleArticlesVisibleChange = (isVisble: boolean) => {
        if (isVisble) getArticleRelatedList(id);
    };

    // 编辑文章
    const handleEditArticle = (data: ArticleRelatedModel) => {
        var path = '/article/edit/' + data.articleId;
        window.open(path, '_blank');
    };

    const popoverContentRender = (
        <List
            loading={articlesLoading}
            dataSource={articles}
            emptyContent={<ListEmpty />}
            split={false}
            style={{
                width: 400,
                maxHeight: 500,
                padding: 20,
                overflow: 'scroll',
            }}
            renderItem={(item) => (
                <List.Item
                    className="related-articls-item"
                    style={{ padding: 5 }}
                    main={
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Text strong>{item.title}</Text>
                            <Button
                                theme="borderless"
                                type="primary"
                                size="small"
                                onClick={() => handleEditArticle(item)}
                            >
                                编辑
                            </Button>
                        </div>
                    }
                />
            )}
        />
    );

    return (
        <Popover
            className="related-articls"
            trigger="click"
            position="left"
            content={popoverContentRender}
            onVisibleChange={handleArticlesVisibleChange}
        >
            {children}
        </Popover>
    );
};

export default Index;
