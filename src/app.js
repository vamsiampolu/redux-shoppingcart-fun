import React from 'react'
import {render} from 'react-dom'

function Main () {
  return <div>hello world</div>
}
const app = document.getElementById('app')

render(<Main />, app)
