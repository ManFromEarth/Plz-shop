// pages/profile/vipCode/vipCode.js 
var host = require('../../../config').service.host
var sessionid = require('../../../utils/session.js').get()
Page({
  data: {
    vipCode: []
  },
  onLoad: function (options) {
    var that = this
    wx.request({
      url: `${host}/UserCenter/getUserRechargeCodeList.ashx?UserId=${sessionid}`,
      success: function (res) {
        if (res.data.length !== 0) {
          that.setData({
            vipCode: res.data
          })
        }
      }
    })
  },
  onReady: function () {
  },

  onShow: function () {
  }
})