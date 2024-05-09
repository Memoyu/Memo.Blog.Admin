import { FC, useState } from 'react';
import { Row, Col, Card, List, Avatar, Typography } from '@douyinfe/semi-ui';
import { IconEyeOpened, IconComment, IconLikeHeart } from '@douyinfe/semi-icons';
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

import {
    articleCategoryRelationSummaryGet,
    articleRanking,
    articleTagRelationSummaryGet,
} from '@src/utils/request';

import './index.scss';

const { Title, Text } = Typography;

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
        articleRanking(10)
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
                let items = res.data.map((r) => {
                    let title = r.name;
                    r.name = r.name + `(${r.value})`;
                    return { ...r, title };
                });
                let categoryOption = cloneDeep(categoryAnlyanisOption);

                categoryOption.series[0].data = items;
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
                let items = res.data.map((r) => {
                    let title = r.name;
                    r.name = r.name + `(${r.value})`;
                    return { ...r, title };
                });

                let tagOption = cloneDeep(tagAnlyanisOption);
                tagOption.series[0].data = items;
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
            <Card bodyStyle={{ padding: 10 }}>
                <Row gutter={8}>
                    <Col span={8}>
                        <Card loading={rankingLoading}>
                            <List
                                header={
                                    <div className="anlyanis-container-second-card-sales-card-header">
                                        <Title heading={4}>文章排行</Title>
                                    </div>
                                }
                                style={{ minHeight: 490 }}
                                dataSource={rankingData}
                                renderItem={(item, index) => (
                                    <List.Item style={{ padding: '11px 5px' }}>
                                        <Row>
                                            <Col span={14}>
                                                <Text ellipsis={{ showTooltip: true }}>
                                                    <Avatar
                                                        size="extra-extra-small"
                                                        style={{
                                                            marginRight: 10,
                                                            backgroundColor:
                                                                index <= 2 ? '#000' : '',
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </Avatar>
                                                    {item.title}
                                                </Text>
                                            </Col>
                                            <Col span={4}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        width: '100%',
                                                    }}
                                                >
                                                    <IconEyeOpened
                                                        size="small"
                                                        style={{ marginRight: 3 }}
                                                    />
                                                    {item.views}
                                                </div>
                                            </Col>
                                            <Col span={3}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        width: '100%',
                                                    }}
                                                >
                                                    <IconComment
                                                        size="small"
                                                        style={{ marginRight: 3 }}
                                                    />
                                                    {item.comments}
                                                </div>
                                            </Col>
                                            <Col span={3}>
                                                <div style={{ textAlign: 'center', width: '100%' }}>
                                                    <IconLikeHeart
                                                        size="small"
                                                        style={{ marginRight: 3 }}
                                                    />
                                                    {item.likes}
                                                </div>
                                            </Col>
                                        </Row>
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
                                style={{ minHeight: 490 }}
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
                                style={{ minHeight: 490 }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Index;
