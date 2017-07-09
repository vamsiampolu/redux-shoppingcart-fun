export const container = {
  /* margin specified with 2 values is also vertical | horizontal */
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 'auto',
  marginRight: 'auto',

  /* padding specified with two values means vertical | horizontal */
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: '2rem',
  paddingRight: '2rem',

  maxWidth: '112rem',

  position: 'relative', // why use position relative here
  width: '100%'
}

const baseRow = {
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  width: '100%'
}

const ALIGNMENT_VALUES = ['top', 'bottom', 'center', 'stretch', 'baseline']

// mutates style of child component, mutates row
// Definitely not functional
export const row = options => {
  const {padding = true, wrap = false, alignment} = options
  let row = {}
  const isDefault = options == null || (padding && (!wrap && alignment == null))
  if (isDefault) {
    return baseRow
  } else {
    if (!padding) {
      row = {
        ...baseRow,
        padding: 0,
        '& > .column': {
          padding: 0
        }
      }
    }

    if (wrap) {
      const oldRow = row
      row = {
        ...oldRow,
        flexWrap: 'wrap'
      }
    }

    if (
      alignment != null &&
      typeof alignment === 'string' &&
      ALIGNMENT_VALUES.includes(alignment)
    ) {
      const alignmentConverter = {
        top: {alignItems: 'flex-start'},
        bottom: {alignItems: 'flex-end'},
        center: {alignItems: 'center'},
        stretch: {alignItems: 'stretch'},
        baseline: {alignItems: 'baseline'}
      }
      const oldRow = row
      row = {
        ...oldRow,
        ...alignmentConverter[alignment]
      }
    }
  }
}
