import { FC, useEffect, useState } from 'react';
import { Row, Col, Card, List, Avatar, Descriptions, Typography } from '@douyinfe/semi-ui';
import echarts from '@src/common/echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { anlyanisCategoryOption, anlyanisSactterMapOption } from '@src/common/echart-options';

import './index.scss';

const { Item } = Descriptions;
const { Title } = Typography;

interface Iprops {
    loading?: boolean;
}

const Index: FC<Iprops> = ({ loading }) => {
    const [load, setLoad] = useState<boolean>();

    useEffect(() => {
        setLoad(loading);
    }, [loading]);

    return (
        <div className="anlyanis-third-card-list">
            <Card loading={load}>
                <Row gutter={20}>
                    <Col>
                        <ReactEChartsCore
                            echarts={echarts}
                            option={anlyanisSactterMapOption}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ minHeight: 600 }}
                        />
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Index;
