// getCurrentFormatedTime は現在時刻を書式を整えて返す。
function getCurrentFormatedDateTime() {
  return formatTime(new Date());
}

// takeFormatedDate は対象日時の日付部分のみを取得する。
function takeFormatedDate(dt) {
  return formatTime(dt).split(" ")[0];
}

// takeFormatedDate は対象日時の時刻部分のみを取得する。
function takeFormatedTime(dt) {
  return formatTime(dt).split(" ")[1];
}

// formatTime はDate変数から時刻文字列を生成する。
function formatTime(dt) {
  var year    = dt.getFullYear();
  var month   = ("0" + (dt.getMonth() + 1)).slice(-2);
  var date    = ("0" + dt.getDate()).slice(-2);
  var hours   = ("0" + dt.getHours()).slice(-2);
  var minutes = ("0" + dt.getMinutes()).slice(-2);
  var seconds = ("0" + dt.getSeconds()).slice(-2);
//  return year + "/" + month + "/" + date + " " + hours + ":" + minutes + ":" + seconds + " GMT+0900(JST)"
  return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
}

