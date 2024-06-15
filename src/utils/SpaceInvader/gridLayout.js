// this class wont be in production it only helps with drawing the elements on the canva
// USE ONLY IN DEVELOPMENT
class GridLayout {
  drawGrid(w, h, ctx) {
      const gridXAxis = [];
      const gridYAxis = [];
      for (let x = 0; x < w; x += 10) { // changing between 25 and 50 to read positions
          gridXAxis.push(x);
          for (let y = 0; y < h; y += 10) { // changing between 25 and 50 to read positions
              ctx.strokeStyle = "green";
              ctx.beginPath();
              ctx.moveTo(x, 0);
              ctx.lineTo(x, h);
              ctx.moveTo(0, y);
              ctx.lineTo(w, y);
              ctx.stroke();
              if (!gridYAxis.includes(y)) {
                  gridYAxis.push(y);
              }
          }
      }

      gridXAxis.push(w);
      gridYAxis.push(h);

      return [{
          xAxis: gridXAxis,
          yAxis: gridYAxis 
      }];
  }
}

export default GridLayout;

// this.helper.drawGrid(this.canvas.width, this.canvas.height, this.context);