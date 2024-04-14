import { FC, useState } from 'react';
import { cloneDeep } from 'lodash';
import {
    Row,
    Col,
    Card,
    Popover,
    Progress,
    Descriptions,
    Typography,
    Toast,
} from '@douyinfe/semi-ui';
import echarts from '@src/common/echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { articleSummaryAnlyanisOption } from '@src/common/echart-options';

import SummaryCard from '../summary-card';

import './index.scss';
import { ArticlePageSummaryModel } from '@src/common/model';
import { articlePageSummary } from '@src/utils/request';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';

const { Item } = Descriptions;
const { Title } = Typography;

const Index: FC = () => {
    const [data, loading, setData, setLoading] = useData<ArticlePageSummaryModel>({
        articleTotal: 0,
        commentTotal: 0,
        viewTotal: 0,
    });

    const [articlesOption, setArticlesOption] = useState(articleSummaryAnlyanisOption);

    // 获取文章汇总分析数据
    let getArticleSummaryAnlyanis = async () => {
        setLoading(true);

        articlePageSummary()
            .then((res) => {
                if (!res.isSuccess || !res.data) {
                    Toast.error(res.message);
                    return;
                }

                setData(res.data);
                let uvOption = cloneDeep(articlesOption);
                uvOption.series[0].data = [
                    ['1', 1],
                    ['3', 2],
                    ['41', 2],
                    ['51', 3],
                    ['61', 4],
                    ['71', 5],
                ];
                setArticlesOption(uvOption);
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
                    <SummaryCard type={'文章总数'} value={data?.articleTotal ?? 0}>
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
                        value={data?.commentTotal ?? 0}
                        tip="所有文章评论总数，随查询条件汇总"
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
                        type={'阅读量'}
                        value={data?.viewTotal ?? 0}
                        tip="所有文章阅读总数，随查询条件汇总"
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
            </Row>
        </div>
    );
};

export default Index;
