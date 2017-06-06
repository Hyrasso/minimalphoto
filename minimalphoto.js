'use strict';
var im, dim;
var wdens = 50;
var hdens = 100;
var iterator;

function preload() {
  im = loadImage("image/colorful_flowers_11.jpg");
}

function draw_unit(x, y, d, type) {
  //https://en.wikipedia.org/wiki/Norm_(mathematics)
  switch (type) {
    case "manhattan" : 
      push();
      translate(x, y);
      rotate(QUARTER_PI);
      rect(0, 0, d, d);
      pop();
      break;
    case "tchebychev":
      rect(x, y, d, d);
    case "euclidian" :
    default :
      ellipse(x, y, d, d);
  }
}

function* iterdraw(im) {

  // Voronoi way with trick : less performance easiest to write
  
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
      // manhattan or euclidian or tchebychev
      draw_unit(p.x, p.y, d, "manhattan")

    }
    yield i/d;
  }
  return;
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  
  iterator = iterdraw(im);

}

/*
Maybe one day
generate  random triangles map for image
color for each triangle -> moy of px of dim
clik add trgl/remove trgl (up/reduce detail)
*/

function draw() {
  iterator.next();
}
