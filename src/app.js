import React from 'react'
import glamorous from 'glamorous'

import {container} from './milligram/grid'

const Container = glamorous.div(container)

export default class Main extends React.Component {
  render () {
    return <Container>Hello, World!</Container>
  }
}
