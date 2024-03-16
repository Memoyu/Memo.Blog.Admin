import { FC } from 'react';
import { Card, Tag, Image, Typography } from '@douyinfe/semi-ui';
import './index.scss';

const { Title } = Typography;

interface SummaryCardProps {
    type: string;
    value: string;
    img: string;
}

const Index: FC<SummaryCardProps> = ({ type, value, img }: SummaryCardProps) => {
    return (
        <Card
            style={{
                flex: 1,
                minWidth: '100px',
                //margin: '10px',
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
                    <Title
                        heading={6}
                        style={{
                            color: 'rgba(var(--semi-grey-9), 1)',
                        }}
                    >
                        {type}
                    </Title>
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
                <Image src={img} alt={'air'} width={80} height={80} />
            </div>
        </Card>
    );
};

export default Index;
