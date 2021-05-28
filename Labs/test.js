"use strict";
var canvas;
var gl;
var sizeof_float = 4;  // our float's are 32-bit
var sizeof_color = 4;
var sizeof_vertex = sizeof_float * 2; // only 2d vertices in this example
var maxVertices = 3;
var userPoints = [];
var perpPoints = [];
var subPoints = [];
var first = true;
var second = false;
var third = false;
var center = [];
var index = 0;
var reached_max = false;
var mouse_down = false;// state variable for mouse drag part

var toClip = function(event) {
    var clip = vec2(2*event.clientX/canvas.width-1,
           2*(canvas.height-event.clientY)/canvas.height-1);
           //It has the pixel location of the mouse relative to the top left hand
           //corner of the screen. The vec2 is an x,y coordinate of the mouse location.
           //2*event.clientX/canvas.Width gives you a number between 0 and 2, then
           //subtracts 2 to put the point within the (-1, 1) range.
    console.log(event.clientX + ", " + event.clientY + " -> " + JSON.stringify(clip));
    return clip;
}

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
   
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create the vertex buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, sizeof_vertex * maxVertices, gl.STATIC_DRAW );
   
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    //render();

    canvas.addEventListener("mousedown", function(event){
        //gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
        //if(first){
            //first = false;
            //second = true;
            var t1 = toClip(event);
            var t2 = toClip(event);
            var t3 = toClip(event);
            //add_point(t);
            userPoints.push(t1);
            add_point(t1);
            userPoints.push(t2);
            add_point(t2);
            userPoints.push(t3);
            add_point(t3);

            var vert = vec2((t1[1]*-1),t1[0]);
            perpPoints.push(vert);
            var vert = vec2((t2[1]*-1),t2[0]);
            perpPoints.push(vert);
            var vert = vec2((t3[1]*-1),t3[0]);
            perpPoints.push(vert);

        
        //ToClip returns a Vec2
       // add_point(t);
        //mouse_down = true;
        //userPoints.push(t);
        //var vert = vec2((t[1]*-1),t[0]);
       // perpPoints.push(vert);
       // console.log(userPoints.pop(t));
    } );






    //userPoints.push(t);










   
   
   
   
    var add_point = function(t)
    {
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof_vertex*index, flatten(t));
        //Sizeof_vertex is "what element do I start adding this data to"
        index++; //Increment the index until the array is filled.
        if ( index >= maxVertices )
        {
            index = 0; // cycle back - otherwise we'll blow out the array buffer we created on the GPU!
            //From this point onwards, you'll be overwriting the point currently in the buffer.
            reached_max = true;  // we'll draw the max number of points from now on, since the buffer filled.
        }
    }

    var calculate = function()
    {
        //Calculate the center and the radius
       
    }
    
    canvas.addEventListener("mousedown", function(event){
        var t = toClip(event);
        //ToClip returns a Vec2
        add_point(t);
        mouse_down = true;
        userPoints.push(t);
        var vert = vec2((t[1]*-1),t[0]);
        perpPoints.push(vert);
        console.log(userPoints.pop(t));
    } );
    canvas.addEventListener("mouseup", function(event){
      mouse_down = false;
    });

    if (userPoints.Lenth == 3)
    {
        FindSub();
        FindCenter();
    }


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create the vertex buffer

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINE_LOOP, 0, reached_max? maxVertices : index );
    //If you made color a uniform, here, it would either all be the same color,
    //or, you can't draw it all at once. You'd have to draw each point individually
    //rather than all at once the way drawArrays works.
    window.requestAnimFrame(render);
}

function FindSub() {
    var vert0 = math.subtract(userPoints[1], userPoints[0]);
    var vert1 = math.subtract(userPoints[2], userPoints[1]);
    var vert2 = math.subtract(userPoints[0], userPoints[2]);
    subPoints.push(vert0);
    subPoints.push(vert1);
    subPoints.push(vert2);
    math.subtract(x, y)
}

function FindCenter(){

    center = math.add(userPoint[0], math.divide(math.divide(math.add(subPoints[0], math.dot(subPoints[1],subPoints[2])), math.multiply(math.dot(perpPoints[0], subPoints[2]), perpPoints[0])),2));

}