import echarts from '@src/common/echarts';

export const dashboardPvAnlyanisOption = {
    color: ['rgba(166,127,221)'],
    tooltip: {
        trigger: 'axis',
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            show: false,
        },
    ],
    yAxis: [
        {
            type: 'value',
            show: false,
        },
    ],
    series: [
        {
            type: 'line',
            smooth: true,
            showSymbol: false,
            areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgba(166,127,221)',
                    },
                    {
                        offset: 1,
                        color: 'rgba(226, 209, 224)',
                    },
                ]),
            },
            emphasis: {
                focus: 'series',
            },
            data: [] as any[],
        },
    ],
};

export const dashboardUvAnlyanisOption = {
    color: ['rgba(166,127,221)'],
    tooltip: {
        trigger: 'axis',
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            show: false,
        },
    ],
    yAxis: [
        {
            type: 'value',
            show: false,
        },
    ],
    series: [
        {
            type: 'line',
            smooth: true,
            showSymbol: false,
            areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgba(166,127,221)',
                    },
                    {
                        offset: 1,
                        color: 'rgba(226, 209, 224)',
                    },
                ]),
            },
            emphasis: {
                focus: 'series',
            },
            data: [] as any[],
        },
    ],
};

export const dashboardCommentAnlyanisOption = {
    color: ['rgba(166,127,221)'],
    tooltip: {
        trigger: 'axis',
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            show: false,
        },
    ],
    yAxis: [
        {
            type: 'value',
            show: false,
        },
    ],
    series: [
        {
            type: 'line',
            smooth: true,
            showSymbol: false,
            areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgba(166,127,221)',
                    },
                    {
                        offset: 1,
                        color: 'rgba(226, 209, 224)',
                    },
                ]),
            },
            emphasis: {
                focus: 'series',
            },
            data: [] as any[],
        },
    ],
};

export const dashboardCategoryAnlyanisOption = {
    title: {
        text: '文章分类',
        textStyle: {
            // color: 'var(--semi-color-text-0)',
        },
    },
    tooltip: {
        trigger: 'item',
        formatter: function (params: any) {
            return `${params.marker}${params.data.title}<span style="float: right; margin-left: 20px"><b>${params.value}篇</span>`;
        },
    },
    legend: {
        bottom: '0%',
        left: 'center',
    },
    series: [
        {
            name: '关联文章数',
            type: 'pie',
            radius: ['20%', '50%'],
            minShowLabelAngle: 1,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2,
            },
            labelLine: {
                show: true,
            },
            data: [] as Array<any>,
        },
    ],
};

export const dashboardTagAnlyanisOption = {
    title: {
        text: '文章标签',
        textStyle: {
            // color: 'var(--semi-color-text-0)',
        },
    },
    tooltip: {
        trigger: 'item',
        formatter: function (params: any) {
            return `${params.marker}${params.data.title}<span style="float: right; margin-left: 20px"><b>${params.value}篇</span>`;
        },
    },
    legend: {
        bottom: '0%',
        left: 'center',
    },
    series: [
        {
            name: '关联文章数',
            type: 'pie',
            radius: ['20%', '50%'],
            minShowLabelAngle: 1,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2,
            },
            labelLine: {
                show: true,
            },
            data: [] as Array<any>,
        },
    ],
};

export const articleSummaryAnlyanisOption = {
    color: ['rgba(166,127,221)'],
    tooltip: {
        trigger: 'axis',
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            show: false,
        },
    ],
    yAxis: [
        {
            type: 'value',
            show: false,
        },
    ],
    series: [
        {
            type: 'line',
            smooth: true,
            showSymbol: false,
            areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgba(166,127,221)',
                    },
                    {
                        offset: 1,
                        color: 'rgba(226, 209, 224)',
                    },
                ]),
            },
            emphasis: {
                focus: 'series',
            },
            data: [] as any[],
        },
    ],
};

