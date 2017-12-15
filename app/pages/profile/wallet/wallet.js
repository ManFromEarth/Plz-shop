var host = require('../../../config').service.host   
var sessionid = require('../../../utils/session.js').get()
Page({
  data: {
    balance: 0,
    currentIndex: 0,
    quotas: []
  },
  onLoad: function (options) {
    var that = this
    wx.request({
      url: `${host}/UserCenter/getUserCenter.ashx?UserId=${sessionid}`,
      success: function (res) {
        if (res.data.State !== 'error') {
          var Amount = res.data.Amount
          that.setData({
            balance: Amount
          })
        }
      }
    })
    wx.request({
      url: `${host}/UserCenter/getLevelList.ashx`,
      success: function (res) {
        if (res.data) {
          var quotas = res.data
          that.setData({
            quotas: quotas
          })
        }
      }
    })
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  choosequotas: function (e) {
    var index = e.currentTarget.id
    var currentIndex = Number(index)
    this.setData({
      currentIndex: currentIndex
    })
  },
  goPutin: function () {
    var that = this
    var currentIndex = this.data.currentIndex
    var quotas = this.data.quotas
    var Amount = quotas[currentIndex].NeedAmount  
    wx.request({
      url: `${host}/UserCenter/RechargeUserAmount.ashx?UserId=${sessionid}&Amount=${Amount}`,
      success: function (res) {
        var data = res.data
        if (data.prepayid) {
          wx.requestPayment({
            timeStamp: data.timestamp,
            nonceStr: data.noncestr,
            package: data.package,
            signType: data.signType,
            paySign: data.sign,
            success: function (res) {
              console.log(res)
              if (res.errMsg === 'requestPayment:ok') {
                wx.request({
                  url: `${host}/UserCenter/AddUserAmount.ashx?UserId=${sessionid}&Amount=${Amount}`,
                  success: function (res) {
                    if (res.data.State === 'ok'){
                      that.onLoad()
                      wx.showLoading({
                        icon: 'success',
                        title: '充值成功',
                        duration: 1500
          
                      })
                    } else {
                      wx.showLoading({
                        title: '出错了',
                        duration: 1500
                      })

                    }
                  },
                  fail: function (error){
                    wx.showLoading({
                      title: '出错了',
                      duration: 1500
                    })
                  }
                })
              }
            },
            fail:function(res){
              console.log(res)
            },
            complete:function(res){
              console.log(res)
            }
          })
        } else {
          wx.showLoading({
            title: '出错了',
            duration: 1500
          })
        }
      }
    })
  },
  exsend: function (e) {
    var that = this
    var code = e.detail.value
    console.log(code)
    wx.request({
      url: `${host}/Coupon/CancelCashCoupon.ashx?Code=${code}&UserId=${sessionid}`,
      success: function (res) {
        if (res.data.State === 'ok') {
          var Amount = res.data.Amount
          wx.showToast({
            title: `获得${Amount}现金`,
            duration: 1000
          })
          that.onLoad()
        }else{
          wx.showToast({
            title: '现金券不存在',
            duration: 1000
          })
        }
      }
    })
  }
})