import React, { useState } from 'react';
import './index.scss';
import Content from '@src/components/page-content';
import AnlyanisTop from './components/anlyanis-top';
import AnlyanisSecond from './components/anlyanis-second';
import AnlyanisThird from './components/anlyanis-third';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';

const Index: React.FC = () => {
    const [loading, setLoading] = useState(true);
    setTimeout(() => setLoading(false), 1000);

    useOnMountUnsafe(() => {});

    return (
        <Content>
            <div className="anlyanis-container">
                <div className="anlyanis-container-top">
                    <AnlyanisTop loading={loading} />
                </div>
                <div className="anlyanis-container-second">
                    <AnlyanisSecond loading={loading} />
                </div>
                <div className="anlyanis-container-third">
                    <AnlyanisThird loading={loading} />
                </div>
            </div>
        </Content>
    );
};

export default Index;
