import { FC, useEffect, useState } from 'react';
import { Typography, List } from '@douyinfe/semi-ui';

import './index.scss';
import UploadImage from '@src/components/upload-image';
import { BannerConfigModel } from '@src/common/model';

interface BannerImage {
    key: number;
    title: string;
    desc: string;
}

interface ComProps {
    banner: BannerConfigModel | undefined;
    onChange?: (banner: BannerConfigModel) => void;
}

const { Text } = Typography;

const Index: FC<ComProps> = ({ banner, onChange }) => {
    const [bannerConfig, setBannerConfig] = useState<BannerConfigModel>();

    const banners: Array<BannerImage> = [
        {
            key: 1,
            title: '首页',
            desc: '(首页)',
        },
        { key: 2, title: '文章', desc: '(文章)' },
        { key: 3, title: '实验室', desc: '(实验室)' },
        { key: 4, title: '动态', desc: '(动态)' },
        { key: 5, title: '关于我', desc: '(关于我)' },
    ];

    useEffect(() => {
        setBannerConfig(banner);
    }, [banner]);

    const handleUploadImageSuccess = (key: number, url: string) => {
        let banner = {} as BannerConfigModel;
        switch (key) {
            case 1:
                banner.home = url;
                break;
            case 2:
                banner.article = url;
                break;
            case 3:
                banner.lab = url;
                break;
            case 4:
                banner.moment = url;
                break;
            case 5:
                banner.about = url;
                break;
        }
        setBannerConfig(banner);
        onChange && onChange(banner);
    };

    const getBannerUrl = (key: number) => {
        let banner = {} as BannerConfigModel;
        switch (key) {
            case 1:
                return banner.home;
            case 2:
                return banner.article;
            case 3:
                return banner.lab;
            case 4:
                return banner.moment;
            case 5:
                return banner.about;
        }
        setBannerConfig(banner);
        onChange && onChange(banner);
    };

    return (
        <div className="config-banner">
            <List
                grid={{}}
                dataSource={banners}
                renderItem={(item) => (
                    <List.Item>
                        <div style={{ margin: 8 }} key={item.key}>
                            <div>
                                <Text strong style={{ fontSize: 15, marginRight: 15 }}>
                                    {item.title}
                                </Text>
                                <Text type="tertiary">{item.desc}</Text>
                            </div>
                            <div style={{ marginTop: 8 }}>
                                <UploadImage
                                    type="banner"
                                    url={getBannerUrl(item.key)}
                                    path="config/banner"
                                    onSuccess={(url) => handleUploadImageSuccess(item.key, url)}
                                />
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default Index;
