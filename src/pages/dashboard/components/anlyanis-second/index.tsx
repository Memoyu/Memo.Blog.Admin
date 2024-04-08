import { FC, useState, useEffect } from 'react';
import { IconArrowDown, IconArrowUp, IconInfoCircle } from '@douyinfe/semi-icons';
import { Row, Col, Card, List, Avatar, Descriptions, Typography } from '@douyinfe/semi-ui';
import echarts from '@src/common/echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { anlyanisSalesOption } from '@src/common/echart-options';

import './index.scss';

const { Item } = Descriptions;
const { Title } = Typography;

interface Iprops {
    loading?: boolean;
}

const listData = [
    {
        key: '龙腾路',
        value: '1,233',
    },
    {
        key: '龙腾路',
        value: '1,233',
    },
    {
        key: '龙腾路',
        value: '1,233',
    },
    {
        key: '龙腾路',
        value: '1,233',
    },
    {
        key: '龙腾路',
        value: '1,233',
    },
    {
        key: '龙腾路',
        value: '1,233',
    },
    {
        key: '龙腾路',
        value: '1,233',
    },
];

const Index: FC<Iprops> = ({ loading }) => {
    const [load, setLoad] = useState<boolean>();

    useEffect(() => {
        setLoad(loading);
    }, [loading]);

    return (
        <div className="anlyanis-second-card-list">
            <Card loading={load}>
                <Row gutter={20}>
                    <Col span={8}>
                        <List
                            header={
                                <div className="anlyanis-container-second-card-sales-card-header">
                                    <Title heading={4}>文章排行</Title>
                                </div>
                            }
                            dataSource={listData}
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
                                                {item.key} {index} 号店
                                            </span>
                                        </div>
                                        <div>{item.value}</div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Col span={16}>
                        <ReactEChartsCore
                            echarts={echarts}
                            option={anlyanisSalesOption}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ minHeight: 400 }}
                        />
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Index;
