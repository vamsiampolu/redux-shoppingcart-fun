/* eslint-disable */
import {matcher, serializer} from 'jest-glamor-react'

// output css to the snapshot instead of a className
expect.addSnapshotSerializer(serializer)

// adds a matcher toMatchSnapshotWithGlamor and makes snapshot diff look nice in the terminal
expect.extend(matcher)
