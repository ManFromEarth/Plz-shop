const host = require('../../../config').service.host  
const sessionid = require('../../../utils/session').get() 
Page({
  data: {
    coupon: [

    ]
  },
  onLoad: function () {
    var that = this
    wx.request({
      url: `${host}/Coupon/GetCouponInfo.ashx?UserId=${sessionid}`,
      success: function (res) {
          that.setData({
            coupon: res.data
          })
      }
    })
  }
})