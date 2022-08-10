/* 
 * Copyright by Pascal Stoop
 */
  
function getPositionFromEvent(event, refCanvas) {
  let result = { x: 0, y:0};
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
  
function calcNextObjTime(noSuccessObj) {
    let result = Date.now();
    if (noSuccessObj > 50) {
      result +=150;
    }
    else if (noSuccessObj > 40) {
      result +=250;
    }
    else if (noSuccessObj > 30) {
      result +=350;
    }
    else if (noSuccessObj > 20) {
      result +=450;
    }
    else if (noSuccessObj > 10) {
      result +=550;
    }
    else {
      result +=650;
    }
    return result;
}
