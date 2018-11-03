// getWeatherJSON は指定の都市の気象情報を取得する。
function getWeatherJSON(city, country) {
  Logger.log("getWeatherJSON:", city, country);

  var url = "http://api.openweathermap.org/data/2.5/find?q=" + city + "," + country + "&units=metric&appid=" + API_KEY;
  var json = UrlFetchApp.fetch(url).getContentText();
  var jsonData = JSON.parse(json);
  return jsonData;
}

// getWeatherIconString は天候コードをアイコン文字列に変換する。
function getWeatherIconString(code) {
  Logger.log(code);
  var weather = Math.floor(code / 100);
  
  var weatherIconString = "";
  switch (weather) {
    case 2:
    case 3:
    case 5:
      weatherIconString = "☔️";
      break;
    case 6:
      weatherIconString = "☃️";
      break;
    case 7:
      weatherIconString = "🌫️";
      break;
    case 8:
      if (code == 800) weatherIconString = "🌞";
      else weatherIconString = "☁️";
      break;
    default:
      weatherIconString = "❓";
      break;
  }
  return weatherIconString;
}
