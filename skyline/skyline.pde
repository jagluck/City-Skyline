// Global variables
int vanishingPointX;
int vanishingPointY;

// Setup the Processing Canvas
// Setup the Processing Canvas
void setup(){
  fullScreen();
  strokeWeight( 10 );
  frameRate( 15 );
  vanishingPointX = int(displayWidth/2);
  vanishingPointY = int(displayHeight * .2);
  println(vanishingPointX);
  println(vanishingPointY);
  float scale;
  ellipse(vanishingPointX, vanishingPointY, 5, 5 );   
  line(vanishingPointX,vanishingPointY,.25*displayWidth,displayHeight);
  line(vanishingPointX,vanishingPointY,.75*displayWidth,displayHeight);
  for (int i = 1;i <6; i++){
    float[] street = slope_intercept(vanishingPointX,vanishingPointY,int(.25*displayWidth),displayHeight);
    int yLoc = int((((displayHeight-vanishingPointY)/6) * i) + vanishingPointY);
    for (int k = 1; k < 10;k++){
         int xLoc = int((((yLoc - street[1])/street[0])/10) * k);
         scale = (float(yLoc - vanishingPointY)/float(displayHeight-vanishingPointY));
         Building a = new Building(int(random(xLoc * .9,xLoc * 1.1)),int(random(yLoc * .9,yLoc * 1.1)),scale,true);
         draw_building(a);
    }
  }
   for (int i = 1;i <6; i++){
     float[] street = slope_intercept(vanishingPointX,vanishingPointY,int(.75*displayWidth),displayHeight);
     int yLoc = int((((displayHeight-vanishingPointY)/6) * i) + vanishingPointY);
     for (int k = 10; k > 1;k--){
         int place = int((yLoc - street[1])/street[0]);
         int xLoc = int((displayWidth - (place /10) * k) + vanishingPointX);
         scale = (float(yLoc - vanishingPointY)/float(displayHeight-vanishingPointY));
         Building a = new Building(int(random(xLoc * .9,xLoc * 1.1)),int(random(yLoc * .9,yLoc * 1.1)),scale,false);
         draw_building(a);
      }
    }
}

void printPoints(Building a){
 println("front" + a.front.p1.x + a.front.p1.y + " " + a.front.p2.x + a.front.p2.y + " " +
 a.front.p3.x + a.front.p3.y + " " + a.front.p4.x + a.front.p4.y);
 println("side" + a.side.p1.x + a.side.p1.y + " " + a.side.p2.x + a.side.p2.y + " " +
 a.side.p3.x + a.side.p3.y+ " " + a.side.p4.x + a.side.p4.y);
}

void draw_building(Building a){
  //front face
  strokeWeight(1);
  int col = int(random(255));
  int col2 = int(random(255));
  int col3 = int(random(255));
  fill(col,col2,col3);
  quad(a.front.p1.x, a.front.p1.y, a.front.p2.x, a.front.p2.y,
  a.front.p3.x, a.front.p3.y, a.front.p4.x, a.front.p4.y);
  
  //side face
  if (a.hasSide){
    col = int(random(255));
    col2 = int(random(255));
    col3 = int(random(255));
    fill(col,col2,col3);
    quad(a.side.p1.x, a.side.p1.y, a.side.p2.x,a.side.p2.y,
    a.side.p3.x, a.side.p3.y, a.side.p4.x,a.side.p4.y);
  }
  
  //top face
  if(a.hasTop)
  {
    col = int(random(255));
    col2 = int(random(255));
    col3 = int(random(255));
    fill(col,col2,col3);
    quad(a.top.p1.x,a.top.p1.y,a.top.p2.x,a.top.p2.y,
    a.top.p3.x,a.top.p3.y,a.top.p4.x,a.top.p4.y);
  }
}

float[] slope_intercept(int x1,int y1, int x2,int y2){
    float[] stuff = new float[2];
    
    float num = y2 - y1;
    float dum = x2 - x1;
    float m = num/dum; // find slope
    float b = y1 - m*x1; // find intercept;
    
    // slope is first element
    // intercept is second element
    stuff[0] = m;
    stuff[1] = b;
    
    return stuff;
    
    
}

class Building{
  float scale;
  boolean isLeft, hasTop, hasSide;
  Face top, front, side;
  int h, w, d;
  
