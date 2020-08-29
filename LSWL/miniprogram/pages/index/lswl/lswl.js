// miniprogram/pages/index/lswl/lswl.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    queryResult: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.quer();

    //设置分享到朋友圈参数
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  //查询
  quer: function () {
    const db = wx.cloud.database();
    db.collection('tab_sys_menu')
      .where({
        state: 0,
        yw_id:'admin',
      })
      .get({
        success: res => {
          this.setData({
            queryResult: res.data
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

  //分享到朋友圈
  onshareTimeline: function (e) {
    return {
      title: '礼尚往来',
      query: '/pages/index/lswl/lswl',
      imageUrl: '',
    }
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
    const db = wx.cloud.database();
    wx.cloud.callFunction({
      name: 'add',
      data: {
        tab_name: "tab_share",
        form: {
          page: "/pages/index/lswl/lswl?id=123",
          yw_id: "",
          crt_date: new Date().toLocaleString()
        }
      },
      success: function (res) {
        console.log(res);
      }
    });
  },

  onUserOpstatistic: function (e) {
    console.log(e);
    if (e.op == 'share') {
      console.log(e);
    }
  },

    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that=this;
    that.quer();

    //下拉完成后执行回退
    wx.stopPullDownRefresh();
  },
})