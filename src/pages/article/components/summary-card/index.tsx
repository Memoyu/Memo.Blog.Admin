import { FC } from 'react';
import { Card, Badge, Image, Typography, Tooltip } from '@douyinfe/semi-ui';
import './index.scss';

const { Title } = Typography;

interface SummaryCardProps {
    type: string;
    value: number | string;
    img: string;
    tip?: string;
}

const Index: FC<SummaryCardProps> = ({ type, value, img, tip }: SummaryCardProps) => {
    return (
        <Card
            style={{
                flex: 1,
                minWidth: '100px',
                borderRadius: '20px',
                background: 'rgba(var(--semi-green-0), 1)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
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
                <Image src={img} alt={'air'} width={80} height={80} preview={false} />
            </div>
        </Card>
    );
};

export default Index;
