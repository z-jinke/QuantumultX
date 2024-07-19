// 2024.7.18

const url = $request.url;
const body = $response.body;
let obj = JSON.parse(body);

// 匹配启动页广告接口
if (/^https?:\/\/app\.bilibili\.com\/x\/v2\/splash\/list/.test(url)) {
    if (obj.data && obj.data.list) {
        obj.data.list = obj.data.list.map(item => ({
            ...item,
            duration: 0,
            begin_time: 9999999999,
            end_time: 9999999999
        }));
    }
    $done({ body: JSON.stringify(obj) });

// 匹配首页标签接口
} else if (/^https?:\/\/app\.bilibili\.com\/x\/resource\/show\/tab/.test(url)) {
    if (obj.data) {
        obj.data.tab = [
            { id: 40, name: "推荐", uri: "bilibili://pegasus/promo", tab_id: "推荐tab", pos: 2, default_selected: 1 },
            { id: 41, name: "热门", uri: "bilibili://pegasus/hottopic", tab_id: "hottopic", pos: 3 },
            { id: 2894, name: "番剧", uri: "bilibili://pgc/home", tab_id: "bangumi", pos: 4 },
            { id: 151, name: "影视", uri: "bilibili://pgc/cinema-tab", tab_id: "film", pos: 5 },
            { id: 39, name: "直播", uri: "bilibili://live/home", tab_id: "直播tab", pos: 1 }
        ];

        obj.data.top = [
            { id: 481, icon: "http://i0.hdslb.com/bfs/archive/d43047538e72c9ed8fd8e4e34415fbe3a4f632cb.png", name: "消息", uri: "bilibili://link/im_home", tab_id: "消息Top", pos: 1 }
        ];

        const excludeIds = new Set([103, 105, 107, 108]);
        if (obj.data.bottom) {
            obj.data.bottom = obj.data.bottom.filter(item => !excludeIds.has(item.id));
        }
        if (obj.data.top) {
            obj.data.top = obj.data.top.filter(item => !excludeIds.has(item.id));
        }
    }
    $done({ body: JSON.stringify(obj) });

// 匹配首页推荐接口
} else if (/^https?:\/\/app\.bilibili\.com\/x\/v2\/feed\/(index\/story|index)/.test(url)) {
    if (obj.data && obj.data.items) {
        obj.data.items = obj.data.items.filter(item => !item.banner_item && !item.ad_info && !item.ad);
    }
    $done({ body: JSON.stringify(obj) });

// 匹配番剧与影视页面接口    
} else if (/^https?:\/\/api\.bilibili\.com\/pgc\/page\/(cinema\/tab|bangumi)/.test(url)) {
    const excludeModuleIds = new Set([1441, 248, 1455, 1633, 1639]);
    if (obj.result && obj.result.modules) {
        obj.result.modules = obj.result.modules.filter(module => !excludeModuleIds.has(module.module_id));
    }
    $done({ body: JSON.stringify(obj) });

// 匹配账号页面（iPhone）接口    
} else if (/^https?:\/\/app\.bilibili\.com\/x\/v2\/account\/mine(?!\/ipad)/.test(url)) {
    const excludeIds = new Set([171, 172, 173, 174, 429, 431, 432, 950]);
    const excludeTitles = new Set(["创作中心", "推荐服务", "其他服务"]);
    if (obj.data && obj.data.sections_v2) {
        obj.data.sections_v2 = obj.data.sections_v2.filter(section => !excludeTitles.has(section.title));
        obj.data.sections_v2.forEach(section => {
            if (section.items) {
                section.items = section.items.filter(item => !excludeIds.has(item.id));
            }
        });
    }
    $done({ body: JSON.stringify(obj) });

// 匹配账号页面（iPad）接口    
} else if (/^https?:\/\/app\.bilibili\.com\/x\/v2\/account\/mine\/ipad/.test(url)) {
    const excludeTitles = new Set(["青少年守护"]);
    if (obj.data) {
        if (obj.data['ipad_more_sections']) {
            obj.data['ipad_more_sections'] = obj.data['ipad_more_sections'].filter(section => !excludeTitles.has(section.title));
        }
        delete obj.data['ipad_recommend_sections'];
        delete obj.data['ipad_upper_sections'];
    }
    $done({ body: JSON.stringify(obj) });
}
