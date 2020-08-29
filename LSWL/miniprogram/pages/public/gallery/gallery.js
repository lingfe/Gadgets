// miniprogram/pages/public/gallery/gallery.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryResult: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      tab_name: "tab_my_images",
      where: {
        yw_id: options.yw_id
      },
      pageing: {
        pageIndex: 1,
        pageNum: 999
      }
    })
    //查询
    that.quer(that);
  },

  //点击图片
  btn_images: function (e) {
    var that=this;
    var img_url=e.currentTarget.id;

    //提示
    wx.showModal({
      title: '提示',
      content: '是否选择该图片?',
      confirmText: "是",
      cancelText: "否",
      success: function (res) {
        console.log(res);
        //是否继续
        if (res.confirm) {
          var page=app.getPage(2);//2=上一页
          var currentPage=page.currentPage;
          currentPage.setData({
            img:{
              path:img_url,
              images_single:[""+img_url],
              length:1
            }
          });
          //返回
          wx.navigateBack();
        }
      }
    });
  },

  //查询
  quer: function (that) {
    //浏览表
    var lookup = {
      lookup1: {
        from: "tab_browse",
        localField: '_id',
        foreignField: 'yw_id',
        as: "tab_browse"
      },
      //分享表
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
        pageing: that.data.pageing
      },
      complete: function (res) {
        console.log(res);
        that.setData({
          queryResult: that.data.queryResult.concat(res.result.list)
        })
      }
    });
  },

})