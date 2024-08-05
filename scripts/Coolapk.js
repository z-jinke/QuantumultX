// 2024.7.18

const url  = $request.url;
const body = $response.body;

// 初始化配置
if (/^https:\/\/api\.coolapk\.com\/v6\/main\/init/.test(url)) {
    let obj = JSON.parse(body);
    const entityIdSet = new Set([1742, 1966, 1681, 1633, 1710, 1754, 1229, 413, 417, 790, 813, 2191, 845, 2258, 1170, 1247, 2299, 2412, 2018]);
    if (obj.data && Array.isArray(obj.data)) {
        obj.data.forEach(item => {
            if (item.extraDataArr) {
                item.extraDataArr["SplashAd.timeout"] = "0";
                item.extraDataArr["SplashAd.Expires"] = 9999999999;
            }
            if (Array.isArray(item.entities)) {
                item.entities = item.entities.filter(
                    entity => !entityIdSet.has(entity.entityId)
                );
            }
        });
    }
    $done({ body: JSON.stringify(obj) });

// 首页和搜索
} else if (/^https:\/\/api\.coolapk\.com\/v6\/(main\/indexV8|search)/.test(url)) {
    let obj = JSON.parse(body);
    const filterIds = new Set([32557, 13635, 29349, 16977]);
    if (obj.data && Array.isArray(obj.data)) {
        obj.data = obj.data.filter(item => !filterIds.has(item.entityId));
        obj.data.forEach(item => {
            delete item.extraDataArr;
        });
    }
    $done({ body: JSON.stringify(obj) });

// 我的页面
} else if (/^https:\/\/api\.coolapk\.com\/v6\/account\/loadConfig/.test(url)) {
    let obj = JSON.parse(body);
    const filterIds = new Set([1002, 1005, 14809, 1004]);
    if (obj.data && Array.isArray(obj.data)) {
        obj.data = obj.data.filter(item => !filterIds.has(item.entityId));
    }
    $done({ body: JSON.stringify(obj) });

// 信息流广告
} else if (/^https:\/\/api\.coolapk\.com\/v6\/page\/dataList/.test(url)) {
    let obj = JSON.parse(body);
    const filterIds = new Set([12315, 8364, 14379, 24309, 35846, 35730, 12889]);
    if (obj.data && Array.isArray(obj.data)) {
        obj.data.forEach(item => {
            delete item.extraDataArr;
            delete item.lastupdate;
            delete item.entityFixed;
        });
        obj.data = obj.data.filter(item => !filterIds.has(item.entityId));
    }
    $done({ body: JSON.stringify(obj) });
}
