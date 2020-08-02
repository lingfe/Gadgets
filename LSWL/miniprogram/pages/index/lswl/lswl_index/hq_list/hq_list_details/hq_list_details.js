// miniprogram/pages/index/lswl/lswl_index/hq_list/hq_list_details/hq_list_ details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:'点击查看总金额',
    queryResult:[],
    inputValue: '', //搜索的内容
    yw_id:null,
  },

  //添加礼金验证
  bind_add:function(e){
    var that=this;
    //获取事件信息
    const db = wx.cloud.database();
    db.collection("tab_my_event")
    .where({
      _id:yw_id,
    }).get({
      success: res => {
        that.setData({
          event_data: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
    })
    //获取当前用户openid
    wx.cloud.callFunction({
      name:'openid',
      success:function(res){
        //验证是否为创建者本人
        var openid=that.data.event_data.openid;
        if(res.openid==openid){
          wx.navigateTo({
            url: '/pages/index/lswl/lswl_index/cash_gift/add_cash_gift',
          })
        }
      }
    });
    
  }, 

  //点击查看总金额
  tapzogo:function(){
    var that=this;
    const db = wx.cloud.database();
    db.collection('tab_my_cash_gift')
    .where({
      yw_id: that.data.yw_id,
      name: {
        $regex: '.*' ,//模糊匹配的值,
        $options: 'i' //不区分大小写
      }
    })
    .get({
      success: res => {
        var list=res.data;
        var num=0;
        for (var i = 0, lenI = list.length; i < lenI; ++i) {
          num=num+parseInt(list[i].cash_gift);
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
          $regex: '.*' + that.data.inputValue,//模糊匹配的值,
          $options: 'i' //不区分大小写
        }
      })
      .orderBy('cdate', 'desc')
      .get({
        success: res => {
          var list=res.data;
          for (var i = 0, lenI = list.length; i < lenI; ++i) {
            list[i].cash_gift=that.strNumber(list[i].cash_gift);
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
  strNumber:function(value){
    if(value>=1000&&value<10000){
      value=value/1000+'千元'
    }else if (value >= 10000 && value < 100000){
      value=value/10000+"万元"
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      yw_id:options.id,
      num:'点击查看总金额',
    });
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
      num:'点击查看总金额',
      inputValue:'',
    });
    
    that.query();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})