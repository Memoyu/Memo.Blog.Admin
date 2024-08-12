import { FC } from 'react';
import { ImagePreview, Image, Typography } from '@douyinfe/semi-ui';

import './index.scss';
import UploadImage from '@src/components/upload-image';

interface BannerImage {
    title: string;
    url: string;
}

const { Title } = Typography;

const Index: FC = () => {
    const banners: Array<BannerImage> = [
        {
            title: '文章 头图：',
            url: 'http://oss.blog.memoyu.com/articles/banner/502a2248-2ee7-48eb-af67-c5b0b9a9a5f1.png',
        },
        {
            title: '实验室 头图：',
            url: 'http://oss.blog.memoyu.com/page/about/banner/fc873d0f-b4bf-414b-8458-930de1d12d5d.png',
        },
        {
            title: '动态 头图：',
            url: 'http://oss.blog.memoyu.com/articles/bdbb6831-bccb-4139-96c7-b85395038d5e.png',
        },
        {
            title: '关于我 头图：',
            url: 'http://oss.blog.memoyu.com/page/about/846dc9f9-cef4-44e5-a078-dcc9dfb16507.png',
        },
    ];

    const handleSaveBanner = (url: string) => {};

    return (
        <div className="config-banner">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <UploadImage
                    type="image"
                    width={800}
                    height={500}
                    url={'http://oss.blog.memoyu.com/articles/banner/-9999077311f.png'}
                    path="config/banner"
                    onSuccess={handleSaveBanner}
                />
            </div>
            <div style={{ display: 'flex' }}>
                {banners.map((banner, index) => {
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Title heading={6}>{banner.title}</Title>
                            <UploadImage
                                type="banner"
                                url={banner.url}
                                path="config/banner"
                                onSuccess={handleSaveBanner}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Index;
