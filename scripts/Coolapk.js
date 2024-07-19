// 2024.7.18

const url = $request.url;
const body = $response.body;
let obj = JSON.parse(body);

// 匹配初始化接口
if (/^https:\/\/api\.coolapk\.com\/v6\/main\/init/.test(url)) {
    const entityIdSet = new Set([1742, 1966, 1681, 1633, 1710, 1754, 1229, 413, 417, 790, 813, 2191, 845, 2258, 1170, 1247, 2299, 2412, 2018]);
    if (obj.data && Array.isArray(obj.data)) {
        obj.data.forEach(item => {
            // 设置启动广告参数
            if (item.extraDataArr) {
                item.extraDataArr["SplashAd.timeout"] = "0";
                item.extraDataArr["SplashAd.Expires"] = 9999999999;
            }
            if (Array.isArray(item.entities)) {
                item.entities = item.entities.filter(entity => !entityIdSet.has(entity.entityId));
            }
        });
    }
    $done({ body: JSON.stringify(obj) });

// 匹配首页或搜索接口
} else if (url.includes('/v6/main/indexV8') || url.includes('/v6/search?')) {
    const filterIds = new Set([32557, 13635, 29349, 16977]);
    if (obj.data && Array.isArray(obj.data)) {
        obj.data = obj.data.filter(item => !filterIds.has(item.entityId));
        obj.data.forEach(item => delete item.extraDataArr);
    }
    $done({ body: JSON.stringify(obj) });

// 匹配账户配置接口
} else if (/^https:\/\/api\.coolapk\.com\/v6\/account\/loadConfig/.test(url)) {
    const filterIds = new Set([1002, 1005, 14809, 1004]);
    if (obj.data && Array.isArray(obj.data)) {
        obj.data = obj.data.filter(item => !filterIds.has(item.entityId));
    }
    $done({ body: JSON.stringify(obj) });

// 匹配信息流数据接口
} else if (/^https:\/\/api\.coolapk\.com\/v6\/page\/dataList/.test(url)) {
    const filterIds = new Set([12315, 8364, 14379, 24309, 35846, 35730, 12889]);
    if (obj.data && Array.isArray(obj.data)) {
        obj.data.forEach(item => delete item.extraDataArr);
        obj.data = obj.data.filter(item => !filterIds.has(item.entityId));
    }
    $done({ body: JSON.stringify(obj) });
}
