// 云函数入口文件
import { getWXContext } from 'wx-server-sdk';
const db = cloud.database();

// 云函数入口函数
exports.mian = async(event, context) =>{
  const wxContext = getWXContext()
  var docid = event.docid
  var vdata1 = event.data1
  var vdata2 = event.data2
  
  try{
    return await db.collection('tab_my_cash_gift')
      .aggregate()
      .group({
        _id: 'null',
        totalPrice: db.command.aggregate.sum('$cash_gift')
      })
      .end()
  }catch(e){
    console.log(e);
  }
}