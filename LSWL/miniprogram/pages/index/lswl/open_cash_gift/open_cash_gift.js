// miniprogram/pages/index/lswl/lswl_index/open_cash_gift/open_cash_gift.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: wx.getStorageSync('openid')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.quer(options.id);
  },

  //重新录入
  bindtap_delete: function (event) {
    var openid = wx.getStorageSync('openid');
    var cash_openid = this.data.tab.openid;
    if (openid == cash_openid) {
      //保存
      var id=event.currentTarget.id;
      wx.cloud.callFunction({
        name: 'delete',
        data: {
          tab_name: "tab_my_cash_gift",
          id:id
        },
        success: function (res) {
          console.log(res);
          wx.showToast({
            title: '删除成功',
            icon: 'loading',
            duration: 3000,
            success: function (tt) {
              //关闭当前页,返回
              wx.navigateBack();
            }
          })
        }
      });
    } else {
      wx.showToast({
        icon: 'none',
        title: '删除失败!没有操作权限',
      })
    }
  },

  //查询
  quer: function (id) {
    const db = wx.cloud.database();
    db.collection('tab_my_cash_gift').where({
        _id: id
      })
      .get({
        success: res => {
          this.setData({
            tab: res.data[0]
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

})