//城市经纬度
export const ChinaCityGeoCoordMap: Record<string, number[]> = {
    北京市: [116.405285, 39.904989],
    上海市: [121.472644, 31.231706],
    天津市: [117.190182, 39.125596],
    重庆市: [106.504962, 29.533155],
    昆明市: [102.712251, 25.040609],
    曲靖市: [103.797851, 25.501557],
    玉溪市: [102.543907, 24.350461],
    保山市: [99.167133, 25.111802],
    昭通市: [103.717216, 27.336999],
    丽江市: [100.233026, 26.872108],
    普洱市: [100.972344, 22.777321],
    临沧市: [100.08697, 23.886567],
    楚雄: [101.546046, 25.041988],
    红河: [103.384182, 23.366775],
    文山: [104.24401, 23.36951],
    西双版纳: [100.797941, 22.001724],
    大理: [100.225668, 25.589449],
    德宏: [98.578363, 24.436694],
    怒江: [98.854304, 25.850949],
    迪庆: [99.706463, 27.826853],
    呼和浩特市: [111.670801, 40.818311],
    包头市: [109.840405, 40.658168],
    乌海市: [106.825563, 39.673734],
    赤峰市: [118.956806, 42.275317],
    通辽市: [122.263119, 43.617429],
    鄂尔多斯市: [109.99029, 39.817179],
    呼伦贝尔市: [119.758168, 49.215333],
    巴彦淖尔市: [107.416959, 40.757402],
    乌兰察布市: [113.114543, 41.034126],
    兴安盟: [122.070317, 46.076268],
    锡林郭勒盟: [116.090996, 43.944018],
    阿拉善盟: [105.706422, 38.844814],
    长春市: [125.3245, 43.886841],
    吉林市: [126.55302, 43.843577],
    四平市: [124.370785, 43.170344],
    辽源市: [125.145349, 42.902692],
    通化市: [125.936501, 41.721177],
    白山市: [126.427839, 41.942505],
    松原市: [124.823608, 45.118243],
    白城市: [122.841114, 45.619026],
    延边: [129.513228, 42.904823],
    成都市: [104.065735, 30.659462],
    自贡市: [104.773447, 29.352765],
    攀枝花市: [101.716007, 26.580446],
    泸州市: [105.443348, 28.889138],
    德阳市: [104.398651, 31.127991],
    绵阳市: [104.741722, 31.46402],
    广元市: [105.829757, 32.433668],
    遂宁市: [105.571331, 30.513311],
    内江市: [105.066138, 29.58708],
    乐山市: [103.761263, 29.582024],
    南充市: [106.082974, 30.795281],
    眉山市: [103.831788, 30.048318],
    宜宾市: [104.630825, 28.760189],
    广安市: [106.633369, 30.456398],
    达州市: [107.502262, 31.209484],
    雅安市: [103.001033, 29.987722],
    巴中市: [106.753669, 31.858809],
    资阳市: [104.641917, 30.122211],
    阿坝: [102.221374, 31.899792],
    甘孜: [101.963815, 30.050663],
    凉山: [102.258746, 27.886762],
    合肥市: [117.283042, 31.86119],
    芜湖市: [118.376451, 31.326319],
    蚌埠市: [117.363228, 32.939667],
    淮南市: [117.018329, 32.647574],
    马鞍山市: [118.507906, 31.689362],
    淮北市: [116.794664, 33.971707],
    铜陵市: [117.816576, 30.929935],
    安庆市: [117.043551, 30.50883],
    黄山市: [118.317325, 29.709239],
    滁州市: [118.316264, 32.303627],
    阜阳市: [115.819729, 32.896969],
    宿州市: [116.984084, 33.633891],
    六安市: [116.507676, 31.752889],
    亳州市: [115.782939, 33.869338],
    池州市: [117.489157, 30.656037],
    宣城市: [118.757995, 30.945667],
    济南市: [117.000923, 36.675807],
    青岛市: [120.355173, 36.082982],
    淄博市: [118.047648, 36.814939],
    枣庄市: [117.557964, 34.856424],
    东营市: [118.66471, 37.434564],
    烟台市: [121.391382, 37.539297],
    潍坊市: [119.107078, 36.70925],
    济宁市: [116.587245, 35.415393],
    泰安市: [117.129063, 36.194968],
    威海市: [122.116394, 37.509691],
    日照市: [119.461208, 35.428588],
    莱芜市: [117.677736, 36.214397],
    临沂市: [118.326443, 35.065282],
    德州市: [116.307428, 37.453968],
    聊城市: [115.980367, 36.456013],
    滨州市: [118.016974, 37.383542],
    菏泽市: [115.469381, 35.246531],
    太原市: [112.549248, 37.857014],
    大同市: [113.295259, 40.09031],
    阳泉市: [113.583285, 37.861188],
    长治市: [113.113556, 36.191112],
    晋城市: [112.851274, 35.497553],
    朔州市: [112.433387, 39.331261],
    晋中市: [112.736465, 37.696495],
    运城市: [111.003957, 35.022778],
    忻州市: [112.733538, 38.41769],
    临汾市: [111.517973, 36.08415],
    吕梁市: [111.134335, 37.524366],
    广州市: [113.280637, 23.125178],
    韶关市: [113.591544, 24.801322],
    深圳市: [114.085947, 22.547],
    珠海市: [113.553986, 22.224979],
    汕头市: [116.708463, 23.37102],
    佛山市: [113.122717, 23.028762],
    江门市: [113.094942, 22.590431],
    湛江市: [110.364977, 21.274898],
    茂名市: [110.919229, 21.659751],
    肇庆市: [112.472529, 23.051546],
    惠州市: [114.412599, 23.079404],
    梅州市: [116.117582, 24.299112],
    汕尾市: [115.364238, 22.774485],
    河源市: [114.697802, 23.746266],
    阳江市: [111.975107, 21.859222],
    清远市: [113.051227, 23.685022],
    东莞市: [113.746262, 23.046237],
    中山市: [113.382391, 22.521113],
    东沙群岛: [116.887312, 20.617512],
    潮州市: [116.632301, 23.661701],
    揭阳市: [116.355733, 23.543778],
    云浮市: [112.044439, 22.929801],
    南宁市: [108.320004, 22.82402],
    柳州市: [109.411703, 24.314617],
    桂林市: [110.299121, 25.274215],
    梧州市: [111.297604, 23.474803],
    北海市: [109.119254, 21.473343],
    防城港市: [108.345478, 21.614631],
    钦州市: [108.624175, 21.967127],
    贵港市: [109.602146, 23.0936],
    玉林市: [110.154393, 22.63136],
    百色市: [106.616285, 23.897742],
    贺州市: [111.552056, 24.414141],
    河池市: [108.062105, 24.695899],
    来宾市: [109.229772, 23.733766],
    崇左市: [107.353926, 22.404108],
    乌鲁木齐: [87.617733, 43.792818],
    克拉玛依: [84.873946, 45.595886],
    吐鲁番: [89.184078, 42.947613],
    哈密市: [93.51316, 42.833248],
    昌吉: [87.304012, 44.014577],
    博尔塔拉: [82.074778, 44.903258],
    巴音郭楞: [86.150969, 41.768552],
    阿克苏: [80.265068, 41.170712],
    克孜勒苏: [76.172825, 39.713431],
    喀什: [75.989138, 39.467664],
    和田: [79.92533, 37.110687],
    伊犁: [81.317946, 43.92186],
    塔城: [82.985732, 46.746301],
    阿勒泰: [88.13963, 47.848393],
    石河子市: [86.041075, 44.305886],
    阿拉尔市: [81.285884, 40.541914],
    图木舒克市: [79.077978, 39.867316],
    五家渠市: [87.526884, 44.167401],
    北屯市: [87.824932, 47.353177],
    铁门关市: [85.501218, 41.827251],
    双河市: [82.353656, 44.840524],
    可克达拉市: [80.63579, 43.6832],
    昆玉市: [79.287372, 37.207994],
    南京市: [118.767413, 32.041544],
    无锡市: [120.301663, 31.574729],
    徐州市: [117.184811, 34.261792],
    常州市: [119.946973, 31.772752],
    苏州市: [120.619585, 31.299379],
    南通市: [120.864608, 32.016212],
    连云港市: [119.178821, 34.600018],
    淮安市: [119.021265, 33.597506],
    盐城市: [120.139998, 33.377631],
    扬州市: [119.421003, 32.393159],
    镇江市: [119.452753, 32.204402],
    泰州市: [119.915176, 32.484882],
    宿迁市: [118.275162, 33.963008],
    南昌市: [115.892151, 28.676493],
    景德镇市: [117.214664, 29.29256],
    萍乡市: [113.852186, 27.622946],
    九江市: [115.992811, 29.712034],
    新余市: [114.930835, 27.810834],
    鹰潭市: [117.033838, 28.238638],
    赣州市: [114.940278, 25.85097],
    吉安市: [114.986373, 27.111699],
    宜春市: [114.391136, 27.8043],
    抚州市: [116.358351, 27.98385],
    上饶市: [117.971185, 28.44442],
    石家庄市: [114.502461, 38.045474],
    唐山市: [118.175393, 39.635113],
    秦皇岛市: [119.586579, 39.942531],
    邯郸市: [114.490686, 36.612273],
    邢台市: [114.508851, 37.0682],
    保定市: [115.482331, 38.867657],
    张家口市: [114.884091, 40.811901],
    承德市: [117.939152, 40.976204],
    沧州市: [116.857461, 38.310582],
    廊坊市: [116.704441, 39.523927],
    衡水市: [115.665993, 37.735097],
    郑州市: [113.665412, 34.757975],
    开封市: [114.341447, 34.797049],
    洛阳市: [112.434468, 34.663041],
    平顶山市: [113.307718, 33.735241],
    安阳市: [114.352482, 36.103442],
    鹤壁市: [114.295444, 35.748236],
    新乡市: [113.883991, 35.302616],
    焦作市: [113.238266, 35.23904],
    濮阳市: [115.041299, 35.768234],
    许昌市: [113.826063, 34.022956],
    漯河市: [114.026405, 33.575855],
    三门峡市: [111.194099, 34.777338],
    南阳市: [112.540918, 32.999082],
    商丘市: [115.650497, 34.437054],
    信阳市: [114.075031, 32.123274],
    周口市: [114.649653, 33.620357],
    驻马店市: [114.024736, 32.980169],
    济源市: [112.590047, 35.090378],
    杭州市: [120.153576, 30.287459],
    宁波市: [121.549792, 29.868388],
    温州市: [120.672111, 28.000575],
    嘉兴市: [120.750865, 30.762653],
    湖州市: [120.102398, 30.867198],
    绍兴市: [120.582112, 29.997117],
    金华市: [119.649506, 29.089524],
    衢州市: [118.87263, 28.941708],
    舟山市: [122.106863, 30.016028],
    台州市: [121.428599, 28.661378],
    丽水市: [119.921786, 28.451993],
    海口市: [110.33119, 20.031971],
    三亚市: [109.508268, 18.247872],
    三沙市: [112.34882, 16.831039],
    儋州市: [109.576782, 19.517486],
    五指山市: [109.516662, 18.776921],
    琼海市: [110.466785, 19.246011],
    文昌市: [110.753975, 19.612986],
    万宁市: [110.388793, 18.796216],
    东方市: [108.653789, 19.10198],
    定安县: [110.349235, 19.684966],
    屯昌县: [110.102773, 19.362916],
    澄迈县: [110.007147, 19.737095],
    临高县: [109.687697, 19.908293],
    白沙: [109.452606, 19.224584],
    昌江: [109.053351, 19.260968],
    乐东: [109.175444, 18.74758],
    陵水: [110.037218, 18.505006],
    保亭: [109.70245, 18.636371],
    琼中: [109.839996, 19.03557],
    武汉市: [114.298572, 30.584355],
    黄石市: [115.077048, 30.220074],
    十堰市: [110.787916, 32.646907],
    宜昌市: [111.290843, 30.702636],
    襄阳市: [112.144146, 32.042426],
    鄂州市: [114.890593, 30.396536],
    荆门市: [112.204251, 31.03542],
    孝感市: [113.926655, 30.926423],
    荆州市: [112.23813, 30.326857],
    黄冈市: [114.879365, 30.447711],
    咸宁市: [114.328963, 29.832798],
    随州市: [113.37377, 31.717497],
    恩施: [109.48699, 30.283114],
    仙桃市: [113.453974, 30.364953],
    潜江市: [112.896866, 30.421215],
    天门市: [113.165862, 30.653061],
    神农架: [110.671525, 31.744449],
    长沙市: [112.982279, 28.19409],
    株洲市: [113.151737, 27.835806],
    湘潭市: [112.944052, 27.82973],
    衡阳市: [112.607693, 26.900358],
    邵阳市: [111.46923, 27.237842],
    岳阳市: [113.132855, 29.37029],
    常德市: [111.691347, 29.040225],
    张家界市: [110.479921, 29.127401],
    益阳市: [112.355042, 28.570066],
    郴州市: [113.032067, 25.793589],
    永州市: [111.608019, 26.434516],
    怀化市: [109.97824, 27.550082],
    娄底市: [112.008497, 27.728136],
    湘西: [109.739735, 28.314296],
    兰州市: [103.823557, 36.058039],
    嘉峪关市: [98.277304, 39.786529],
    金昌市: [102.187888, 38.514238],
    白银市: [104.173606, 36.54568],
    天水市: [105.724998, 34.578529],
    武威市: [102.634697, 37.929996],
    张掖市: [100.455472, 38.932897],
    平凉市: [106.684691, 35.54279],
    酒泉市: [98.510795, 39.744023],
    庆阳市: [107.638372, 35.734218],
    定西市: [104.626294, 35.579578],
    陇南市: [104.929379, 33.388598],
    临夏: [103.212006, 35.599446],
    甘南: [102.911008, 34.986354],
    福州市: [119.306239, 26.075302],
    厦门市: [118.11022, 24.490474],
    莆田市: [119.007558, 25.431011],
    三明市: [117.635001, 26.265444],
    泉州市: [118.589421, 24.908853],
    漳州市: [117.661801, 24.510897],
    南平市: [118.178459, 26.635627],
    龙岩市: [117.02978, 25.091603],
    宁德市: [119.527082, 26.65924],
    拉萨市: [91.132212, 29.660361],
    日喀则市: [88.885148, 29.267519],
    昌都市: [97.178452, 31.136875],
    林芝市: [94.362348, 29.654693],
    山南市: [91.766529, 29.236023],
    那曲: [92.060214, 31.476004],
    阿里: [80.105498, 32.503187],
    贵阳市: [106.713478, 26.578343],
    六盘水市: [104.846743, 26.584643],
    遵义市: [106.937265, 27.706626],
    安顺市: [105.932188, 26.245544],
    毕节市: [105.28501, 27.301693],
    铜仁市: [109.191555, 27.718346],
    黔西南: [104.897971, 25.08812],
    黔东南: [107.977488, 26.583352],
    黔南: [107.517156, 26.258219],
    沈阳市: [123.429096, 41.796767],
    大连市: [121.618622, 38.91459],
    鞍山市: [122.995632, 41.110626],
    抚顺市: [123.921109, 41.875956],
    本溪市: [123.770519, 41.297909],
    丹东市: [124.383044, 40.124296],
    锦州市: [121.135742, 41.119269],
    营口市: [122.235151, 40.667432],
    阜新市: [121.648962, 42.011796],
    辽阳市: [123.18152, 41.269402],
    盘锦市: [122.06957, 41.124484],
    铁岭市: [123.844279, 42.290585],
    朝阳市: [120.451176, 41.576758],
    葫芦岛市: [120.856394, 40.755572],
    西安市: [108.948024, 34.263161],
    铜川市: [108.979608, 34.916582],
    宝鸡市: [107.14487, 34.369315],
    咸阳市: [108.705117, 34.333439],
    渭南市: [109.502882, 34.499381],
    延安市: [109.49081, 36.596537],
    汉中市: [107.028621, 33.077668],
    榆林市: [109.741193, 38.290162],
    安康市: [109.029273, 32.6903],
    商洛市: [109.939776, 33.868319],
    西宁市: [101.778916, 36.623178],
    海东市: [102.10327, 36.502916],
    海北: [100.901059, 36.959435],
    黄南: [102.019988, 35.517744],
    海南: [100.619542, 36.280353],
    果洛: [100.242143, 34.4736],
    玉树: [97.008522, 33.004049],
    海西蒙古族: [97.370785, 37.374663],
    哈尔滨市: [126.642464, 45.756967],
    齐齐哈尔市: [123.95792, 47.342081],
    鸡西市: [130.975966, 45.300046],
    鹤岗市: [130.277487, 47.332085],
    双鸭山市: [131.157304, 46.643442],
    大庆市: [125.11272, 46.590734],
    伊春市: [128.899396, 47.724775],
    佳木斯市: [130.361634, 46.809606],
    七台河市: [131.015584, 45.771266],
    牡丹江市: [129.618602, 44.582962],
    黑河市: [127.499023, 50.249585],
    绥化市: [126.99293, 46.637393],
    大兴安岭: [124.711526, 52.335262],
};

