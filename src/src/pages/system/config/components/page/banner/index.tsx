import { FC, useEffect, useState } from 'react';
import './index.scss';
import { Typography, List } from '@douyinfe/semi-ui';

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

    const [bannerConfig, setBannerConfig] = useState<BannerConfigModel>();

    useEffect(() => {
        // console.log('头图加载', banner);
        setBannerConfig(banner);
    }, [banner]);

    const handleUploadImageSuccess = (key: number, url: string) => {
        //console.log('图片上传', key, url);
        setBannerUrl(key, url);
    };

    const handleUploadImageRemove = (key: number) => {
        // console.log('图片清除');
        setBannerUrl(key, '');
    };

    const setBannerUrl = (key: number, url: string) => {
        let bc = bannerConfig
            ? bannerConfig
            : { home: '', article: '', lab: '', moment: '', about: '' };
        switch (key) {
            case 1:
                bc.home = url;
                break;
            case 2:
                bc.article = url;
                break;
            case 3:
                bc.lab = url;
                break;
            case 4:
                bc.moment = url;
                break;
            case 5:
                bc.about = url;
                break;
        }
        setBannerConfig(bc);
        onChange && onChange(bc);
    };

    const getBannerUrl = (key: number) => {
        //console.log('获取图片', banner);
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
