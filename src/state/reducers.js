import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import auth from './modules/auth'
import vegetable from './modules/vegetable'

export default combineReducers({
  auth,
  vegetable,
  form: formReducer
})
