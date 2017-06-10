//app.js
// var Bmob = require('utils/bmob.js');
// Bmob.initialize("4195da08a4bfe3814a4284de579fd8c0", "f0fd39c21b7ffab76c530eb5d63b3415");

App({
  /*
  程序启动时调用，只调用1次；
  */

  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  },
/*
程序启动完成后，从后台切到前台再次调用。
*/
onShow:function(){
    console.log('程序启动完成后，从后台切到前台再次调用。');
},
/*
程序进入后台调用。
*/
onHide:function(){
    console.log('程序进入后台调用。');
}
})



