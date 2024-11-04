import React, { forwardRef } from 'react';

const SelectionBox = forwardRef(({ style }, ref) => (
  <div
    ref={ref}
    style={{
      position: 'absolute',
      border: '1px solid grey',
      cursor: 'move',
      ...style,
    }}
  />
));

export default SelectionBox;