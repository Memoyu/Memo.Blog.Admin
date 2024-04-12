import React from 'react';

import Content from '@src/components/page-content';
import AnlyanisTop from './components/anlyanis-top';
import AnlyanisSecond from './components/anlyanis-second';
import AnlyanisThird from './components/anlyanis-third';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';

import './index.scss';

const Index: React.FC = () => {
    useOnMountUnsafe(() => {});

    return (
        <Content>
            <div className="anlyanis-container">
                <div className="anlyanis-container-top">
                    <AnlyanisTop />
                </div>
                <div className="anlyanis-container-second">
                    <AnlyanisSecond />
                </div>
                <div className="anlyanis-container-third">
                    <AnlyanisThird />
                </div>
            </div>
        </Content>
    );
};

export default Index;
