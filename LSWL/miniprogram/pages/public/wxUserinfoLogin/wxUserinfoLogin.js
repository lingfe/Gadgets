/**  
 *   作者:  lingfe 
 *   时间:  2017-7-26
 *   描述:  微信登录
 * 
 * */
var app = getApp();

Page({

  data:{
    userinfo:{
      img:'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2561659095,299912888&fm=26&gp=0.jpg',
      user_name:'未登录',
    }
  },

  //返回
  fanhui:function(e){
    wx.navigateBack();
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
  },

  //获取用户
  getWhereOpenid:function(that){
    wx.cloud.callFunction({
      name: 'query',
      data: {
        tab_name: 'tab_user_info',
        where:{
          openid:wx.getStorageSync('openid')
        }
      },
      complete:function(res){
        if(app.checkInput(res.result.data[0])){
          //保存用户信息
          that.saveUserInfo(that);
        }else{
          that.setData({
            userinfo:res.result.data[0]
          })

          wx.hideLoading()
        }
      }
    });
  },

  //保存用户信息
  saveUserInfo:function(that){
    var form=that.data.form;
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
          userinfo: form
        })
        wx.showModal({
          title: '登录成功',
          showCancel: false,
        });
        wx.hideLoading()
      }
    })
  },

  //用户登录，获取信息
  getUserInfo: function (e) {
    var that = this;
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
      integral: 0,
      nmhs_jin: 0, //斤
      state: 0
    }
    
    wx.showLoading({
      title: '登录中..',
      mask:true
    })
    //获取用户,先查询数据是否存在该用户
    that.data.form=form;
    that.getWhereOpenid(that);

    //发送模板消息
    //that.webStoketReq(e);
  },

  //发送模板消息
  webStoketReq: function (loginRes) {
    var that = this;
    console.log(loginRes);

    //发送模板消息参数
    var data = {
      touser: wx.getStorageSync('openid'), //微信用户openid
      template_id: 'QhpxicusQbaNhypRWuJjejhKqGNxaMO3Z-lkZYB3mbY', //模板id
      page: '/pages/index/index/index', //跳转的页面，相对
      miniprogram_state: "formal",
      "lang":"zh_CN",
      data: {
        "date5": {
          "value": "2019年12月30日"
        },
        "thing3": {
          "value": '测试一下',
        },
        "thing2": {
          "value": "功能描述",
        },
        "thing4": {
          "value": "说明",
        },
        "time1": {
          "value": "2019.09.23",
        }
      } //'模板内容'，
    };
    var access_token='';
    //获取接口调用凭证
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx4a82967c20ccc576&secret=ce2e823927082bad6a963403ae0129e0',
      success:function(res1){
        access_token=res1.data.access_token;
        //获取授权
        wx.requestSubscribeMessage({
          tmplIds: ['QhpxicusQbaNhypRWuJjejhKqGNxaMO3Z-lkZYB3mbY'],
          complete:function (res2) { 
            console.log("模板消息id+"+res2);
            //发送模板
            wx.request({
              url: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='+access_token,
              data:data,
              method:"POST",
              success:function(res3){
                console.log("发送模板+"+res3);
                
              }
            })
          }
        })
      }
    })
  },
})