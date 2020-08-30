// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try{
    return await  db.collection(event.tab_name)
                  .where(event.where) //条件
                  .update({
                    data:event.update_data
                  }); //要修改的数据
  }catch(e){
    console.error(e);
  }
}