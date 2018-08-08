import {
  disposeGPS,
  disposeIP,
  disposeWeather,
} from './disposeFetchingData'
import { disposeHandleName, disposeSaveWeather } from './disposeSimpleAction'
import { combineReducers } from '../module/redux'

export default combineReducers({
  thisCity: combineReducers({
    gps: disposeGPS,
    ip: disposeIP,
    weather: disposeWeather
  }),
  cities: disposeHandleName,
  citiesWeather: disposeSaveWeather
})