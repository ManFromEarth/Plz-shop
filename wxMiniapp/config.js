var name = '品丽州生鲜'
var env = 'pro' //pro,dev
// var host = 'http://www.plz.com/WxInterface'
var host = 'https://plz.lianjin8.com/WxInterface'
var config = {
  service: {
    host,
    loginUrl: `${host}/login.ashx`,
    requestUrl: `${host}/user`,
    paymentUrl: `${host}/payment`,
    tunnelUrl: `${host}/tunnel`
  },
  key: {
    qqmapkey: 'GRPBZ-PYX6V-FHLPJ-UICXJ-7BWFT-UTBKZ',
    appid: 'wx206249b50ecfe0df',
    appsecret: '',
    mch_key: 'Zhoufengqi5522331144668877998888'
  }
};
module.exports = config;
