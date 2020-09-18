// miniprogram/pages/index/lswl/lswl_index/hq_list/hq_list.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryResult: [],
    page_data: [],
    tab_name:'tab_my_event',
    pageing:{
      pageIndex:1,
      pageNum:10
    },
    url:'/pages/index/lswl/hq_list_details/hq_list_details?1=1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      yw_id: options.menu_id,
      where: { //条件
        yw_id: options.menu_id,
        iskaifang: "1",
      }
    });

    //查询数据
    that.quer(that);
    //页面设置信息
    that.getPageSetup(that);
  },

  //添加
  add:function(e){
    var that=this;
    var param="tab_name=tab_sys_menu";
    wx.navigateTo({
      url:"/pages/public/check_menu_type/check_menu_type?"+param
    })
  },

  //my
  my:function (e) {
    var that=this;
    //先获取用户的openid再查下
    wx.cloud.callFunction({
      name: 'openid',
      success: function (res) {
        console.log(res)
        that.setData({
          is_my_add:1,
          page_data:{
            is_close_my_button:1,//关闭按钮
          },
          where:{
            openid:res.result.openid,
            state: 0,
          },
          pageing:{
            pageIndex:1,
            pageNum:10
          },
          queryResult: [],
        })
        that.quer(that);
      }
    });
  },

  //页面设置信息
  getPageSetup: function (that) {
    const db = wx.cloud.database();
    db.collection("tab_page_setup")
      .where({
        page_path: app.getPage().url,
      }).get({
        success: res => {
          that.setData({
            page_data: res.data[0]
          })
          console.log('[数据库] [查询记录] 成功: ', res)
        },
      })
  },

  //查询
  quer: function (that) {
    //链表
    var lookup = {
      lookup1: {
        from: "tab_browse",
        localField: '_id',
        foreignField: 'yw_id',
        as: "tab_browse"
      },
      lookup2: {
        from: "tab_share",
        localField: '_id',
        foreignField: 'yw_id',
        as: "tab_share"
      }
    }

    //得到数据
    wx.cloud.callFunction({
      name: 'lookup3',
      data: {
        tab_name: that.data.tab_name,
        where: that.data.where,
        lookup: lookup,
        pageing:that.data.pageing
      },
      complete: function (res) {
        console.log(res);
        that.setData({
          queryResult: that.data.queryResult.concat(res.result.list)
        })
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    //重置分页
    var pageing=that.data.pageing;
    that.setData({
      queryResult:[],
      pageing:{
        pageIndex:1,
        pageNum:10
      }
    })
    that.quer(that);

    //下拉完成后执行回退
    wx.stopPullDownRefresh();
  },

    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    var that = this;
    var pageIndex=that.data.pageing.pageIndex;
    that.setData({
      pageing:{
        pageIndex:pageIndex+1,
        pageNum:10,
      }
    })
    that.quer(that);
  },

})