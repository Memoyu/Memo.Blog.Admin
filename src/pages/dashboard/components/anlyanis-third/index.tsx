import { FC, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { Row, Col, Card, Descriptions, Typography } from '@douyinfe/semi-ui';
import echarts from '@src/common/echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { uniqueVisitorSactterMapOption, ChinaCityGeoCoordMap } from '@src/common/echart-options';

import './index.scss';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';
import { MetricItemModel } from '@src/common/model';
import { uniqueVisitorMapList } from '@src/utils/request';

const Index: FC = () => {
    const [_data, loading, _setData, setLoading] = useData<Array<MetricItemModel>>();

    const [uniqueVisitorMapOption, setUniqueVisitorMapOption] = useState(
        uniqueVisitorSactterMapOption
    );

    // 获取文章排名
    let getUniqueVisitorMapList = () => {
        setLoading(true);
        uniqueVisitorMapList()
            .then((res) => {
                if (!res.isSuccess || !res.data) return;

                let mapOption = cloneDeep(uniqueVisitorMapOption);
                let geos = convertGeoData(res.data);
                mapOption.series[0].data = geos;
                setUniqueVisitorMapOption(mapOption);
            })
            .finally(() => setLoading(false));
    };

    useOnMountUnsafe(() => {
        getUniqueVisitorMapList();
    });

    //数据转换，转换后的格式：[{name: 'cityName', value: [lng, lat, val]}, {...}]
    const convertGeoData = function (data: any) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var geoCoord = ChinaCityGeoCoordMap[data[i].name];
            if (geoCoord) {
                res.push({
                    name: data[i].name,
                    value: geoCoord.concat(data[i].value),
                });
            }
        }
        return res;
    };

    return (
        <div className="anlyanis-third-card-list">
            <Card loading={loading}>
                <Row gutter={20}>
                    <Col>
                        <ReactEChartsCore
                            echarts={echarts}
                            option={uniqueVisitorMapOption}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ minHeight: 600 }}
                        />
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Index;
