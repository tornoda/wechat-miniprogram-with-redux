//把请求过的名称保留到state的action
export const SAVE_NAME = 'SAVE_NAME'
export const DELETE_NAME = 'DELETE_NAME'
export const SAVE_NAMES = 'SAVE_NAMES'
export const handleName = (handleType, name, isIndexCity = false) => ({
  type: `${handleType}_${name}`,
  name,
  isIndexCity
})

//把城市的天气信息保存在state.citiesWeather 的action
export const SAVE_WEATHER = 'SAVE_WEATHER'
export const saveWeather = (weatherData) => {
  const { cityName } = weatherData
  return {
    type: `${SAVE_WEATHER}_${cityName}`,
    name: cityName,
    weather: weatherData
  }
}
