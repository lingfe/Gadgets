// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //获取表字段
  try{
    return await  db.collection("tab_sys_field")
    .where({tab_name:event.tab_name})
    .orderBy('sort', 'asc')
    .get();
  }catch(e){
    console.error(e);
  }
}