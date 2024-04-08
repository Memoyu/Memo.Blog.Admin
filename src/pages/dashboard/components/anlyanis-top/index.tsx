import { FC, useState, useEffect } from 'react';
import { IconArrowDown, IconArrowUp, IconInfoCircle } from '@douyinfe/semi-icons';
import { Row, Col, Card, Popover, Progress, Descriptions, Typography } from '@douyinfe/semi-ui';
import echarts from '@src/common/echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { anlyanisAccessOption, anlyanisPayOption } from '@src/common/echart-options';

import './index.scss';

const { Item } = Descriptions;
const { Title, Text } = Typography;

interface Iprops {
    loading?: boolean;
}

const Index: FC<Iprops> = ({ loading }) => {
    const [load, setLoad] = useState<boolean>();

    useEffect(() => {
        setLoad(loading);
    }, [loading]);

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
                                文章总数 <span style={{ paddingLeft: 10 }}>1478</span>
                            </span>
                        }
                    >
                        <div className="flex-between">
                            <span>本周文章</span>
                            <Popover position="top" showArrow content={<article>指标说明</article>}>
                                <IconInfoCircle style={{ color: 'var(--semi-color-primary)' }} />
                            </Popover>
                        </div>
                        <Descriptions row size="large">
                            <Item itemKey="">1,884,450</Item>
                        </Descriptions>

                        <div style={{ marginTop: 15, height: 55 }}>
                            <Text>
                                动态
                                <Text strong style={{ paddingLeft: 10 }}>
                                    12
                                </Text>
                            </Text>
                            <Text style={{ paddingLeft: 30 }}>
                                友链
                                <Text strong style={{ paddingLeft: 10 }}>
                                    11
                                </Text>
                            </Text>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card
                        style={{ height: 230 }}
                        footerLine={true}
                        loading={load}
                        footer={
                            <span>
                                浏览总数 <span style={{ paddingLeft: 10 }}>5,396</span>
                            </span>
                        }
                    >
                        <div className="flex-between">
                            <span>今日PV</span>{' '}
                            <Popover position="top" showArrow content={<article>指标说明</article>}>
                                <IconInfoCircle style={{ color: 'var(--semi-color-primary)' }} />
                            </Popover>
                        </div>
                        <Descriptions row size="large">
                            <Item itemKey="">9,384</Item>
                        </Descriptions>
                        <ReactEChartsCore
                            echarts={echarts}
                            option={anlyanisAccessOption}
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
                        loading={load}
                        footer={
                            <span>
                                访问总数 <span style={{ paddingLeft: 10 }}>5,396</span>
                            </span>
                        }
                    >
                        <div className="flex-between">
                            <span> 今日UV</span>{' '}
                            <Popover position="top" showArrow content={<article>指标说明</article>}>
                                <IconInfoCircle style={{ color: 'var(--semi-color-primary)' }} />
                            </Popover>
                        </div>
                        <Descriptions row size="large">
                            <Item itemKey="">9,384</Item>
                        </Descriptions>
                        <ReactEChartsCore
                            echarts={echarts}
                            option={anlyanisAccessOption}
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
                        loading={load}
                        footer={
                            <span>
                                评论总数<span style={{ paddingLeft: 10 }}>6434</span>
                            </span>
                        }
                    >
                        <div className="flex-between">
                            <span>今日评论</span>
                            <Popover position="top" showArrow content={<article>指标说明</article>}>
                                <IconInfoCircle style={{ color: 'var(--semi-color-primary)' }} />
                            </Popover>
                        </div>
                        <Descriptions row size="large">
                            <Item itemKey="">9,384</Item>
                        </Descriptions>
                        <ReactEChartsCore
                            echarts={echarts}
                            option={anlyanisPayOption}
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
