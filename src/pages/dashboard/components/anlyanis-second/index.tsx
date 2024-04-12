import { FC, useState } from 'react';
import { Row, Col, Card, List, Avatar, Descriptions, Typography } from '@douyinfe/semi-ui';
import { cloneDeep } from 'lodash';
import echarts from '@src/common/echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import {
    dashboardCategoryAnlyanisOption,
    dashboardTagAnlyanisOption,
} from '@src/common/echart-options';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';

import { ArticleRankingModel, CategoryModel, TagModel } from '@src/common/model';

import './index.scss';
import {
    articleCategoryRelationSummaryGet,
    articleRanking,
    articleTagRelationSummaryGet,
} from '@src/utils/request';

const { Item } = Descriptions;
const { Title } = Typography;

const Index: FC = () => {
    const [rankingData, rankingLoading, setRankingData, setRankingLoading] =
        useData<Array<ArticleRankingModel>>();
    const [_categoryData, categoryLoading, _setCategoryData, setCategoryLoading] =
        useData<Array<CategoryModel>>();
    const [_tagData, tagLoading, _setTagData, setTagLoading] = useData<Array<TagModel>>();

    const [categoryAnlyanisOption, setCategoryAnlyanisOption] = useState(
        dashboardCategoryAnlyanisOption
    );
    const [tagAnlyanisOption, setTagAnlyanisOption] = useState(dashboardTagAnlyanisOption);

    // 获取文章排名
    let getArticleRankingList = () => {
        setRankingLoading(true);
        articleRanking(15)
            .then((res) => {
                if (!res.isSuccess || !res.data) return;
                setRankingData(res.data);
            })
            .finally(() => setRankingLoading(false));
    };

    // 获取文章分类
    let getCategoryList = () => {
        setCategoryLoading(true);
        articleCategoryRelationSummaryGet()
            .then((res) => {
                if (!res.isSuccess || !res.data) return;
                // setCategoryData(res.data);

                let categoryOption = cloneDeep(categoryAnlyanisOption);
                categoryOption.series[0].data = res.data;
                setCategoryAnlyanisOption(categoryOption);
            })
            .finally(() => setCategoryLoading(false));
    };

    // 获取文章标签
    let getTagList = () => {
        setTagLoading(true);
        articleTagRelationSummaryGet()
            .then((res) => {
                if (!res.isSuccess || !res.data) return;
                // setTagData(res.data);

                let tagOption = cloneDeep(tagAnlyanisOption);
                tagOption.series[0].data = res.data;
                setTagAnlyanisOption(tagOption);
            })
            .finally(() => setTagLoading(false));
    };

    useOnMountUnsafe(() => {
        getArticleRankingList();
        getCategoryList();
        getTagList();
    });

    return (
        <div className="anlyanis-second-card-list">
            <Card>
                <Row gutter={20}>
                    <Col span={8}>
                        <Card loading={rankingLoading}>
                            <List
                                header={
                                    <div className="anlyanis-container-second-card-sales-card-header">
                                        <Title heading={4}>文章排行</Title>
                                    </div>
                                }
                                dataSource={rankingData}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <div className="flex-between">
                                            <div>
                                                <Avatar
                                                    size="extra-extra-small"
                                                    style={{
                                                        backgroundColor: index <= 2 ? '#000' : '',
                                                    }}
                                                >
                                                    {index + 1}
                                                </Avatar>
                                                <span style={{ paddingLeft: 10 }}>
                                                    {item.title}
                                                </span>
                                            </div>
                                            <div>{item.views}</div>
                                            <div>{item.likes}</div>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card loading={categoryLoading}>
                            <ReactEChartsCore
                                echarts={echarts}
                                option={categoryAnlyanisOption}
                                notMerge={true}
                                lazyUpdate={true}
                                style={{ minHeight: 400 }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card loading={tagLoading}>
                            <ReactEChartsCore
                                echarts={echarts}
                                option={tagAnlyanisOption}
                                notMerge={true}
                                lazyUpdate={true}
                                style={{ minHeight: 400 }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Index;
