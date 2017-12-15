var host = require('../../config').service.host
var sessionid = require('../../utils/session.js').get()
var app = getApp();
var telphoneNum = '18367907721'
let { WeToast } = require('../../common/toast/wetoast.js')
Page({
  data: {
    User: {
      avatarUrl: '../../imgs/marks/averurl.gif',
      nickName: '点击登陆'
    },
    menu: [
      {
        title: '我的订单',
        navto: 'order'
      },
      {
        title: '我的地址',
        navto: 'adress'
      },
      {
        title: '我的菜谱',
        navto: 'menu'
      }
    ]
  },
  onLoad: function (options) {
    var that = this
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      that.setData({
        'User.avatarUrl': userInfo.avatarUrl,
        'User.nickName': userInfo.nickName
      })
    })
  },
  onShow: function () {
    var that = this
    wx.request({
      url: `${host}/UserCenter/getUserCenter.ashx?UserId=${sessionid}`,
      success: function (res) {
        if (res.data.State !== 'error') {
          that.setData({
            UserCenter: res.data
          })
        }
      }
    })
  },
  contact: function () {
    wx.makePhoneCall({
      phoneNumber: telphoneNum
    })
  },
  wxLogin: function () {
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        'User.avatarUrl': userInfo.avatarUrl,
        'User.nickName': userInfo.nickName
      })
    })
    console.log(this.data.User)
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '品丽州生鲜1小时达',
      path: '/pages/index/index',
      imageUrl: '../../imgs/holder/shortcut.png',
      success: function (res) {
        if (res.errMsg === 'shareAppMessage:ok') {
          wx.request({
            url: `${host}/UserCenter/UserShareApp.ashx?UserId=${sessionid}`,
            success: function (res) {
              if (res.data.State === 'ok') {
                wx.showToast({
                  title: '获得优惠券',
                  duration: 1500
                })
              }else{
                wx.showToast({
                  title: '活动已用',
                  duration: 1500
                })
              }
            }
          })
        }
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})