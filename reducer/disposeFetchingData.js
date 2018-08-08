import { REQUSET_BEGIN, RECEIVED, REQUEST_FAILED } from '../actions/3Steps'
import {
  GPS,
  IP,
  WEATHER
} from '../actions/fetchingData'

const NOTSTARTED = 'NOT_STARTED'

//处理GPS action
const defaultGPS = {
  status: NOTSTARTED,
  location: {}
}
export const disposeGPS = (state = defaultGPS, action) => {
  switch (action.type) {
    case REQUSET_BEGIN + GPS:
      return {
        ...state,
        status: REQUSET_BEGIN
      }
    case RECEIVED + GPS:
      return {
        ...state,
        status: RECEIVED,
        location: action.location
      }
    case REQUEST_FAILED + GPS:
      return {
        ...state,
        status: REQUEST_FAILED,
        err: action.err
      }
    default:
      return state;
  }
}

//处理IP action
const defaultIP = {
  status: NOTSTARTED,
  ip: ''
}
export const disposeIP = (state = defaultIP, action) => {
  switch (action.type) {
    case REQUSET_BEGIN + IP:
      return {
        ...state,
        status: REQUSET_BEGIN,
      }
    case RECEIVED + IP:
      return {
        ...state,
        status: RECEIVED,
        ip: action.res.ip,
        name: action.res.name
      }
    case REQUEST_FAILED + IP:
      return {
        ...state,
        status: REQUEST_FAILED,
        err: action.err
      }
    default:
      return state;
  }
}

//处理WEATHER action
const defaultWeather = {
  status: NOTSTARTED,
  weather: {}
}
export const disposeWeather = (state = defaultWeather, action) => {
  switch (action.type) {
    case REQUSET_BEGIN + WEATHER:
      return {
        ...state,
        status: REQUSET_BEGIN
      }
    case RECEIVED + WEATHER:
      return {
        ...state,
        status: RECEIVED,
        weather: action.res
      }
    case REQUEST_FAILED + WEATHER:
      return {
        ...state,
        status: REQUEST_FAILED,
        err: action.err
      }
    default:
      return state;
  }
}