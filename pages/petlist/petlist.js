//petlist.js
//需要获取当前时间
var util = require('../../utils/util.js');

//获取应用实例
var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var app = getApp();
var that;


Page({
  data: {
    array: ['点击改变宠物类型', '猫', '狗', '兔子', '松鼠', '仓鼠', '鱼', '其他'],
    index: 0,
    tag:'',
    genderTxt:'公',
    steriTxt: '已绝育',
    date: util.formatTime(new Date),//显示当前时间
    birth: '2017-06-12 00:00:00',
    writePet: false,
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    limit: 10,
    petList: [],
    modifyPets: false,
    urlArr: [],
    loading: true,
    url:''
  },
  /**
     * 监听普通picker选择器
     */
  listenerPickerSelected: function (e) {

    //改变index值，通过setData()方法重绘界面
    this.setData({
      index: e.detail.value
    });
    
  },
  /**
   * switch开关监听
   */
  sListenerSwitch: function (e) {
    if (e.detail.value) {
      this.setData({
        steriTxt: '已绝育'
      })
    } else {
      this.setData({
        steriTxt: '未绝育'
      })
    }

  },
  gListenerSwitch: function (e) {
    if (e.detail.value) {
      this.setData({
        genderTxt: '公'
      })
    } else {
      this.setData({
        genderTxt: '母'
      })
    }

  },
  /**
   * 监听日期picker选择器
   */
  listenerDatePickerSelected: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  onLoad: function () {
    that = this;

  },
  noneWindows: function () {
    that.setData({
      writePet: "",
      modifyPets: ""
    })
  },
  onShow: function () {
    getList(this);


    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  pullUpLoad: function (e) {
    var limit = that.data.limit + 2
    this.setData({
      limit: limit
    })
    this.onShow()
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
  },
/*
 * upImg end
 */

  toAddPet: function () {
    that.setData({
      writePet: true
    })
  },
  addPet: function (event) {
    var name = event.detail.value.name;

    var birth = new Date(event.detail.value.birth);
    var age = Number(event.detail.value.age);    
    var tag = event.detail.value.tag;
     
    var gender = event.detail.value.gender;    
    var steri = event.detail.value.steri;
    var avatarID = event.detail.value.avatarID;
    

    var regNum = new RegExp('[0-9]', 'g');//正则表达式

    if (!name) {
      common.showTip("名字不能为空", "loading");
    } 
   
    else if (tag==0) {
      common.showTip("请选择宠物类型", "loading");
    }
    else if (!regNum.test(age)) {
      common.showTip("请输入数字", "loading");
    }  
   
    else {
      that.setData({
        loading: true
      })
      var currentUser = Bmob.User.current();

      var User = Bmob.Object.extend("_User");
      var UserModel = new User();

      // var post = Bmob.Object.createWithoutData("_User", "594fdde53c");

      //增加宠物
      var Pet = Bmob.Object.extend("petlist");
      var pet = new Pet();
      pet.set("name", name);
      pet.set("birth", birth);
      pet.set("age", age);
      pet.set("tag", tag);
      pet.set("gender", gender);
      pet.set("steri", steri);
      pet.set("avatarID", avatarID);

      if (currentUser) {
        UserModel.id = currentUser.id;
        pet.set("own", UserModel);
      }
      //添加数据，第一个入口参数是null
      pet.save(null, {
        success: function (result) {
          // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
          common.showTip('添加宠物成功');
          that.setData({
            writePet: false,
            loading: false,
            index: 0,//以下切回初始状态
            tag:'',
            steriTxt: '已绝育',
            genderTxt: '公',
          })
          that.onShow()
        },
        error: function (result, error) {
          // 添加失败
          common.showTip('添加宠物失败，请重新发布', 'loading');
          

        }
      });
    }

  },
  closeLayer: function () {
    that.setData({
      writePet: false
    })
  },
  deletePet: function (event) {
    var objectId = event.target.dataset.id;
    wx.showModal({
      title: '操作提示',
      content: '确定要删除要宠物？',
      success: function (res) {
        if (res.confirm) {
          //删除宠物
          var Pet = Bmob.Object.extend("pet");
          //创建查询对象，入口参数是对象类的实例
          var query = new Bmob.Query(Pet);
          query.equalTo("objectId", objectId);
          query.destroyAll({
            success: function () {
              common.showTip('删除宠物成功');
              that.onShow();
            },
            error: function (err) {
              common.showTip('删除宠物失败', 'loading');
            }
          });
        }
      }
    })
  },
  toModifyPet: function (event) {
    var nowName = event.target.dataset.name;
    var nowBirth = event.target.dataset.birth;
    var nowAge = event.target.dataset.age;
    var nowTag = event.target.dataset.tag;

    var nowGender = event.target.dataset.gender;
    var nowSteri = event.target.dataset.steri;

    that.setData({
      modifyPets: true,
      nowName: nowName,
      nowBirth: nowBirth,
      nowAge: nowAge,
      nowTag:nowTag,//
      nowGender: nowGender,
      nowSteri: nowSteri//,
      //nowId: nowId
    })
  },
  modifyPet: function (e) {
    var t = this;
    modify(t, e)
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    getList(this);
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    getList(this);
  },
  inputTyping: function (e) {
    //搜索数据
    getList(this, e.detail.value);
    this.setData({
      inputVal: e.detail.value
    });
  },
  closeAddLayer: function () {
    that.setData({
      modifyPets: false
    })
  }







})


/*
* 获取数据
*/
function getList(t, k) {
  that = t;
  var Pet = Bmob.Object.extend("petlist");
  var query = new Bmob.Query(Pet);

  //会员模糊查询
  if (k) {
    query.equalTo("title", { "$regex": "" + k + ".*" });
  }

  //普通会员匹配查询
  // query.equalTo("title", k);


  query.descending('createdAt');
  query.include("own")
  // 查询所有数据
  query.limit(that.data.limit);
  query.find({
    success: function (results) {
      // 循环处理查询到的数据
      console.log(results);
      that.setData({
        petList: results
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function modify(t, e) {
  var that = t;
  //修改宠物
  var modyTitle = e.detail.value.title;
  var modyContent = e.detail.value.content;
  var objectId = e.detail.value.content;
  var thatTitle = that.data.nowTitle;
  var thatContent = that.data.nowContent;
  if ((modyTitle != thatTitle || modyContent != thatContent)) {
    if (modyTitle == "" || modyContent == "") {
      common.showTip('标题或内容不能为空', 'loading');
    }
    else {
      console.log(modyContent)
      var Pet = Bmob.Object.extend("pet");
      var query = new Bmob.Query(Pet);
      // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
      query.get(that.data.nowId, {
        success: function (result) {

          // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
          result.set('title', modyTitle);
          result.set('content', modyContent);
          result.save();
          common.showTip('宠物修改成功', 'success', function () {
            that.onShow();
            that.setData({
              modifyPets: false
            })
          });

          // The object was retrieved successfully.
        },
        error: function (object, error) {

        }
      });
    }
  }
  else if (modyTitle == "" || modyContent == "") {
    common.showTip('标题或内容不能为空', 'loading');
  }
  else {
    that.setData({
      modifyPets: false
    })
    common.showTip('修改成功', 'loading');
  }
}
//上传完成后显示图片
function showPic(urlArr, t) {
  t.setData({
    loading: true,
    urlArr: urlArr
  })
}