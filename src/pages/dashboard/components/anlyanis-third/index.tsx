import { FC, useEffect, useState } from 'react';
import { Row, Col, Card, List, Avatar, Descriptions, Typography } from '@douyinfe/semi-ui';
import echarts from '@src/common/echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { anlyanisCategoryOption, anlyanisSalesOption } from '@src/common/echart-options';

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
        <div className="anlyanis-third-card-list">
            <Card loading={load}>
                <Row gutter={20}>
                    <Col span={8}>
                        <ReactEChartsCore
                            echarts={echarts}
                            option={anlyanisCategoryOption}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ minHeight: 400 }}
                        />
                    </Col>
                    <Col span={8}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            标签云
                        </div>
                    </Col>
                    <Col span={8}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            访问地图
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Index;
