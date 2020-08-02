// miniprogram/pages/index/lswl/lswl_data_manage/table_manage/table_manage.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.data.tab_name=options.tab_name;
    that.querData(that);

  },

  //改变数据状态
  bind_state:function(e){
    var that=this;
    wx.cloud.callFunction({
      name:'doc',
      data:{
        tab_name:that.data.tab_name,
        id:e.target.id,
        update_data:{
          state:parseInt(e.target.dataset.state),
        }
      },
      success:function(res){
        console.log(res);
        that.querData(that);
      }
    });
  },

  //查询数据
  querData:function(that){
    db.collection(that.data.tab_name)
    .where({
      
    })
    .get({
      success: res => {
        that.setData({
          list: res.data
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

  //删除数据
  bind_delete:function(e){
    var that=this;
    //提示
    wx.showModal({title: '数据删除',content: '是否确定删除？删除之后将无法恢复！',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        //是否确定
        if (res.confirm) {
          wx.cloud.callFunction({
            name:'delete',
            data:{
              tab_name:that.data.tab_name,
              id:e.target.id,
            },
            success:function(res){
              console.log(res);
              that.querData(that);
            }
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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