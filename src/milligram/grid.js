export const rootFontSize = '10px'

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

  maxWidth: '112rem', // = 1120px

  position: 'relative', // why use position relative here
  width: '100%'
}

const baseRow = {
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  width: '100%',
  // based on the original author's intent, original comment said:
  // Safari desktop has a bug using `rem`, but Safari mobile works
  '@media (min-width: 40.0rem)': {
    flexDirection: 'row',
    marginLeft: '-1.0rem',
    width: 'calc(100% + 2.0rem)'
  }
}

const ROW_ALIGNMENT_VALUES = ['top', 'bottom', 'center', 'stretch', 'baseline']

// mutates style of child component, mutates row
// Definitely not functional
export const row = options => {
  const {padding = true, wrap = false, alignment} = options
  let row = {}
  if (options != null) {
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
      row.flexWrap = 'wrap'
    }

    switch (alignment) {
      case 'top':
        row.alignItems = 'flex-start'
        break
      case 'bottom':
        row.alignItems = 'flex-end'
        break
      case 'center':
        row.alignItems = 'center'
        break
      case 'stretch':
        row.alignItems = 'stretch'
        break
      case 'baseline':
        row.alignItems = 'baseline'
        break
      default:
        throw new Error(
          `The value provided for alignment must be one of ${JSON.stringify(ROW_ALIGNMENT_VALUES)}, instead you provided ${alignment}`
        )
    }
  }
  return baseRow
}

const baseColumn = {
  display: 'block',
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 'auto',
  '@media (min-width: 40.0rem)': {
    flexDirection: 'row',
    marginLeft: '-1.0rem',
    width: 'calc(100% + 2.0rem)'
  }
}

const COLUMN_ALIGNMENT_VALUES = ['top', 'botttom', 'center']
const COLUMN_PC_VALUES = [10, 20, 25, 33, 34, 40, 60, 66, 67, 75, 80, 90]

// span and offset are calculated over 100
export const column = options => {
  if (
    options != null &&
    !Array.isArray(options) &&
    typeof options === 'object'
  ) {
    const {span, offset, alignment} = options
    let res = {}
    if (span != null && COLUMN_PC_VALUES.includes(span)) {
      res = {
        ...baseColumn,
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: `${span}%`,
        maxWidth: `${span}%`
      }
    } else if (span != null) {
      throw new Error(
        `The column span for milligram needs to be specified using a percent value that matches one of ${JSON.stringify(COLUMN_PC_VALUES)}, instead you provided ${span}`
      )
    }

    if (offset != null && COLUMN_PC_VALUES.includes(offset)) {
      res.marginLeft = `${offset}%`
    } else if (offset != null) {
      throw new Error(
        `The column offset for milligram is specified in percent values matching one of these ${JSON.stringify(COLUMN_PC_VALUES)}, instead you provided offset`
      )
    }

    switch (alignment) {
      case 'top':
        res.alignSelf = 'flex-start'
        break
      case 'bottom':
        res.alignSelf = 'flex-end'
        break
      case 'center':
        res.alignSelf = 'center'
        break
      default:
        throw new Error(
          `The alignment value provided was ${alignment}, it should have been one of ${JSON.stringify(COLUMN_ALIGNMENT_VALUES)}`
        )
    }
  }
  return baseColumn
}
