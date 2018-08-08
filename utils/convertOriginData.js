const srcList = {
  "0": "sunny",
  "99": "sunny",
  "1": "cloudy",
  "2": "overcast",
  "3": "lightrain",
  "22": "lightrain",
  "9": "lightrain",
  "7": "moderaterain",
  "8": "moderaterain",
  "21": "moderaterain",
  "301": "moderaterain",
  "4": "pour",
  "10": "pour",
  "11": "pour",
  "12": "pour",
  "23": "pour",
  "24": "pour",
  "25": "pour",
  "5": "sleety",
  "6": "sleety",
  "19": "haily",
  "13": "lightsnow",
  "14": "lightsnow",
  "26": "lightsnow",
  "15": "heavysnow",
  "16": "heavysnow",
  "17": "heavysnow",
  "27": "heavysnow",
  "28": "heavysnow",
  "302": "heavysnow",
  "18": "foggy",
  "32": "foggy",
  "49": "foggy",
  "53": "foggy",
  "54": "foggy",
  "55": "foggy",
  "56": "foggy",
  "57": "foggy",
  "58": "foggy",
  "20": "windy",
  "29": "sandstormy",
  "30": "sandstormy",
  "31": "sandstormy",
  "39": "tornado"
}

const getImgUrl = (wid) => {
  return `/img/${srcList[wid]}.png`
}

const convertOriginData = (originData) => {
  const {
    week,
    updatetime,
    weather,
    temp,
    temphigh,
    templow,
    winddirect,
    humidity,
    index: [airconditioner, exercising, uv, , carwashing, , dressing],
    img,
    city,
    daily,
    cityid
  } = originData
  const future = daily.map((val, idx) => {
    const { day: { img } } = val
    const imgSrc = getImgUrl(img)
    val.day.img = imgSrc
    return val
  })
  return {
    cityName: city,
    week: week,
    updatetime: updatetime,
    weather: weather,
    tempNow: temp + "℃",
    temp: templow + "℃" + "~" + temphigh + "℃",
    wind: winddirect,
    humidity: `湿度${humidity}%`,
    wid: getImgUrl(img),
    airconditioner: airconditioner,
    uv: uv,
    exercising: exercising,
    carwashing: carwashing,
    dressing: dressing,
    future: future,
    cityId: cityid
  }
}

export default convertOriginData