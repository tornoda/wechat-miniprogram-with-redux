//app.js
//使用redux来辅助完场这个应用
import reducer from './reducer/index'
import { createStore, applyMiddleware } from './module/redux'
import logger from './module/redux-logger'//redux控制台debug中间件
import thunkMiddleware from './module/redux-thunk'//redux处理异步请求中间件
import { SAVE_NAMES, handleName } from './actions/simpleActions'
import { setStorage, getStorage } from './utils/wxPromise'

export const store = createStore(
  reducer,
  applyMiddleware(
    logger,
    thunkMiddleware
  )
)

const { getState, dispatch } = store

App({
  onLaunch: function () {
    getStorage({ key: 'cities' })
      .then(
        (res) => dispatch(handleName(SAVE_NAMES, res.data))
      )
  },
  //利用localStorage存储历史城市列表
  onHide: function () {
    const { cities } = getState()
    setStorage({
      key: "cities",
      data: cities
    })
  },
})