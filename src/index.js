var API_KEY = PropertiesService.getScriptProperties().getProperty("OPEN_WEATHER_MAP_API_KEY");

function main() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getRange("A2:I64")
  var values = range.getValues();

  // スプレッドシートのユーザーレコード数分処理
  for (var i=0; i<values.length; i++) {
    var user = values[i];
    sendEmail(user);
  }
}

// ユーザーレコードの都市、国情報から天気情報を取得し、
// 気温が基準値を超過していた場合にメール通知をだす
function sendEmail(user) {
  Logger.log("sendNotice:", user);

  var userMap = toMap(user);

  if (userMap.id === "" || !userMap.sendable) {
    Logger.log("IDか通知フラグがfalseのため処理をスキップ");
    return;
  }

  // スプレッドシートの情報を定期実行にセットすることはできないので
  // 毎時間起動するけれど、現在時刻がユーザ定義時間かどうか判定し、
  // trueのときは後続の処理を実行するようにする。
  if (!isRangeTime(userMap, new Date())) {
    Logger.log("ユーザ定義時間でないのでスキップ");
    return;
  }

  // 気温を取得
  var weather = getWeatherJSON(userMap.city, userMap.country);
  var currentTemperature = weather.list[0].main.temp;
  var minTemperature = weather.list[0].main.temp_min;
  var maxTemperature = weather.list[0].main.temp_max;

  // 気温が下限値を下回ったら通知
  if (minTemperature < userMap.underTemperature) {
    Logger.log("気温が下限を下回っていたのでメール通知");
    var info = "⇩";
    send(userMap, info, weather);
    return;
  }

  // 気温が上限値を上回ったら通知
  if (userMap.overTemperature < maxTemperature) {
    Logger.log("気温が上限を上回っていたのでメール通知");
    var info = "⇧";
    send(userMap, info, weather);
    return;
  }
}

function toMap(user) {
  return {
    id: user[0],
    name: user[1],
    email: user[2],
    noticeTime: user[3],
    underTemperature: user[4],
    overTemperature: user[5],
    city: user[6],
    country: user[7],
    sendable: user[8]
  };
}

// isRangeTime は時刻が、ユーザのメール通知時刻かどうかを判定する。
function isRangeTime(user, date) {
  var userTime = takeFormatedTime(user.noticeTime);
  var checkTime = takeFormatedTime(date);
  var userTimeHour = userTime.split(":")[0];
  var checkTimeHour = checkTime.split(":")[0];
  return userTimeHour === checkTimeHour;
}

// send はユーザ情報などから件名、本文をセットしてメール送信する。
// FIXME 関数名が適当すぎた...。もうちょいわかりやすい名前にしたい。
function send(userMap, info, weather) {
  var weatherIcon = getWeatherIconString(weather.list[0].weather[0].id);
  info = weatherIcon + info;

  var subject = makeSubject(userMap, info);
  var message = makeMessage(userMap, weather);

  MailApp.sendEmail(userMap.email, subject, message);
}

// makeSubject はメール件名を作成する。
function makeSubject(user, message) {
  var currentTime = getCurrentFormatedDateTime();
  var subject = "【お天気情報】" + currentTime + "/" + message;
  return subject;
}

// makeMessage はメール本文を作成する。
function makeMessage(user, weather) {
  var weatherIcon = getWeatherIconString(weather.list[0].weather[0].id);
  var currentTemperature = weather.list[0].main.temp;
  var minTemperature = weather.list[0].main.temp_min;
  var maxTemperature = weather.list[0].main.temp_max;
  var message = user.name + " 様\n\n" +
    user.city + "の現在の天気情報です。\n\n" +
    "天気: " + weatherIcon + "\n" +
    "現在気温: " + currentTemperature + "\n" +
    "最低気温: " + minTemperature + "\n" +
    "最高気温: " + maxTemperature + "\n";
  return message;
}
