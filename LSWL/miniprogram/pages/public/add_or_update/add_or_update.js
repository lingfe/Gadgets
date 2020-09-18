// miniprogram/pages/public/add/add.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    yw_id: null, //业务id
    tab_name: "tab_my_cash_gift", //表名
    text: '保存', //默认
  },

  //字段赋值
  setField_value: function (e) {
    try {
      var that = this;
      var fields = that.data.fields;
      fields.forEach(fd => {
        if (fd._id == e.currentTarget.id) {
          fd.field_value = e.detail.value;
          that.setData({
            fd_data: fields
          })
          throw '得到数据,跳出forEach:' + fd.field_value;
        }
      });
    } catch (e) {
      console.log(e)
    }
  },

  //选择地址
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    //赋值
    this.setField_value(e);
  },

  //选择日期
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    //赋值
    this.setField_value(e);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth();
    var day=date.getDay();
    that.setData({
      startTime:year+"-"+month+"-"+day,
      yw_id: options.yw_id, //业务id
      tab_name: options.tab_name //表名
    });
    //得到字段
    that.getField(that);
    //验证非空
    if (id != null) {
      wx.setTopBarText({
        text: '修改',
      })
      that.setData({
        text: "修改",
        id: id //如果id不为空则为修改
      })
    }
  },

  //查询
  query: function (that) {
    wx.cloud.callFunction({
      name: 'query',
      data: {
        tab_name: that.data.tab_name,
        where: {
          _id: that.data.id
        }
      },
      complete: function (res) {
        console.log(res);
        var info = res.result.data;
        if (info != null && info.length > 0) info = info[0];
        //得到字段
        var fields = that.data.fields;
        //遍历赋值
        var fd_data = [];
        fields.forEach(fd => {
          for (let key in info) {
            if(fd.field_type=="img_single"){
              that.setData({
                img:{
                  path:info[key]
                }
              });
            }
            if (fd.field_name == key) {
              fd.field_value = info[key];
              fd_data.push(fd);
              break;
            }
            
          }
        });
        //更新值
        that.setData({
          yw_id: info.yw_id,
          fd_data: fd_data
        })
      }
    });
  },

  //得到字段
  getField: function (that) {
    wx.cloud.callFunction({
      name: 'getField',
      data: {
        tab_name: that.data.tab_name,
      },
      complete: function (res) {
        console.log(res);
        var fields=res.result.data;
        that.setData({
          fields: fields,
          fd_data: fields
        })
        if (that.data.id != null) {
          //执行查询
          that.query(that);
        }
      }
    });
  },

  //提交
  submitForm: function (e) {
    var that = this;

    //数据
    var form = e.detail.value;
    if(app.checkInput(form.yw_id)){
      form.yw_id = that.data.yw_id; //业务id
    }

    //验证操作
    that.data.form = form;
    if (that.data.id == null) {
      that.add(that);
    } else {
      that.update(that);
    }
  },

  //添加
  add: function (that) {
    that.data.form.state=0;
    that.data.form.crt_date = new Date().toLocaleString(); //创建时间
    that.data.form.openid=wx.getStorageSync('openid');
    that.data.form.crt_id=wx.getStorageSync('userinfo')._id;
    //添加
    wx.cloud.callFunction({
      name: 'add',
      data: {
        tab_name: that.data.tab_name,
        form: that.data.form
      },
      complete: function (res) {
        console.log(res);
        //提示
        wx.showModal({
          title: '成功',
          content: '是否继续?',
          confirmText: "继续",
          cancelText: "返回",
          success: function (res) {
            console.log(res);
            //是否继续
            if (!res.confirm) {
              //返回
              wx.navigateBack();
            }
          }
        });
      }
    });
  },

  //修改
  update: function (that) {
    var form = that.data.form;
    wx.cloud.callFunction({
      name: 'update',
      data: {
        tab_name: that.data.tab_name,
        where: {
          _id: that.data.id,
        },
        update_data: form
      },
      complete: function (res) {
        console.log(res);
        //提示
        wx.showModal({
          title: '成功',
          content: '修改成功!是否返回?',
          confirmText: "是",
          cancelText: "否",
          success: function (res) {
            console.log(res);
            //是否
            if (res.confirm) {
              //返回
              wx.navigateBack();
            }
          }
        });
      }
    });
  },


  //删除图片
  bindtapImageDelete: function (e) {
    var fd = e.currentTarget.dataset.field;
    var that = this;
    //赋值为空
    that.setData({
      img:{
        images_single: [],
        length:0,
        path:null,
      }
    });
  },

  //单张图片上传
  //获取 图片
  chooseImage: function (e) {

    wx.showLoading({
      title: '正在上传中..',
      mask:true,
    })

    var that = this;
    wx.chooseImage({
      count: 1, //只能选择一张
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //上传
        var file_name=new Date();
        var file=res.tempFilePaths;
        var openid= wx.getStorageSync('openid');
        var cloudPath=file_name.getFullYear()
        +"/"+openid
        +"/"+file_name.toLocaleDateString()
        +"/"+file_name.getTime()
        +file[0].match(/\.[^.]+?$/)[0];
        wx.cloud.uploadFile({
          cloudPath:cloudPath,
          filePath:res.tempFilePaths[0],
          success:res=>{
            console.log("上传成功！"+res)
            //得到路径，https格式
            var arr=[];
            arr[0]=res.fileID;
            wx.cloud.getTempFileURL({
              fileList:arr,
              complete:url=>{
                console.log(url);
                var fileList=url.fileList;
                that.setData({
                  img:{
                    path:fileList[0].tempFileURL,
                    images_single:file,
                    length:file.length
                  }
                })
                //关闭loading
                wx.hideLoading();
              }
            })
          }
        })
      },
      fail:function(res){
        //关闭loading
        wx.hideLoading();
      }
    })
  },

  //图片预览
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.images_single // 需要预览的图片http链接列表
    })
  },
})