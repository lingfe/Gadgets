// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //查询
  try{
    return await  db.collection(event.tab_name).where(event.where).get();
  }catch(e){
    console.error(e);
  }
}