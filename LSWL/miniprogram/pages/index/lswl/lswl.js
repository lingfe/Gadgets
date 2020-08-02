// miniprogram/pages/index/lswl/lswl.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    queryResult: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.quer();

    //设置分享到朋友圈参数
    wx.showShareMenu({
      withShareTicket: true,
      menus:['shareAppMessage','shareTimeline']
    });
  },

  //查询
  quer:function(){
    const db = wx.cloud.database();
    db.collection('tab_sys_model')
    .where({
      state: 0
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    //监听页面转发 出去点击之后的信息
    // wx.getShareInfo({
    //   shareTicket: e.shareTicket,
    // })
    // console.log(e);
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

  //分享给朋友
  //用户点击右上角分享朋友圈，要在这里分享好友这里射门menus的两个参数，才可以分享朋友圈
  onShareAppMessage:function(res){
    var that=this;
    if (res.from === 'button') { 
      console.log("来自页面内转发按钮"); 
      console.log(res.target); 
      //that.setUserShare(that);
    } else { 
      console.log("来自右上角转发菜单")
    }
    that.addShareInfo(that.yw_id);

    return {
      title: '礼尚往来',
      desc: '这个记账小工具，你需要它!',
      path: '/pages/index/lswl/lswl',
      success: (res) => {
        console.log("分享成功", res);
        that.addShareInfo(that.yw_id);
      },
    }
  },

  
  //分享到朋友圈
  onshareTimeline:function(e){
    return {
      title:'礼尚往来',
      query:'/pages/index/lswl/lswl',
      imageUrl:'',
    }
  },

  //添加分享记录
  addShareInfo:function(yw_id){
    const db = wx.cloud.database();
    wx.cloud.callFunction({
      name:'share',
      data:{
        yw_id:yw_id,
        share_page_url:app.getPageUrl(),
      }
    });
  },

  onUserOpstatistic:function(e){
    console.log(e);
    if(e.op == 'share'){
      console.log(e);
    }
  }
})