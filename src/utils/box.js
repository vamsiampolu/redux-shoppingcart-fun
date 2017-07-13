import glamorous from 'glamorous'

export const box = {
  position: 'relative',
  boxSizing: 'border-box',
  minHeight: '1.6rem', // usually css frameworks set font size to 16px, instead this is set to 10 px by milligram
  background: '#007FFF',
  border: '1px solid #fff',
  borderRadius: '2px',
  overflow: 'hidden',
  textAlign: 'center',
  color: '#fff'
}

export const boxFirst = {
  ...box,
  backgroundColor: '#06C',
  borderColor: '#007FFF'
}

export const BoxFirst = glamorous.div(boxFirst)

export const boxRow = {
  ...box,
  marginBottom: '1.6rem'
}

export const boxNested = {
  backgroundColor: '#036',
  borderColor: '#007FFF'
}

export const boxLarge = {
  ...box,
  height: '12.8rem'
}

export const Box = glamorous.div(box)
export const BoxRow = glamorous.div(boxRow)
export const BoxNested = glamorous.div(boxNested)
export const BoxLarge = glamorous.div(boxLarge)
