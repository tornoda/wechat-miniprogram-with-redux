import {
  SAVE_NAME,
  DELETE_NAME,
  SAVE_NAMES,
  SAVE_WEATHER
} from '../actions/simpleActions'

//添加name(s)到state.cities
//在state.cities中删除name
const defaultNameList = []
export const disposeHandleName = (state = defaultNameList, action) => {
  const name = action.name
  const position = state.indexOf(name)
  switch (action.type) {
    case `${SAVE_NAME}_${name}`:
      //若城市不在列表中
      if (position === -1) {
        ////首页城市的情况
        if (action.isIndexCity)
          return [
            name,
            ...state
          ]
        ////非首页城市
        return [
          ...state,
          name
        ]
      } else {
        //处理本身存在的情况
        ////若存在且在第一个，不改变原state
        if (!action.isIndexCity)
          return state
        if (position === 0)
          return state
        const brokenCities = state.slice().splice(position, 1)
        return [
          name,
          ...brokenCities
        ]
        ////若存在且不在第一个，把它调到第一个
      }
    case `${DELETE_NAME}_${name}`:
      const index = state.indexOf(name)
      const newState = state.slice()
      newState.splice(index, 1)
      return newState
    case `${SAVE_NAMES}_${name}`:
      return [
        ...state,
        ...name
      ]
    default:
      return state
  }
}

//添加weatherData到state.citiesWeather 
const defaultWeatherData = {}
export const disposeSaveWeather = (state = defaultWeatherData, action) => {
  const { name, weather } = action
  switch (action.type) {
    case `${SAVE_WEATHER}_${action.name}`:
      return {
        ...state,
        [name]: weather
      }
    default:
      return state
  }
}