'use strict';
var im, dim;
var wdens = 50;
var hdens = 100;
var iterator;

function preload() {
  im = loadImage("image/colorful_flowers_11.jpg");
}

function* iterdraw(im) {

  // Voronoi way with trick less performance easiest to write
  
  rectMode(CENTER);
  var npoints = hdens * wdens;
  var points = [];
  
  var d = im.pixelDensity;
  var idx;
  im.loadPixels();
  for (var i = 0;i < npoints;i++) {
    points.push({'x':round(random(0, im.width)), 'y':round(random(0, im.height)), 'color':{}})
    //points[i].color = im.get(points[i].x, points[i].y);
    
    idx = 4 * (points[i].y * im.width + points[i].x);
    points[i].color.r = im.pixels[idx];
    points[i].color.g = im.pixels[idx+1];
    points[i].color.b = im.pixels[idx+2];
    points[i].color.a = im.pixels[idx+3];

    
  }
  im.updatePixels();
  
  var m = (im.width * im.height) / (4 * npoints) ;
  var prec = 1;
  var color;
  noStroke();
  for (var d = m;d > 0; d-=prec) {
    for(let p of points) {
      fill(p.color.r, p.color.g, p.color.b, p.color.a);
      ellipse(p.x, p.y, d, d);
      //rect(p.x, p.y, d, d);
    }
    yield i/d;
  }
  return;
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  hdens = round(im.height / hdens);
  wdens = round(im.width / wdens);
  dim = createImage(wdens, im.height/hdens);
  dim.copy(im, 0, 0, im.width/wdens, im.height, 0, 0, dim.width, dim.height);

  hdens = im.height / hdens;
  wdens = im.width / wdens;

  
  // deformation way
  //image(im, 0, 0);
  image(dim, 0, im.height);
  
  var shuf = [];
  for(var i = 0; i < (dim.width + 1) * (dim.height + 1); i++) {
    if (i > dim.width * dim.height || i < dim.width || i % dim.width === 0) {
      shuf[i] = [0, 0];
    } else {
        shuf[i] = [Math.trunc(random(-wdens/2, wdens/2)),
                   Math.trunc(random(-hdens/2, hdens/2))];
    }
  }
  console.log(shuf);
  var idx, col, r, g, b, dx, dy;
  dim.loadPixels();
  for(var x = 0;x < dim.width;x++) {
    for(var y = 0;y < dim.height;y++) {
      dx = shuf[x + y * dim.width][0];
      dy = shuf[x + y * dim.width][1];
      var dx10 = shuf[x + 1 + y * dim.width][0];
      var dy10 = shuf[x + 1 + y * dim.width][1];
      var dx01 = shuf[x + (y + 1) * dim.width][0];
      var dy01 = shuf[x + (y + 1) * dim.width][1];
      var dx11 = shuf[x + 1 + (y + 1) * dim.width][0];
      var dy11 = shuf[x + 1 + (y + 1) * dim.width][1];
      
      idx = 4 * (x + y * dim.width);
      r = dim.pixels[idx];
      g = dim.pixels[idx + 1];
      b = dim.pixels[idx + 2];
      fill(r, g, b);
      stroke(r, g, b);
      beginShape();
      vertex(x * wdens * dim.width + dx, y * hdens * dim.height + dy);
      vertex((x + 1) * wdens * dim.width + dx10, y * hdens * dim.height + dy10);
      vertex((x + 1) * wdens * dim.width + dx11, (y + 1) * hdens * dim.height + dy11);
      vertex(x * wdens * dim.width + dx01, (y + 1) * hdens * dim.height + dy01);
      endShape(CLOSE);
    }
  }
  dim.updatePixels();
  
  
  iterator = iterdraw(im);

}

/*
Maybe one day
generate  random triangles map for image
color for each triangle -> moy of px of dim
clik add trgl/remove trgl (up/reduce detail)
*/

function draw() {
  //iterator.next();
}
