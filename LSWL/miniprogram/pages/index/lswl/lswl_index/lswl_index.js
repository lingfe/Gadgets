// miniprogram/pages/index/lswl/lswl_index/lswl_index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images_list: [],
    type_menu: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      yw_id: options.menu_id,
    })
    this.quer(that);
  },

  //查询
  quer: function (that) {
    const db = wx.cloud.database();
    db.collection('tab_my_images')
      .where({
        yw_id: that.data.yw_id
      })
      .get({
        success: res => {
          this.setData({
            images_list: res.data
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

    //查询菜单
    db.collection('tab_sys_menu')
    .where({
        state: 0,
        yw_id: that.data.yw_id
      })
      .orderBy('sort', 'asc')
      .get({
        success: res => {
          this.setData({
            type_menu: res.data
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that=this;
    that.quer(that);

    //下拉完成后执行回退
    wx.stopPullDownRefresh();
  },

})