//index.js
//获取应用实例
var app = getApp()
Page({
  data: {    
    userInfo: {},
    items: [
        {name: 'male', value: '公', checked: 'true'},
        {name: 'female', value: '母'},
        {name: 'none', value: '绝育'}
    ],
    name:'',
    array: ['猫', '狗', '兔子', '松鼠', '仓鼠', '其他'],
    index: 0,
    date:'1997-6-12',
  },
  /**
   * radio监听事件
   */
  listenerRadioGroup:function(e) {
      console.log(e);
  },
  /**
   * 监听标题，地址，备注的输入
   */
  listenerNameInput: function(e) {
      this.data.name = e.detail.value;
      console.log('标题为: ', this.data.name);
  },
  /**
   * 监听普通picker选择器
   */
  listenerPickerSelected: function(e) {
      //改变index值，通过setData()方法重绘界面
      this.setData({
        index: e.detail.value
      });
  },
  /**
   * 监听日期picker选择器
   */
  listenerDatePickerSelected:function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
