import loggedReducer from './isLogged'
import loadingReducer from './isLoading'
import addToCartReducer from './cart'
import setPaymentReducer from './setPayment'
import setShippingReducer from './setShipping'

import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

const allReducers = combineReducers({
    isLogged : loggedReducer,
    isLoading : loadingReducer,
    inCart: addToCartReducer,
    orderPayment: setPaymentReducer,
    orderShipping: setShippingReducer,
    form: formReducer
})

export default allReducers
