//获取应用实例
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottom: "其他",
    ax: 1, //0=不喜欢,1=喜欢
    activeIndex: 0, //tab切换下标
    sliderOffset: 0, //坐标x
    sliderLeft: 0, //坐标y
    pageing: {
      pageIndex: 1,
      pageNum: 10
    },
    openid: wx.getStorageSync('openid')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var tab_name = options.tab_name;
    var bottom = options.bottom;
    //bottom="大寿";
    var theme_color, font_color;
    switch (bottom) {
      case '白事':
        theme_color = "#000";
        font_color = "#000";
        break;
      case '红事':
        theme_color = "#c00";
        font_color = "#c00";
        break;
      case '满月':
        theme_color = "#D15656";
        font_color = "#94353C";
        break;
      case '升学':
        theme_color = "#2A5269";
        font_color = "#6AA17A";
        break;
      case '大寿':
        theme_color = "red";
        font_color = "#c00";
        break;
      default:
        theme_color = "#330066";
        font_color = "#000";
        bottom = "购买水果";
        break;
    }
    that.setData({
      color: {
        theme_color: theme_color,
        font_color: font_color
      },
      id: options.id,
      bottom: bottom,
      next: options.next,
      tab_name: options.tab_name
    });

    //保存查看/浏览记录
    that.save_browse(that);
  },

  //保存查看/浏览记录
  save_browse: function (that) {
    //获取用户设备信息
    wx.getSystemInfo({
      success: (result) => {
        console.log(result);
        //值
        var form = {
          model: result.model,
          crt_date: new Date().toLocaleString(),
          yw_id: that.data.id,
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
            //刷新
            that.query();
          }
        });
      },
    })
  },

  //双击页面
  doubleClick: function (e) {
    //e.timeStamp：当前点击时的毫秒数；
    // this.touchStartTime： 储存上一次点击时的毫秒数，默认0
    if (e.timeStamp - this.touchStartTime < 300) {
      this.bindtabAX(e);
    }
    this.touchStartTime = e.timeStamp;
  },

  //获取内容
  get: function () {
    var that = this;
    //提示
    wx.showLoading({
      title: '加载中..'
    })

    //链表
    var lookup = {
      lookup1: { //浏览表
        from: "tab_browse",
        localField: '_id',
        foreignField: 'yw_id',
        as: "tab_browse"
      },
      lookup2: { //分享表
        from: "tab_share",
        localField: '_id',
        foreignField: 'yw_id',
        as: "tab_share"
      },
      lookup3: { //喜欢表
        from: "tab_like",
        localField: '_id',
        foreignField: 'yw_id',
        as: 'tab_like'
      },
      lookup4: { //tabs菜单导航表
        from: "tab_tabs",
        localField: '_id',
        foreignField: 'yw_id',
        as: 'tab_tabs'
      },
      lookup5: { //用户信息表
        from: "tab_user_info",
        localField: 'openid',
        foreignField: 'openid',
        as: 'tab_user_info'
      },
      lookup6: { //图片信息表
        from: "tab_images",
        localField: '_id',
        foreignField: 'yw_id',
        as: 'tab_images'
      }
    }

    //得到数据
    var tab_name = that.data.tab_name ? that.data.tab_name : "tab_my_event";
    wx.cloud.callFunction({
      name: 'lookup',
      data: {
        tab_name: tab_name,
        where: {
          _id: that.data.id
        },
        lookup: lookup,
        pageing: that.data.pageing
      },
      complete: function (res) {
        console.log(res);
        var data = res.result.list;
        var info = {};
        if (!app.checkInput(data)) {
          info = data[0];
        }

        //轮播图
        info.images_list = info.tab_images;

        //标题-描述
        switch (tab_name) {
          case "tab_my_event":
            info.title = info.event_name;
            info.describe = info.event_remark;
            info.images_list.unshift({
              _id: that.data.id,
              img_url: info.event_img
            });
            break;
          default:
            info.title = "默认标题!";
            info.describe = "默认描述....";
            break;
        }

        //标签
        var label_list = [];
        var lable = info.lable;
        if (!app.checkInput(lable)) label_list.concat(info.label.split(","));
        var like_num = info.tab_like.length;
        label_list.push(like_num + "人喜欢");
        var share_num = info.tab_share.length;
        label_list.push(share_num + "次分享");
        var browse_num = info.tab_browse.length;
        label_list.push(browse_num + "次浏览");
        info.label_list = label_list;

        //用户信息
        var tab_user_info = info.tab_user_info;
        if (!app.checkInput(tab_user_info)) info.user_info = info.tab_user_info[0];

        //用户是否喜欢
        var tab_like = info.tab_like;
        if (!app.checkInput(tab_like)) {
          info.is_like = info.tab_like[0].state;
          info.like_id = info.tab_like[0]._id;
        }

        //得到用户是否关注
        that.getFollow(info);

        //tab菜单导航
        info.tabs_list = info.tab_tabs;

        //得到tab菜单导航内容,默认下标0
        var tabs_list = info.tabs_list;
        var tabs_id = '';
        if (!app.checkInput(tabs_list)) {
          tabs_id = tabs_list[0]._id;
        } else {
          info.tabs_list = [{
            _id: tabs_id,
            tabs_name: "没有数据"
          }];
        }
        that.getTabsContent(tabs_id);

        //设置tab
        var sliderWidth = 50;
        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              info: info,
              sliderLeft: (res.windowWidth / tabs_list.length - sliderWidth) / 2,
              sliderOffset: res.windowWidth / tabs_list.length * that.data.activeIndex
            });
          }
        });
      }
    });
  },

  //得到tab菜单导航内容
  getTabsContent: function (tabs_id) {
    var that = this;
    wx.cloud.callFunction({
      name: 'query',
      data: {
        tab_name: 'tab_content',
        where: {
          yw_id: tabs_id
        }
      },
      complete: function (res) {
        console.log(res);
        var content_list = res.result.data;
        that.setData({
          content_list: content_list
        })
        //关闭提示
        wx.hideLoading();
      }
    })
  },

  //得到用户是否关注
  getFollow: function (info) {
    var that = this;
    wx.cloud.callFunction({
      name: 'query',
      data: {
        tab_name: 'tab_follow',
        where: {
          follow_user_id: info.user_info._id, //被关注用户id
          openid: wx.getStorageSync('openid') //创建者openid
        }
      },
      complete: function (res) {
        console.log(res);
        var data = res.result.data;
        if (data != null && data.length >= 1) {
          info.user_info.is_follow = data[0].state;
          info.user_info.follow_id = data[0]._id;
        } else {
          info.user_info.is_follow = 1;
          info.user_info.follow_id = null;
        }
        that.setData({
          info: info
        })
      }
    })
  },

  //跳转,提示
  btn_navigate(e) {
    var that = this;
    var param, url;
    var next = that.data.next;
    switch (next) {
      case "lswl":
        param = "&tab_name=tab_my_event";
        param += "&id=" + that.data.id;
        url = '/pages/index/lswl/hq_list_details/hq_list_details?1=1';
        url += param;
        wx.navigateTo({
          url: url
        });
        break;
      case "wmyhb":
        param = "&tab_name=tab_my_event";
        param += "&id=" + that.data.id;
        break;
      default:
        break;
    }
  },

  //点击(关注/取消关注)
  btnSetFollow: function (e) {
    var that = this;
    //提示
    wx.showLoading({
      title: '处理中..'
    })
    var id = e.currentTarget.id;
    var state = e.currentTarget.dataset.state;
    var info = that.data.info;
    if (app.checkInput(id)) {
      //不存在,执行添加
      that.addFollow();
    } else {
      //修改关注状态
      wx.cloud.callFunction({
        name: 'update',
        data: {
          tab_name: 'tab_follow',
          where: {
            _id: id,
          },
          update_data: {
            state: state
          }
        },
        complete: function (res) {
          console.log(res);
          info.user_info.is_follow = state;
          that.setData({
            info: info
          })
          //关闭提示
          wx.hideLoading();
        }
      });
    }
  },

  //添加关注数据
  addFollow: function () {
    var that = this;
    var info = that.data.info;
    wx.cloud.callFunction({
      name: 'add',
      data: {
        tab_name: 'tab_follow',
        form: {
          yw_id: info._id, //业务id
          state: 1, //关注
          follow_user_id: info.user_info._id, //被关注用户id
          follow_user_openid: info.user_info.openid, //被关注用户openid
          crt_date: new Date().toLocaleString(), //创建时间
          openid: wx.getStorageSync('openid'), //创建者openid
          crt_id: wx.getStorageSync('userinfo')._id //创建者user_id
        }
      },
      complete: function (res) {
        console.log(res);
        info.user_info.is_follow = 1;
        info.user_info.follow_id = res.result._id;
        that.setData({
          info: info
        })
        //关闭提示
        wx.hideLoading();
        //提示
        wx.showToast({
          title: '已关注',
          icon: "none"
        })
      }
    });
  },

  //点击爱心(喜欢/不喜欢)
  bindtabAX: function (e) {
    var that = this;
    //提示
    wx.showLoading({
      title: '处理中..'
    })
    var id = e.currentTarget.id;
    var state = e.currentTarget.dataset.state;
    state = state == 1 ? 0 : 1;
    var info = that.data.info;
    if (app.checkInput(id)) {
      //不存在,执行添加
      that.addLike();
    } else {
      //修改喜欢状态
      wx.cloud.callFunction({
        name: 'update',
        data: {
          tab_name: 'tab_like',
          where: {
            _id: id
          },
          update_data: {
            state: state
          }
        },
        complete: function (res) {
          console.log(res);
          info.is_like = state;
          that.setData({
            info: info
          })
          //关闭提示
          wx.hideLoading();
        }
      });
    }

  },

  //添加喜欢数据
  addLike: function () {
    var that = this;
    var info = that.data.info;
    wx.cloud.callFunction({
      name: 'add',
      data: {
        tab_name: 'tab_like',
        form: {
          yw_id: info._id, //业务id
          state: 1, //喜欢
          crt_date: new Date().toLocaleString(), //创建时间
          openid: wx.getStorageSync('openid'), //创建者openid
          crt_id: wx.getStorageSync('userinfo')._id //创建者user_id
        }
      },
      complete: function (res) {
        console.log(res);
        info.is_like = 1;
        info.like_id = res.result._id;
        that.setData({
          info: info
        })
        //关闭提示
        wx.hideLoading();
        //提示
        wx.showToast({
          title: '已喜欢',
          icon: "none"
        })
      }
    });
  },

  //tab点击切换
  tabClick: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    var index = e.currentTarget.dataset.index;

    //设置
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: index
    });

    //tabs_id得到tab菜单导航内容
    that.getTabsContent(id);

  },

  //监听页面显示
  onShow:function(e){
    //根据项目id得到信息
    this.get();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      console.log("来自页面内转发按钮");
      console.log(res.target);
      //that.setUserShare(that);
    } else {
      console.log("来自右上角转发菜单")
    }

    //分享记录
    app.addShareInfo(that);

    return {
      title: '详情',
      desc: "" + that.data.info.title,
      path: '/pages/indexTo/yeHuo/yeHuoDetail/yeHuoDetail?id=' + that.data.id,
      success: (res) => {
        console.log("转发成功", res);
      },
    }
  }
})