//地图配置项
export const uniqueVisitorSactterMapOption = {
    title: {
        text: '访客地图',
    },
    legend: {
        data: ['访问人数'], //与series的name属性对应
        orient: 'vertical',
        y: 'bottom',
        x: 'right',
        textStyle: {
            color: '#fff',
        },
    },
    tooltip: {
        trigger: 'item',
        formatter: function (params: any) {
            return params.name + ' : ' + params.value[2];
        },
    },
    visualMap: {
        min: 0,
        max: 200,
        calculable: true,
        inRange: {
            color: ['#50a3ba', '#eac736', '#d94e5d'],
        },
        textStyle: {
            color: '#fff',
        },
    },
    geo: {
        map: 'china',
        roam: false, //开启鼠标缩放和漫游
        zoom: 1, //地图缩放级别
        selectedMode: false, //选中模式：single | multiple
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        layoutCenter: ['50%', '50%'], //设置后left/right/top/bottom等属性无效
        layoutSize: '100%',

        itemStyle: {
            areaColor: '#101f32',
            borderWidth: 1.1,
            borderColor: '#43d0d6',
        },
        emphasis: {
            label: {
                show: false,
            },
            itemStyle: {
                areaColor: '#069',
            },
        },
    },
    series: [
        {
            name: '访问人数',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: 12,
            emphasis: {
                label: {
                    show: false,
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1,
                },
            },
            data: [] as Array<any>,
        },
    ],
};
