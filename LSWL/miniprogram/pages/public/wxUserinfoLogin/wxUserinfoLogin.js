/**  
 *   作者:  lingfe 
 *   时间:  2017-7-26
 *   描述:  微信登录
 * 
 * */
var app = getApp();

Page({

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  },

  //自定义获取用户数据
  getUserInfo: function (e) {
    var that=this;
    //保存用户信息
    console.log(e);
    var userinfo = e.detail.userInfo;
    //保存用户信息
    var form = {
      user_name: userinfo.nickName,
      img: userinfo.avatarUrl,
      gender: userinfo.gender,
      province: userinfo.province,
      city: userinfo.city,
      country: userinfo.country,
      openid: wx.getStorageSync('openid'),
      crt_id: wx.getStorageSync('openid'),
      crt_date: new Date().toLocaleString(),
      integral:0,
      nmhs_jin:0,//斤
      state: 0
    }
    wx.cloud.callFunction({
      name: 'add',
      data: {
        tab_name: 'tab_user_info',
        form: form
      },
      complete: function (res) {
        console.log(res);
        wx.setStorageSync('userinfo', form);
        that.setData({
          userinfo:form
        })
        wx.showModal({
          title: '登录成功',
          showCancel: false,
        });
      }
    })
  },

    //发送模板消息
    webStoketReq: function (loginRes) {
      var that = this;
      console.log(loginRes);
      //1.获取 access_token
      var url = app.config.login_sys + 'cgi-bin/token';
      //参数
      var data = {
        grant_type: 'client_credential',
        appid: app.globalData.appid,
        secret: app.globalData.secret
      };
  
      //发送请求
      app.request.reqGet(url, data, function (res) {
        console.log(res);
        //2.发送模板消息
        url = app.config.login_sys + 'cgi-bin/message/wxopen/template/send?access_token=' + res.data.access_token;
        //请求头
        var header = {
          'content-type': 'application/json'
        };
        //参数
        data = {
          touser: wx.getStorageSync('openid'), //微信用户openid
          template_id: 'xLM4QMhu_SPW0AXfezQwPt5cOrbpHlVEdQ9i8NldbMw', //模板id
          page: '/pages/index/index', //跳转的页面，相对
          form_id: loginRes.formid, //formid，表单id
          data: {
            "keyword1": {
              "value": "欢迎您登录搭伙小程序!",
              "color": "#173177"
            },
            "keyword2": {
              "value": loginRes.data.userInfo.nickName,
              "color": "#173177"
            },
            "keyword3": {
              "value": app.getDateTime,
              "color": "#173177"
            }
          } //'模板内容'，
        };
  
        //发送请求
        app.request.reqPost(url, header, data, function (res) {
          console.log(res);
          //登录请求
          that.loginRequest(loginRes);
        });
      });
    },
})