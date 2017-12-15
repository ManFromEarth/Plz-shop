var host = require('../../../config').service.host
var sessionid = require('../../../utils/session.js').get()
var formTime = require('../../../utils/formTime.js')
Page({
  data: {
  },
  onLoad: function (options) {
    var that = this
    wx.request({
      url: `${host}/UserCenter/getOrderList.ashx?UserId=${sessionid}`,
      success: function (res) {
        if (res.data && res.data.length !== 0) {
          var orderList = res.data
          for (var i = 0, len = orderList.length; i < len; i++) {
            var lastTime = new Date(orderList[i].CreateTime)
            var nowTime = formTime(lastTime)
            orderList[i].CreateTime = nowTime
          }
          that.setData({
            purchased: orderList
          })
        }
      }
    })
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  regoods: function () { },
  deltOrder: function (e) {
    var that = this
    var idx = e.currentTarget.dataset.idx
    var OrderId = this.data.purchased[idx].OrderId
    wx.request({
      url: `${host}/UserCenter/updateOrderStatus.ashx?OrderId=${OrderId}&Type=2&Remark=""`,
      success: function (res) {
        if (res.data.State === 'ok') {
          that.onLoad()
        }
      }
    })
  },
  regoods:function(e){
    var that = this
    var idx = e.currentTarget.dataset.idx
    var OrderId = this.data.purchased[idx].OrderId
    wx.request({
      url: `${host}/UserCenter/updateOrderStatus.ashx?OrderId=${OrderId}&Type=1&Remark=""`,
      success: function (res) {
        if (res.data.State === 'ok') {
          that.onLoad()
        }
      }
    })
  },
  gopay: function (e) {
    var that = this
    var purchased = this.data.purchased
    var idx = e.currentTarget.dataset.idx
    var theOrder = purchased[idx]
    console.log(theOrder)
    if (theOrder.OrderId) {
      var orderID = theOrder.OrderId
      var account = {}
      account.totalAmount = theOrder.OriginalAmount
      account.usecoupon = {}
      account.usecoupon.reducenum = theOrder.UsedCoupon
      account.postcost = theOrder.Postage
      account.usebalance = theOrder.UsedCash
      account.wxPay = theOrder.AmoutPaid
      var accountStr = JSON.stringify(account)
      var carlist = []
      for (var i = 0, len = theOrder.list.length; i < len; i++) {
        var orderItem = theOrder.list[i]
        carlist.push({
          Title: orderItem.ProductName,
          isbuy: orderItem.ProductNum,
          standar: {
            StandardName: orderItem.ProductName,
            Price: orderItem.ProducuPrice
          }
        })
      }
      var carlistStr = JSON.stringify(carlist)
      var defaultAdress = {}
      defaultAdress.Pcadress = theOrder.Address
    }
    var defaultAdressStr = JSON.stringify(defaultAdress)
    wx.navigateTo({
      url: `../../ticket/pay/pay?orderID=${orderID}&account=${accountStr}&carlist=${carlistStr}&defaultAdress=${defaultAdressStr}`
    })
  }
})