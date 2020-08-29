// miniprogram/pages/index/lswl/lswl_index/hq_list/hq_list_details/hq_list_ details.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: '点击查看总金额',
    queryResult: [],
    inputValue: '', //搜索的内容
    yw_id: null,
    openid: wx.getStorageSync('openid')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      yw_id: options.id,
    });
    //获取事件信息
    that.getEvent(that);
    //页面设置信息
    that.getPageSetup(that);
    //保存查看/浏览
    that.save_browse(that);
  },

  //删除事件
  bind_delete:function(e){
    wx.showModal({
      title:"提示",
      content:"是否删除？删除之后无法恢复！",
      cancelText:"否",
      confirmText:'YES',
      success:function(res){
        if(res.confirm){
          wx.showToast({
            title:'该功能还未开通',
            icon:'none'
          });
        }
      }
    })
  },

  //获取事件信息
  getEvent: function (that) {
    //获取事件信息
    const db = wx.cloud.database();
    db.collection("tab_my_event")
      .where({
        _id: that.data.yw_id,
      })
      .get({
        success: res => {
          that.setData({
            event_data: res.data[0]
          })
        }
      })
  },

  //保存查看
  save_browse: function (that) {
    //获取用户设备信息
    wx.getSystemInfo({
      success: (result) => {
        console.log(result);
        //值
        var form = {
          model: result.model,
          crt_date: new Date().toLocaleString(),
          yw_id: that.data.yw_id,
          openid: wx.getStorageSync('openid')
        }

        //保存
        wx.cloud.callFunction({
          name: 'add',
          data: {
            tab_name: "tab_browse",
            form: form
          },
          success: function (res) {
            console.log(res);

          }
        });
      },
    })
  },

  //页面设置信息
  getPageSetup: function (that) {
    const db = wx.cloud.database();
    var page = app.getPage();
    db.collection("tab_page_setup")
      .where({
        page_path: page.url,
      }).get({
        success: res => {
          that.setData({
            page_data: res.data[0]
          })
          console.log('[数据库] [查询记录] 成功: ', res)
        },
      })
  },

  //修改事件
  bind_update: function (e) {
    wx.navigateTo({
      url: '/pages/public/add_or_update/add_or_update?tab_name=tab_my_event&id=' + this.data.yw_id,
    })
  },

  //添加礼金验证
  bind_add: function (e) {
    wx.navigateTo({
      url: '/pages/public/add_or_update/add_or_update?'
      +'tab_name=tab_my_cash_gift'
      +'&yw_id=' + this.data.yw_id,
    })
  },

  //点击查看总金额
  tapzogo: function () {
    var that = this;
    const db = wx.cloud.database();
    db.collection('tab_my_cash_gift')
      .where({
        yw_id: that.data.yw_id,
        name: {
          $regex: '.*', //模糊匹配的值,
          $options: 'i' //不区分大小写
        }
      })
      .get({
        success: res => {
          var list = res.data;
          var num = 0;
          for (var i = 0, lenI = list.length; i < lenI; ++i) {
            num = num + parseInt(list[i].cash_gift);
          }
          //赋值
          that.setData({
            num: that.strNumber(num)
          })
          console.log('[数据库] [查询记录] 成功: ', res)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    //统计金额
    // const $ = db.command.aggregate;
    // db.collection('tab_my_cash_gift')
    //   .aggregate()
    //   .group({
    //     _id: null,
    //     totalPrice: $.sum('$price'),
    //   })
    //   .end()
  },

  //搜索框文本内容显示
  inputBind: function (event) {
    this.setData({
      inputValue: event.detail.value
    })
    console.log('bindInput' + this.data.inputValue)

  },

  /**
   * 搜索执行按钮
   */
  query: function (event) {
    var that = this;
    const db = wx.cloud.database();
    db.collection('tab_my_cash_gift')
      .where({
        yw_id: that.data.yw_id,
        name: {
          $regex: '.*' + that.data.inputValue, //模糊匹配的值,
          $options: 'i' //不区分大小写
        }
      })
      .orderBy('cdate', 'desc')
      .get({
        success: res => {
          var list = res.data;
          for (var i = 0, lenI = list.length; i < lenI; ++i) {
            list[i].cash_gift = that.strNumber(list[i].cash_gift);
            //list[i].cash_gift = list[i].cash_gift/10000+'万元';
          }

          that.setData({
            queryResult: list
          })
          console.log('[数据库] [查询记录] 成功: ', res)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
  },

  //将金额大于1000的转成文字
  strNumber: function (value) {
    if (value >= 1000 && value < 10000) {
      value = value / 1000 + '千元'
    } else if (value >= 10000 && value < 100000) {
      value = value / 10000 + "万元"
    } else if (value >= 100000 && value < 1000000) {
      value = value / 100000 + "十万元"
    } else if (value >= 1000000 && value < 10000000) {
      value = value / 1000000 + "白万元"
    } else if (value >= 10000000 && value < 100000000) {
      value = value / 10000000 + "千万元"
    } else if (value >= 100000000 && value < 1000000000) {
      value = value / 100000000 + "万万元"
    } else if (value >= 1000000000 && value < 10000000000) {
      value = value / 1000000000 + "亿元"
    } else if (value >= 10000000000 && value < 100000000000) {
      value = value / 10000000000 + "十亿元"
    } else if (value >= 100000000000 && value < 1000000000000) {
      value = value / 100000000000 + "白亿元"
    } else if (value >= 1000000000000 && value < 10000000000000) {
      value = value / 1000000000000 + "千亿元"
    } else if (value >= 10000000000000 && value < 100000000000000) {
      value = value / 10000000000000 + "万亿元"
    } else if (value >= 100000000000000 && value < 1000000000000000) {
      value = value / 100000000000000 + "亿亿元"
    }

    return value

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.query();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      num: '点击查看总金额',
      inputValue: '',
    });

    that.query();
  },

  //分享给朋友
  //用户点击右上角分享朋友圈，要在这里分享好友这里射门menus的两个参数，才可以分享朋友圈
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      console.log("来自页面内转发按钮");
      console.log(res.target);
    } else {
      console.log("来自右上角转发菜单")
    }
    that.addShareInfo(that);
    return {
      title: '礼尚往来',
      desc: '这个记账小工具，你需要它!',
      path: '/pages/index/lswl/lswl?id=123466',
      success: (res) => {
        console.log("分享成功", res);
        that.addShareInfo(that);
      },
    }
  },

  //添加分享记录
  addShareInfo: function (that) {
    wx.cloud.callFunction({
      name: 'add',
      data: {
        tab_name: "tab_share",
        form: {
          page: "/pages/index/lswl/lswl?id=123",
          yw_id: that.data.yw_id,
          crt_date: new Date().toLocaleString()
        }
      },
      success: function (res) {
        console.log(res);
      }
    });
  },

})