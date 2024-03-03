import { FC } from 'react';
import { Card, Tag, Image, Typography } from '@douyinfe/semi-ui';
import './index.scss';

const { Title } = Typography;

interface SummaryCardProps {
    type: string;
    status: boolean;
    value: string;
    img: string;
}

const Index: FC<SummaryCardProps> = ({ type, status, value, img }: SummaryCardProps) => {
    return (
        <Card
            style={{
                flex: 1,
                minWidth: '230px',
                margin: '10px',
                borderRadius: '20px',
                background: status ? 'rgba(var(--semi-green-0), 1)' : '',
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
                        <Tag
                            style={{
                                marginLeft: '5px',
                            }}
                            size="small"
                            shape="circle"
                            color={status ? 'green' : 'amber'}
                        >
                            {' '}
                            {status ? '运行中' : '已关闭'}{' '}
                        </Tag>
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
                            heading={4}
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
