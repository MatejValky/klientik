import React, { useRef } from 'react';
import Card from "./card";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.css";
import SelectionBox from './SelectionBox';
import useSnippetTool from './useSnippetTool';

function App() {
  const selectionBoxRef = useRef(null);
  const { 
    screenshotting, 
    startSnippetTool, 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp, 
    boxStyle,
    response
  } = useSnippetTool(selectionBoxRef);
  return (
    <div
      className="extension"
      tabIndex={0}
      onClick={screenshotting ? handleMouseDown : undefined}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onKeyDown={startSnippetTool}
    >
      <Card gotAnswer={response} />
      <SelectionBox ref={selectionBoxRef} style={boxStyle} />
      <h2>{response ? response : "Loading"}</h2>
    </div>
  );
}

export default App;

