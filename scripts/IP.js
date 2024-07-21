// 2024.7.21

const { body } = $response;
const { country_code: countryCode, ip } = JSON.parse(body);

// 定义国家代码与对应名称的映射
const countryFlags = {
    "HK": "香港", "JP": "日本", "TW": "台湾", "SG": "新加坡", "KR": "韩国", "US": "美国", "GB": "英国", "TH": "泰国", "DE": "德国", "FR": "法国", "IT": "意大利",
    "CA": "加拿大", "AU": "澳大利亚", "VN": "越南"
};

// 根据国家代码获取对应的名称
const flag = countryFlags[countryCode] || '';

// 构造标题和副标题
const title = `    ${countryCode}`;
const subtitle = `国家:${flag}—IP地址:${ip}`;

// 返回修改后的内容
$done({ title, ip, subtitle });
