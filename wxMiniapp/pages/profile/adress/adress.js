const sessionid = require('../../../utils/session').get()  
const host = require('../../../config').service.host 
Page({
  data: {
    adress: [
    ]
  },
  onLoad: function (options) {
  },
  onReady: function () {

  },
  onShow: function () {
    var that = this
    wx.request({
      url: `${host}/Address/GetAddressInfo.ashx?UserId=${sessionid}`,
      success: function (res) {
        var data = res.data
        that.setData({
          adress: data
        })
      }
    })

  },
  adress: function () {
  },
  defaultchange: function (ev) {
    var that = this
    var Id = ev.currentTarget.dataset.id
    wx.request({
      url: `${host}/Address/setAdreeIsDefualt.ashx?Id=${Id}`,
      success: function (res) {
        if (res.data.State === 'ok') {
          that.onShow()
        }
      }

    })
  },
  deladress: function (ev) {
    var that = this
    var Id = ev.currentTarget.dataset.id
    wx.request({
      url: `${host}/Address/deleteAddress.ashx?Id=${Id}`,
      success: function (res) {
        if (res.data.State === 'ok') {
          that.onShow()
        }
      }
    })
  }

})