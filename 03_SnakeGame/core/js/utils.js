/* 
 * Copyright 2017 by Pascal Stoop
 */
  
  function getPositionFromEvent(event, refCanvas) {
    var result = { x: 0, y:0};
    if (event.x != undefined && event.y != undefined) {
      result.x = event.x;
      result.y = event.y;
    }
    else {
      result.x = event.clientX;
      result.y = event.clientY;
    }
    var elemInfos = refCanvas.getBoundingClientRect();
    result.x -= parseInt(elemInfos.left);
    result.y -= parseInt(elemInfos.top);
    return result;
  }
