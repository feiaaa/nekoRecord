function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function today(date){//显示今天的日
  return date.getDate();
}
function curMonth(date) {//显示今天的月
  return date.getMonth() + 1;
}
module.exports = {
  formatTime: formatTime,
  today: today,//显示今天的日
  curMonth: curMonth//显示今天的月
}
