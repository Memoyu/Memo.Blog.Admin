import { FC, useState } from 'react';
import { IconInfoCircle } from '@douyinfe/semi-icons';
import { Row, Col, Card, Popover, Toast, Descriptions, Typography } from '@douyinfe/semi-ui';
import { cloneDeep } from 'lodash';
import echarts from '@src/common/echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import {
    dashboardPvAnlyanisOption,
    dashboardUvAnlyanisOption,
    dashboardCommentAnlyanisOption,
} from '@src/common/echart-options';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';

import { AnlyanisDashboardModel } from '@src/common/model';

import { anlyanisDashboard } from '@src/utils/request';

import './index.scss';

const { Item } = Descriptions;
const { Text } = Typography;

const Index: FC = () => {
    const [data, loading, setData, setLoading] = useData<AnlyanisDashboardModel>();

    const [pvAnlyanisOption, setPvAnlyanisOption] = useState(dashboardPvAnlyanisOption);
    const [uvAnlyanisOption, setUvAnlyanisOption] = useState(dashboardUvAnlyanisOption);
    const [commentAnlyanisOption, setCommentAnlyanisOption] = useState(
        dashboardCommentAnlyanisOption
    );

    // 获取概览汇总数据
    let getAnlyanisDashboard = () => {
        setLoading(true);

        anlyanisDashboard()
            .then((res) => {
                if (!res.isSuccess || !res.data) {
                    Toast.error(res.message);
                    return;
                }

                // console.log('res', res.data);
                setData(res.data);
                let pvOption = cloneDeep(pvAnlyanisOption);
                pvOption.series[0].data = res.data.pageVisitor.weekPageVisitors.map((u) => [
                    u.name,
                    u.value,
                ]);
                setPvAnlyanisOption(pvOption);

                let uvOption = cloneDeep(uvAnlyanisOption);
                uvOption.series[0].data = res.data.uniqueVisitor.weekUniqueVisitors.map((u) => [
                    u.name,
                    u.value,
                ]);
                setUvAnlyanisOption(uvOption);

                let commentOption = cloneDeep(commentAnlyanisOption);
                commentOption.series[0].data = res.data.comment.weekComments.map((u) => [
                    u.name,
                    u.value,
                ]);
                setCommentAnlyanisOption(commentOption);
            })
            .finally(() => setLoading(false));
    };

    useOnMountUnsafe(() => {
        getAnlyanisDashboard();
    });

    return (
        <div className="anlyanis-top-card-list">
            <Row gutter={20}>
                <Col span={6}>
                    <Card
                        loading={loading}
                        footerLine={true}
                        style={{ height: 230 }}
                        footer={
                            <span>
                                本周文章
                                <span style={{ paddingLeft: 10 }}>
                                    {data?.summary.weekArticles}
                                </span>
                            </span>
                        }
                    >
                        <div className="flex-between">
                            <span>文章总数</span>
                            <Popover position="top" showArrow content={<article>汇总数据</article>}>
                                <IconInfoCircle style={{ color: 'var(--semi-color-primary)' }} />
                            </Popover>
                        </div>
                        <Descriptions row size="large">
                            <Item itemKey="">{data?.summary.articles}</Item>
                        </Descriptions>

                        <div style={{ marginTop: 15, height: 55 }}>
                            <Text>
                                动态
                                <Text strong style={{ paddingLeft: 10 }}>
                                    {data?.summary.moments}
                                </Text>
                            </Text>
                            <Text style={{ paddingLeft: 30 }}>
                                友链
                                <Text strong style={{ paddingLeft: 10 }}>
                                    {data?.summary.friends}
                                </Text>
                            </Text>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card
                        style={{ height: 230 }}
                        footerLine={true}
                        loading={loading}
                        footer={
                            <span>
                                今日PV
                                <span style={{ paddingLeft: 10 }}>
                                    {data?.pageVisitor.todayPageVisitors}
                                </span>
                            </span>
                        }
                    >
                        <div className="flex-between">
                            <span>浏览总数</span>
                            <Popover
                                position="top"
                                showArrow
                                content={<article>PV数据汇总</article>}
                            >
                                <IconInfoCircle style={{ color: 'var(--semi-color-primary)' }} />
                            </Popover>
                        </div>
                        <Descriptions row size="large">
                            <Item itemKey="">{data?.pageVisitor.pageVisitors}</Item>
                        </Descriptions>
                        <ReactEChartsCore
                            echarts={echarts}
                            option={pvAnlyanisOption}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ height: 70 }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card
                        style={{ height: 230 }}
                        footerLine={true}
                        loading={loading}
                        footer={
                            <span>
                                今日UV
                                <span style={{ paddingLeft: 10 }}>
                                    {data?.uniqueVisitor.todayUniqueVisitors}
                                </span>
                            </span>
                        }
                    >
                        <div className="flex-between">
                            <span>访问总数</span>
                            <Popover
                                position="top"
                                showArrow
                                content={<article>UV数据汇总</article>}
                            >
                                <IconInfoCircle style={{ color: 'var(--semi-color-primary)' }} />
                            </Popover>
                        </div>
                        <Descriptions row size="large">
                            <Item itemKey="">{data?.uniqueVisitor.uniqueVisitors}</Item>
                        </Descriptions>
                        <ReactEChartsCore
                            echarts={echarts}
                            option={uvAnlyanisOption}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ height: 70 }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card
                        style={{ height: 230 }}
                        footerLine={true}
                        loading={loading}
                        footer={
                            <span>
                                今日评论
                                <span style={{ paddingLeft: 10 }}>
                                    {data?.comment.todayComments}
                                </span>
                            </span>
                        }
                    >
                        <div className="flex-between">
                            <span>评论总数</span>
                            <Popover
                                position="top"
                                showArrow
                                content={<article>评论数据汇总</article>}
                            >
                                <IconInfoCircle style={{ color: 'var(--semi-color-primary)' }} />
                            </Popover>
                        </div>
                        <Descriptions row size="large">
                            <Item itemKey="">{data?.comment.comments}</Item>
                        </Descriptions>
                        <ReactEChartsCore
                            echarts={echarts}
                            option={commentAnlyanisOption}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ height: 70 }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Index;
