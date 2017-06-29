var that;
var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World\n',
    userInfo: {},
    urlArr: [],
    loading: true
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../test/test'
    })
  },
  onLoad: function () {
    console.log('onLoad Me')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },


/*
 * upImg start
 */
  upImg: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showNavigationBarLoading()
        that.setData({
          loading: false
        })
        var urlArr = new Array();
        // var urlArr={};
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        var imgLength = tempFilePaths.length;
        if (imgLength > 0) {
          var newDate = new Date();
          var newDateStr = newDate.toLocaleDateString();

          var j = 0;
          for (var i = 0; i < imgLength; i++) {
            var tempFilePath = [tempFilePaths[i]];
            var extension = /\.([^.]*)$/.exec(tempFilePath[0]);
            if (extension) {
              extension = extension[1].toLowerCase();
            }
            var name = newDateStr + "." + extension;//上传的图片的别名      

            var file = new Bmob.File(name, tempFilePath);
            file.save().then(function (res) {
              wx.hideNavigationBarLoading()
              var url = res.url();
              console.log("第" + i + "张Url" + url);

              urlArr.push({ "url": url });
              j++;
              console.log(j, imgLength);
              // if (imgLength == j) {
              //   console.log(imgLength, urlArr);
              //如果担心网络延时问题，可以去掉这几行注释，就是全部上传完成后显示。
              showPic(urlArr, that)
              // }

            }, function (error) {
              console.log(error)
            });

          }

        }

      }
    })
  }
/*
 * upImg end
 */



})


//上传完成后显示图片
function showPic(urlArr, t) {
  t.setData({
    loading: true,
    urlArr: urlArr
  })
}