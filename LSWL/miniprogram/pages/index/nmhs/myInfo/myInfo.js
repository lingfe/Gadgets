/**  
 *   作者:  lingfe 
 *   时间:  2017-10-25
 *   描述:  我的
 * 
 * */
var app = getApp();

Page({
  data: {
    admin: ["oQVxN5bg2NJD35Kv3fldU7p7t-x8", "oNWj80C6zKPwL2_muS08iIVtGhkA", "oh4300DFZdBeIGOoVKQK9OFuyPps", "oh4300BzivzPyMq9Uk05pF_GaVoc", "oh4300LBMs6n0ylQ1H3XK1jC90YU"], //管理员
    pagenum: 1, //分页，第几业
    pagesize: 1000, //返回数据量
  },

  //页面加载
  onLoad: function (options) {
    var that = this;
    //设置分享到朋友圈参数
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    //获取用户授权
    that.getSetting();
  },

  //获取用户信息
  getUserInfo:function(that){
    wx.cloud.callFunction({
      name:"query",
      data:{
        tab_name:'tab_user_info',
        where:{
          openid:wx.getStorageSync('openid')
        }
      },
      success:function(user){
        console.log(user);
        if(app.checkInput(user.result.data)){
          //不存在,跳转
          wx.navigateTo({
            url: '/pages/public/wxUserinfoLogin/wxUserinfoLogin',
          })
        }else{
          var userinfo=user.result.data[0];
          wx.setStorageSync('userinfo', userinfo);
          that.setData({
            userinfo:userinfo,
            city: userinfo.city == '' ? '地球' : userinfo.city
          });
          //根据当前城市获取用户并排名
          that.nmhsUser();
        }
      }
    })
  },

  //根据当前城市获取用户并排名
  nmhsUser: function () {
    var that = this;
    var where = {};
    var city = that.data.city;
    if (city != '地球') {
      where = {
        city: city
      }
    }
    const db = wx.cloud.database();
    db.collection('tab_user_info')
      .where(where)
      .orderBy("nmhs_jin", "desc") //降序
      .get({
        success: res => {
          that.setData({
            list: res.data
          })
          console.log('[数据库] [查询记录] 成功: ', res)
        }
      })
  },

  //获取用户授权
  getSetting: function () {
    var that = this;
    wx.getSetting({
      success: function (res) {
        console.log(JSON.stringify(res))
        //验证用户信息权限
        if (res.authSetting["scope.userInfo"] == undefined || res.authSetting["scope.userInfo"] == false) {
          //跳转登录
          wx.navigateTo({
            url: '/pages/public/wxUserinfoLogin/wxUserinfoLogin',
          })
          return;
        }
        //验证位置权限
        if (res.authSetting["scope.userLocation"] != undefined && res.authSetting["scope.userLocation"] != true) {
          wx.showModal({
            title: '授权',
            content: '请求获取您当前当前位置!用于城市排名，请您确认！',
            success: function (ad) {
              if (ad.cancel) {
                wx.showToast({
                  title: '拒绝授权！',
                  icon: 'none',
                  duration: 2000,
                });
              } else if (ad.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功！',
                        duration: 2000,
                      });
                      //获取经纬度
                      //that.getLocation();
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //获取经纬度
          //that.getLocation();
        } else {
          //获取经纬度
          //that.getLocation();
        }
      }
    })

  },

  //获取经纬度
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84', //'gcj02',// 'wgs84',
      success: function (res) {
        console.log(JSON.stringify(res));
        var latitude = res.latitude;
        var longitude = res.longitude;
        //获取当前地址
        //that.getLocal(latitude, longitude);
      }
    })
  },

  //获取当前地址
  getLocal: function (latitude, longitude) {
    var that = this;
    app.service.getJSON('/waimai/api/location.php', {
      latitude: latitude,
      longitude: longitude
    }, function (res) {
      console.log(JSON.stringify(res));
      //判断状态
      if (res.data.statusCode == 200) {
        var city = res.data.result.ad_info.city;
        if (app.checkInput(city)) return;
        if (city.lastIndexOf("市") != -1) city = city.substring(0, city.lastIndexOf("市"));
        else if (city.lastIndexOf("区") != -1) city = city.substring(0, city.lastIndexOf("区"));
        that.setData({
          addressInfo: city
        });
      } else {
        that.setData({
          addressInfo: '定位失败'
        });
      }
    });
  },

  //我的预约
  bindtapReservation: function (e) {
    wx.navigateTo({
      url: "/pages/index/nmhs/myReservation/myReservation",
    })
  },

  //提示框
  showModal: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
    });
  },

  //咨询柠檬提示
  bindtapShow: function (e) {
    wx.showModal({
      title: '提示',
      content: "请加微信号:18585094270，备注咨询柠檬"
    })
  },

  //点击头像事件
  userinfoBtntap: function (e) {
    var that = this;
    var name = that.data.userinfo.openid;
    var admin = that.data.admin;
    for (var i = 0; i < admin.length; ++i) {
      if (admin[i] == name) {
        wx.navigateTo({
          url: "/pages/index/nmhs/admin/admin",
        });
        return;
      }
    }

    wx.navigateTo({
      url: "/pages/index/nmhs/myReservation/myReservation",
    });
  },

  //我的贡献
  bindtabContribtion: function (e) {
    wx.navigateTo({
      url: "/pages/index/nmhs/myContribution/myContribution",
    });
  },

  //是否显示二维码
  consultationBtntap: function (e) {
    this.setData({
      erweimaBl: this.data.erweimaBl == false ? true : false,
    });
  },

  //页面显示时执行
  onShow: function () {
    var that = this;
    that.setData({
      pagenum: 1, //分页，第几业
      pagesize: 1000, //返回数据量 
    });

    //获取用户信息
    that.getUserInfo(that);
  },

  //用户下拉动作
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      pagenum: 1, //第几页
    });

    //获取用户信息
    that.getUserInfo(that);
    //下拉完成后执行回退
    wx.stopPullDownRefresh();
  },

  //页面上拉触底事件的处理函数
  onReachBottom: function () {
    var that = this;
    var num = that.data.pagenum;
    num++;
    that.setData({
      pagenum: num,
      isPrices: false,
    });

    //提示
    wx.showToast({
      title: '正在加载..',
      icon: 'loading',
      duration: 2000,
    });
  },

  //分享到朋友圈
  onshareTimeline: function (e) {
    return {
      title: '柠檬回收',
      query: 'id=123',
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

    return {
      title: '柠檬回收',
      desc: '让城市开始呼吸~',
      path: '/pages/index/nmhs/myInfo/myInfo',
      success: (res) => {
        console.log("分享成功", res);
      },
    }
  },
})