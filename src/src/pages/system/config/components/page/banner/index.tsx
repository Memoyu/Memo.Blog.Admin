import { FC, useEffect, useState } from 'react';
import './index.scss';
import { Typography, List } from '@douyinfe/semi-ui';

import BannerItem from './components/banner-item';

import { BannerConfigModel, BannerInfoModel } from '@src/common/model';

interface BannerEditor {
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

    const banners: Array<BannerEditor> = [
        { key: 1, title: '首页', desc: '' },
        { key: 2, title: '文章', desc: '' },
        { key: 3, title: '实验室', desc: '' },
        { key: 4, title: '动态', desc: '' },
        { key: 5, title: '关于我', desc: '' },
    ];

    useEffect(() => {
        // console.log('头图加载', banner);
        setBannerConfig(banner);
    }, [banner]);

    const handleBannerItemChange = (key: number, item: BannerInfoModel) => {
        let bc = bannerConfig
            ? bannerConfig
            : { home: {}, article: {}, lab: {}, moment: {}, about: {} };
        switch (key) {
            case 1:
                bc.home = item;
                break;
            case 2:
                bc.article = item;
                break;
            case 3:
                bc.lab = item;
                break;
            case 4:
                bc.moment = item;
                break;
            case 5:
                bc.about = item;
                break;
        }

        setBannerConfig(bc);
        onChange && onChange(bc);
    };

    const getBanner = (key: number) => {
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
                        <div style={{ width: 300, margin: 8 }} key={item.key}>
                            <div>
                                <Text strong style={{ fontSize: 15, marginRight: 15 }}>
                                    {item.title}
                                </Text>
                                <Text type="tertiary">{item.desc}</Text>
                            </div>
                            <BannerItem
                                banner={getBanner(item.key)}
                                onChange={(val) => handleBannerItemChange(item.key, val)}
                            />
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default Index;
