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
    const banners: Array<BannerImage> = [
        {
            key: 1,
            title: '首页',
            desc: '',
        },
        { key: 2, title: '文章', desc: '' },
        { key: 3, title: '实验室', desc: '' },
        { key: 4, title: '动态', desc: '' },
        { key: 5, title: '关于我', desc: '' },
    ];

    const [bannerConfig, setBannerConfig] = useState<BannerConfigModel>({} as BannerConfigModel);

    useEffect(() => {
        if (banner == undefined) return;
        setBannerConfig(banner);
    }, [banner]);

    const handleUploadImageSuccess = (key: number, url: string) => {
        switch (key) {
            case 1:
                bannerConfig.home = url;
                break;
            case 2:
                bannerConfig.article = url;
                break;
            case 3:
                bannerConfig.lab = url;
                break;
            case 4:
                bannerConfig.moment = url;
                break;
            case 5:
                bannerConfig.about = url;
                break;
        }
        setBannerConfig(bannerConfig);
        onChange && onChange(bannerConfig);
    };
    const handleUploadImageRemove = (key: number) => {
        console.log('图片清除');
        switch (key) {
            case 1:
                bannerConfig.home = '';
                break;
            case 2:
                bannerConfig.article = '';
                break;
            case 3:
                bannerConfig.lab = '';
                break;
            case 4:
                bannerConfig.moment = '';
                break;
            case 5:
                bannerConfig.about = '';
                break;
        }
        setBannerConfig(bannerConfig);
        onChange && onChange(bannerConfig);
    };

    const getBannerUrl = (key: number) => {
        switch (key) {
            case 1:
                return bannerConfig?.home;
            case 2:
                return bannerConfig?.article;
            case 3:
                return bannerConfig?.lab;
            case 4:
                return bannerConfig?.moment;
            case 5:
                return bannerConfig?.about;
        }
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
                                    onRemove={() => handleUploadImageRemove(item.key)}
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
