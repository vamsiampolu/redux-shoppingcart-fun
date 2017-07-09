import React from 'react'
import {render} from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import Main from './app'

const app = document.getElementById('app')

const renderWithHmr = Component => {
  render(<AppContainer><Component /></AppContainer>, app)
}

renderWithHmr(Main)
if (module.hot) {
  module.hot.accept('./App', () => renderWithHmr(Main))
}
