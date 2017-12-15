var qqmapkey = require('../config').key.qqmapkey
var QQmap = require('../vendors/qqmap.min.js')
var qqmap = new QQmap({
  key: qqmapkey
});
var getpoi = function (cb) {
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      var latitude = res.latitude
      var longitude = res.longitude
      qqmap.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function (res) {
          if(res.status===0){
            console.log(res);
            var poiDes = res.result.formatted_addresses.recommend
            cb(poiDes)
          }else{
            var poiDes='选择收货地址'
            cb(poiDes)
          }
        },
        fail:function(err){
          console.log(err)
          var poiDes = '选择收货地址'
          cb(poiDes)
        }
      });
    }
  })
}
var exports = module.exports = getpoi



