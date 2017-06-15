//logs.js
var util = require('../../utils/util.js')
Page({
  data: {
    logs: [],
    text:"我是在js文件中绑定的文本",
    items: [
        {name: 'event', value: '活动', checked: 'true'},
        {name: 'vaccine', value: '疫苗'},
        {name: 'vis', value: '就诊'},
        {name: 'bath', value: '洗澡'}
    ],
    title:'',
    address:'',
    note:'',
    date:'2017-6-12',
    time:'17:12',
    result: []
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
  listenerTitleInput: function(e) {
      this.data.title = e.detail.value;
      console.log('标题为: ', this.data.title);
  },
  listenerAddressInput: function(e) {
      this.data.address = e.detail.value;
      console.log('地址为: ', this.data.address);
  },
  listenerNoteInput: function(e) {
      this.data.note = e.detail.value;
      console.log('备注为: ', this.data.note);
  }, 

  /**
   * 监听时间picker选择器
   */
  listenerTimePickerSelected: function(e) {
      //调用setData()重新绘制
      this.setData({
          time: e.detail.value
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
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(function (log) {
        return util.formatTime(new Date(log))
      })
    });
    var that = this; 
      wx.request({
          url: 'http://gank.io/api/data/Android/30/1',
          method: 'GET',
          success:function(res) {
              that.setData({
                  result: res.data.results
              })
          }

      })
  }
})
