import { FC, ReactNode } from 'react';
import { Card, Badge, Typography, Tooltip, Row, Col } from '@douyinfe/semi-ui';

import './index.scss';

const { Title } = Typography;

interface SummaryCardProps {
    type: string;
    value: number | string;
    tip?: string;
    children?: ReactNode;
}

const Index: FC<SummaryCardProps> = ({ type, value, tip, children }: SummaryCardProps) => {
    return (
        <Card className="article-summary-card" style={{ overflow: 'unset' }}>
            <Row type="flex" justify="space-around" align="middle">
                <Col span={14}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'start',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                            }}
                        >
                            <Title
                                heading={6}
                                style={{
                                    color: 'rgba(var(--semi-grey-9), 1)',
                                    marginRight: 10,
                                }}
                            >
                                {type}
                            </Title>
                            {tip && tip.length > 0 ? (
                                <Tooltip content={tip} arrowPointAtCenter={false} position="right">
                                    <Badge count={'?'} />
                                </Tooltip>
                            ) : (
                                <></>
                            )}
                        </div>
                        <br />
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                            }}
                        >
                            <Title
                                heading={2}
                                style={{
                                    color: 'rgba(var(--semi-grey-9), 1)',
                                }}
                            >
                                {value}
                            </Title>
                        </div>
                    </div>
                </Col>
                <Col span={10}>
                    <div style={{ display: 'block' }}>{children}</div>
                </Col>
            </Row>
        </Card>
    );
};

export default Index;
