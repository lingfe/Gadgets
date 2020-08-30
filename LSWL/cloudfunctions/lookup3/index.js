// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var page=event.pageing;
  var pageIndex=(page.pageIndex -1 ) * page.pageNum;
  console.log(page);
  //3联表查询
  try{
    return await db.collection(event.tab_name)
    .aggregate()
    .sort({
      crt_date:-1
    })
    .match(event.where)
    .lookup(event.lookup.lookup1)
    .lookup(event.lookup.lookup2)
    .skip(pageIndex)
    .limit(page.pageNum)
    .end()
  }catch(e){
    console.error(e);
  }
}