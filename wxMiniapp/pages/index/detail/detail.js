const host = require('../../../config.js').service.host   
const car = require('../../../utils/car')
Page({
  data: {
    postage: 39,
    currentSpec: 0,

  },
  onLoad: function (option) {
    var that = this
    var Pid = option.pid
    wx.request({
      url: `${host}/Product/getProductInfo.ashx?pid=${Pid}`,
      success: function (res) {
        var data = res.data
        that.setData({
          detail: data
        })
      }
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: this.data.detail.title,
      path: '/pages/index/detail/detail?identity=123',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  selectspec: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentSpec: index
    })
  },
  joincar: function () {
    var currentSpec = this.data.currentSpec
    var proItem = this.data.detail
     proItem.activeStandard = proItem.standardlist[currentSpec]
    car.join(proItem)
    wx.showLoading({
      title: '加入成功',
      icon:'success',
      duration:1000
    })
  }
})

