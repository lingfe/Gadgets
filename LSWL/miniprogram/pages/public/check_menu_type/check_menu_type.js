// miniprogram/pages/index/lswl/lswl_index/hq_list/my_hq_list/check_menu_type/check_menu_type.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_name: 'tab_sys_menu'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      tab_name: options.tab_name,
      yw_id: options.yw_id,
      options:options
    });
    var josn = that.getInfo({});
    that.data.where = josn.where;
    that.getList(that);
  },

  //获取数据集合
  getList: function (that) {
    var that = this;
    wx.cloud.callFunction({
      name: 'query',
      data: {
        tab_name: that.data.tab_name, //'tab_notice',
        where: that.data.where
      },
      complete: function (res) {
        console.log(res);
        var list = res.result.data;
        var arr = [];
        list.forEach(st => {
          arr.push(that.getInfo(st));
        });
        that.setData({
          list: arr
        })
      }
    })
  },

  //数据
  getInfo(st) {
    //默认
    var josn = {
      st: st,
      where: {
        state: 0,
      },
      josn: {
        name: '数据不对哦！',
        text:'>'
      }
    };

    //得到要查询的表名
    var tab = this.data.options.tab_name;
    switch (tab) {
      case 'tab_sys_menu': // 一级菜单下的->子菜单->跳转添加事件
        josn.where.yw_id=wx.getStorageSync('menu_id');
        josn.josn.url= '/pages/public/add_or_update/add_or_update';
        josn.josn.tab_name='tab_my_event';
        josn.josn.name=st.menu_name;
        josn.josn.img=st.menu_img;
        break;
      case 'hsqd'://回收清单下的-子菜单
        josn.where.yw_id=this.data.yw_id;
        josn.josn.tab_name='tab_my_event';
        this.setData({
          tab_name:'tab_sys_menu'
        })
        josn.josn.name=st.menu_name;
        josn.josn.img=st.menu_img;
        break;
      case 'tab_sys_table': //表信息表-跳转表信息管理
        josn.josn.url= '/pages/public/table_manage/table_manage';
        josn.josn.tab_name=st.tab_name;
        josn.josn.name=st.tab_cname;
        josn.josn.img='https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2143042087,835394292&fm=26&gp=0.jpg';
        josn.josn.text= '管理';
        break;
      case 'tab_notice'://公告表(属于一级菜单)-跳转公告内容
        josn.where.yw_id=wx.getStorageSync('menu_id');
        josn.josn.url= '/pages/public/content/content';
        josn.josn.tab_name='tab_content';
        josn.josn.name=st.title;
        josn.josn.img=st.img;
        break;
      default :
        return josn;
    }
    return josn;
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