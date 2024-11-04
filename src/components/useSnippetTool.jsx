import { useState } from 'react';
import html2canvas from 'html2canvas';

function useSnippetTool(selectionBoxRef) {
  const [isDragging, setIsDragging] = useState(false);
  const [screenshotting, setScreenshotting] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [response, setResponse] = useState('');
  const [boxStyle, setBoxStyle] = useState({
    display: 'none',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const startSnippetTool = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "`") {
      setBoxStyle((prev) => ({ ...prev, display: 'none' }));
      setScreenshotting(true);
    }
  };

  const handleMouseDown = (e) => {
    if (!screenshotting) return;

    const { clientX: startX, clientY: startY } = e;
    setStartCoords({ x: startX, y: startY });
    setBoxStyle({
      display: 'block',
      top: startY,
      left: startX,
      width: 0,
      height: 0,
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const { clientX, clientY } = e;
    const width = clientX - startCoords.x;
    const height = clientY - startCoords.y;

    setBoxStyle({
      display: 'block',
      top: height < 0 ? clientY : startCoords.y,
      left: width < 0 ? clientX : startCoords.x,
      width: Math.abs(width),
      height: Math.abs(height),
    });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const { top, left, width, height } = selectionBoxRef.current.getBoundingClientRect();
    html2canvas(document.body, { x: left, y: top, width, height }).then(async (canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL();

      await fetch('https://secret404.onrender.com/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: link.href }),
      })
        .then((res) => res.json())
        .then((data) => {
            setResponse(data.text);
            console.log(data);
        });
      console.log(link.href);
    });

    setBoxStyle((prev) => ({ ...prev, display: 'none' }));
    setScreenshotting(false);
  };

  return {
    screenshotting,
    startSnippetTool,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    boxStyle,
    response,
  };
}

export default useSnippetTool;
