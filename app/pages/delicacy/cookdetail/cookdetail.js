const sessionid = require('../../../utils/session.js').get()
const host = require('../../../config.js').service.host
const formTime = require('../../../utils/formTime.js')
Page({
  data: {
    cookdetail: {
      cookname: '黄豆炖猪蹄儿',
      bookcover: ['', '', ''],
      publisher: {
        nickName: '璐捻',
        averurl: 'https://wx.qlogo.cn/mmopen/PiajxSqBRaEJyBT7jEV11blQhkfFD8qI51FMQM38a81GX8ic8ic85ukJ6Sblib2H8kxOapn5ATwpcZgSqjTRSnr9BA/0'
      },
      collectes: 512,
      hascollected: true,
      ingredients: '猪蹄四个(剁成小块),黄豆一碗,老抽,陈皮,白酒两勺,桂皮一片,冰糖等',
      procedure: '1.干黄豆提前三小时用水泡着 2.猪蹄拔毛，可以用火烧，然后洗掉焦灰就可以了。冷水下锅，煮至水开，撇去浮沫，用冷水冲净(冰水更佳，这样一冷一热使皮更Q) 3.炒糖色小火。。。。'
    }
  },
  onLoad: function (options) {
    var that = this
    var MenuId = options.MenuId
    this.MenuId = MenuId
    wx.request({
      url: `${host}/Menu/getMenuInfo.ashx?MenuId=${MenuId}&UserId=${sessionid}`,
      success: function (res) {
        var data=res.data
        var origTime = new Date(data.CreateTime)
        data.CreateTime = formTime(origTime)
          var IsCollect = Boolean(res.data.IsCollect)
          that.setData({
            cookdetail: res.data,
            IsCollect: IsCollect
          })
      }
    })
  },
  onReady: function () {
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: this.data.cookdetail.cookname,
      path: '/pages/index/detail/detail?identity=123',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  collect: function () { 
    var that = this
    var MenuId = this.MenuId
    var IsCollect = this.data.IsCollect
    IsCollect = !IsCollect
    var type = IsCollect ? 3 : 4
    this.setData({
      'IsCollect': IsCollect
    })
    wx.request({
      url: `${host}/Menu/updateUserMenu.ashx?UserId=${sessionid}&MenuId=${MenuId}&type=${type}`,
      success: function (res) {
        if (res.data.State === 'Ok') {
          if (IsCollect) {
            wx.showToast({
              title: '点赞成功!',
              icon: 'success',
              duration: 1000
            })
          } else {
            wx.showToast({
              title: '取消点赞!',
              icon: 'success',
              duration: 1000
            })
          }
          var options={}
          options.MenuId = MenuId
          that.onLoad(options)
        }
        else {
          wx.showToast({
            title: '网络开了小差',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  },
  shortnav:function(){
    wx.showToast({
      title: '无食材可购买',
    })

  }
})