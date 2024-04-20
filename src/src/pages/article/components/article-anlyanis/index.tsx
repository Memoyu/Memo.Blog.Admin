import { FC, useState } from 'react';
import { cloneDeep } from 'lodash';
import { Row, Col, Toast } from '@douyinfe/semi-ui';
import echarts from '@src/common/echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { articleSummaryAnlyanisOption } from '@src/common/echart-options';

import SummaryCard from '../summary-card';

import './index.scss';
import { ArticleSummaryModel } from '@src/common/model';
import { articleSummary } from '@src/utils/request';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';

const Index: FC = () => {
    const [data, loading, setData, setLoading] = useData<ArticleSummaryModel>();

    const [articlesOption, setArticlesOption] = useState(articleSummaryAnlyanisOption);
    const [commentsOption, setCommentsOption] = useState(articleSummaryAnlyanisOption);
    const [viewsOption, setViewsOption] = useState(articleSummaryAnlyanisOption);

    // 获取文章汇总分析数据
    let getArticleSummaryAnlyanis = async () => {
        setLoading(true);

        articleSummary()
            .then((res) => {
                if (!res.isSuccess || !res.data) {
                    Toast.error(res.message);
                    return;
                }

                setData(res.data);

                let newArticlesOption = cloneDeep(articlesOption);
                newArticlesOption.series[0].data = res.data.weekArticles.map((u) => [
                    u.name,
                    u.value,
                ]);
                setArticlesOption(newArticlesOption);

                let newCommentsOption = cloneDeep(commentsOption);
                newCommentsOption.series[0].data = res.data.weekComments.map((u) => [
                    u.name,
                    u.value,
                ]);
                setCommentsOption(newCommentsOption);

                let newViewsOption = cloneDeep(viewsOption);
                newViewsOption.series[0].data = res.data.weekViews.map((u) => [u.name, u.value]);
                setViewsOption(newViewsOption);
            })
            .finally(() => setLoading(false));
    };

    useOnMountUnsafe(() => {
        getArticleSummaryAnlyanis();
    });

    return (
        <div className="article-anlyanis-list">
            <Row gutter={50}>
                <Col span={8}>
                    <SummaryCard
                        type={'文章总数'}
                        value={data?.articles ?? 0}
                        tip="文章总数及周新增数据统计"
                    >
                        <ReactEChartsCore
                            echarts={echarts}
                            option={articlesOption}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ height: 70 }}
                        />
                    </SummaryCard>
                </Col>

                <Col span={8}>
                    <SummaryCard
                        type={'评论总数'}
                        value={data?.comments ?? 0}
                        tip="文章评论总数及周新增数据统计"
                    >
                        <ReactEChartsCore
                            echarts={echarts}
                            option={commentsOption}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ height: 70 }}
                        />
                    </SummaryCard>
                </Col>

                <Col span={8}>
                    <SummaryCard
                        type={'阅读量'}
                        value={data?.views ?? 0}
                        tip="文章阅读总数及周新增数据统计"
                    >
                        <ReactEChartsCore
                            echarts={echarts}
                            option={viewsOption}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ height: 70 }}
                        />
                    </SummaryCard>
                </Col>
            </Row>
        </div>
    );
};

export default Index;