  Building(int x, int y, float scale, boolean isLeft){
     this.scale = scale;
     this.isLeft = isLeft;
     this.w = int(random(int((scale * 100) * .5),int((scale * 100) * 3)));
     this.h = int(random(int((scale * 100) * .5),int((scale * 100) * 5)));
     this.d = int(random(int((scale * 25) * .8),int((scale * 25) * 1.2)));
     front = createFrontFace(x, y, w, h);
     
     float[] slope;
     int yVal;
     
     if (isLeft){
       slope = slope_intercept(front.p2.x,front.p2.y,vanishingPointX,vanishingPointY);
       yVal = int(slope[0] * (front.p2.x + this.d) + slope[1]);
       while (front.p2.y - yVal > this.w){
         this.d = this.d/2;
         yVal = int(slope[0] * (front.p2.x + this.d) + slope[1]);
       }
     }else{
        slope = slope_intercept(front.p1.x,front.p1.y,vanishingPointX,vanishingPointY);
        yVal = int(slope[0] * (front.p1.x - this.d) + slope[1]);
        while (front.p1.y - yVal > this.w){
         this.d = this.d/2;
         yVal = int(slope[0] * (front.p1.x - this.d) + slope[1]);
       }
     }
     
     
     if (front.p1.x <= vanishingPointX && front.p2.x >= vanishingPointX){
       hasSide = false;
       side = null;
     }else{
       hasSide = true;
       side = createSideFace(front, isLeft, d);
     }
     if (front.p3.y <= vanishingPointY){
       hasTop = false;
       top = null;
     }else{
       hasTop = true;
       top = createTopFace(front, side, isLeft);
     }
   }
  
   //constructs front face
   Face createFrontFace(int x, int y, int faceWidth, int faceHeight){
     Point p1,p2,p3,p4;
      
     //set points
     if (isLeft){
       p1 = new Point(x, y);
       p2 = new Point(x + faceWidth, y);
       p4 = new Point(x, y - faceHeight);
       p3 = new Point(x + faceWidth, y - faceHeight);
     }else{
       p2 = new Point(x, y);
       p1 = new Point(x - faceWidth, y);
       p3 = new Point(x, y - faceHeight);
       p4 = new Point(x - faceWidth, y - faceHeight);
     }
    
     //construct face
     return new Face(p1, p2, p3, p4);
   }
  
   //constructs side face
   Face createSideFace(Face front, boolean isLeft, int faceDepth){
     Point p1,p2,p3,p4;
     float[] slope;
     //equal points
     if (isLeft){
       p1 = front.p2;
       p4 = front.p3;
       slope = slope_intercept(p1.x,p1.y,vanishingPointX,vanishingPointY);
       p2 = new Point(p1.x + faceDepth, int(slope[0] * (p1.x + faceDepth) + slope[1]));
       slope = slope_intercept(p4.x,p4.y,vanishingPointX,vanishingPointY);
       p3 = new Point(p4.x + faceDepth, int(slope[0] * (p4.x + faceDepth) + slope[1]));
     }else{
       p2 = front.p1;
       p3 = front.p4;
       slope = slope_intercept(p2.x,p2.y,vanishingPointX,vanishingPointY);
       p1 = new Point(p2.x - faceDepth, int(slope[0] * (p2.x - faceDepth) + slope[1]));
       slope = slope_intercept(p3.x,p3.y,vanishingPointX,vanishingPointY);
       p4 = new Point(p3.x - faceDepth, int(slope[0] * (p3.x - faceDepth) + slope[1]));
     }
    
     //construct face
     return new Face(p1, p2, p3, p4);
   }
  
   //constructs top face
   Face createTopFace(Face front, Face side, boolean isLeft){
     Point p1,p2,p3,p4;
     float[] slope;
    
     p1 = front.p4;
     p2 = front.p3;
     
     if (hasSide){
       if (isLeft){
         p3 = side.p3;
         slope = slope_intercept(p1.x,p1.y,vanishingPointX,vanishingPointY);
         p4 = new Point(int((p3.y - slope[1])/slope[0]), p3.y);
       }else{
         p4 = side.p4;
         slope = slope_intercept(p2.x,p2.y,vanishingPointX,vanishingPointY);
         p3 = new Point(int((p4.y - slope[1])/slope[0]), p4.y);
       }
     }else{
       slope = slope_intercept(p1.x,p1.y,vanishingPointX,vanishingPointY);
       float num = (p1.y - 30 - slope[1])/slope[0];
       p4 = new Point(int(num), p1.y - 30);
       slope = slope_intercept(p2.x,p2.y,vanishingPointX,vanishingPointY);
       num = (p2.y - 30 - slope[1])/slope[0];
       p3 = new Point(int(num), p2.y - 30);
       println("here");
     }
    
      //construct face
     return new Face(p1, p2, p3, p4);
   }
}

class Face{
  Point p1, p2, p3, p4;
  Face(Point p1, Point p2, Point p3, Point p4){
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = p4;
  }
}

class Point{
  int x, y;
  Point(int x, int y){
    this.x = x;
    this.y = y;
  }
}