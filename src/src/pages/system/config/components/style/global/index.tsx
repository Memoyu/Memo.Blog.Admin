import { FC } from 'react';
import { ImagePreview, Image, Typography, Row, Col, List } from '@douyinfe/semi-ui';

import './index.scss';
import UploadImage from '@src/components/upload-image';
import Section from '@douyinfe/semi-ui/lib/es/form/section';

interface BannerImage {
    title: string;
    desc: string;
    url: string;
}

const { Text } = Typography;

const Index: FC = () => {
    const banners: Array<BannerImage> = [
        {
            title: '首页：',
            desc: '(首页)',
            url: 'http://oss.blog.memoyu.com/articles/banner/502a2248-2ee7-48eb-af67-c5b0b9a9a5f1.png',
        },
        {
            title: '文章：',
            desc: '(文章)',
            url: 'http://oss.blog.memoyu.com/articles/banner/502a2248-2ee7-48eb-af67-c5b0b9a9a5f1.png',
        },
        {
            title: '实验室：',
            desc: '(实验室)',
            url: 'http://oss.blog.memoyu.com/page/about/banner/fc873d0f-b4bf-414b-8458-930de1d12d5d.png',
        },
        {
            title: '动态：',
            desc: '(动态)',
            url: 'http://oss.blog.memoyu.com/page/about/banner/fc873d0f-b4bf-414b-8458-930de1d12d5d.png',
        },
        {
            title: '关于我：',
            desc: '(关于我)',
            url: 'http://oss.blog.memoyu.com/page/about/846dc9f9-cef4-44e5-a078-dcc9dfb16507.png',
        },
    ];

    const handleSaveBanner = (url: string) => {};

    return (
        <div className="config-banner">
            <Section text={'页面头图'}>
                <List
                    grid={{
                        gutter: 10,
                        span: 6,
                    }}
                    dataSource={banners}
                    renderItem={(item) => (
                        <List.Item>
                            <div style={{ margin: 8 }}>
                                <div>
                                    <Text strong style={{ fontSize: 15 }}>
                                        {item.title}
                                    </Text>
                                    <Text type="tertiary">{item.desc}</Text>
                                </div>
                                <div style={{ marginTop: 8 }}>
                                    <UploadImage
                                        type="banner"
                                        url={item.url}
                                        path="config/banner"
                                        onSuccess={handleSaveBanner}
                                    />
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </Section>
        </div>
    );
};

export default Index;
