let { WeToast } = require('./common/toast/wetoast.js') 
const loginUrl = require('./config').service.loginUrl
const host = require('./config').service.host
const Session = require('./utils/session')
App({
  onLaunch: function () {
    this.loginApp()
  },
  onShow: function (options) {
  },
  onHide: function () { },
  onError: function (msg) {
  },
  loginApp: function () {
    var that = this
    wx.login({
      success: function (res) {
        wx.request({
          url: `${loginUrl}?code=${res.code}`,
          success: function (res) {
            if (res.data.State === 'ok') {
              var userInfo = {}
              var sessionkey = res.data.UserId
              Session.set(sessionkey)
              if (res.data.avatarUrl && res.data.nickName) {
                userInfo.avatarUrl = res.data.avatarUrl
                userInfo.nickName = res.data.nickName
                that.globalData.userInfo = userInfo
              }
            }
          }
        })
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          var sessionid = Session.get(), avatarUrl = res.userInfo.avatarUrl, nickName = res.userInfo.nickName
          var userInfo = {}
          userInfo.avatarUrl = avatarUrl
          userInfo.nickName = nickName
          wx.request({
            url: `${host}/UserCenter/updateUserInfo.ashx?UserId=${sessionid}&AvatarUrl=${avatarUrl}&NickName=${nickName} `,
            success: function (res) {
              if (res.data.State === 'ok') {
                that.globalData.userInfo = userInfo
                typeof cb == "function" && cb(userInfo)
              } else {
                wx.showToast({
                  title: '网络出错!',
                  icon: 'loading',
                  duration: 1000
                })
              }
            }

          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})
