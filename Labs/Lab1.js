"use strict";

var canvas;
var gl;
var points = [];
var colors = [];
var NumOfPoints = 100;




window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    generateCircle();
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );



    // Load the data into the GPU
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

   
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );


    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function generateCircle()
{
    var theta = 0;
    var increment = 2*Math.PI / NumOfPoints;
    var x, y, r, b, g;
    var vert = vec2(0,0)
    var vertColors = vec3(1.0, 1.0, 1.0);

    colors.push(vertColors);
    points.push(vert);
    for(var i = 0; i <= NumOfPoints; i++){
        x=Math.cos(theta);
        y=Math.sin(theta);
        r=(Math.sin(theta)+1)/2;
        b=(Math.sin(2*(Math.PI)-theta)+1)/2;
        g=(Math.cos(theta)+1)/2;
        vertColors = vec3(r, b, g)
        vert = vec2( x, y )
        colors.push(vertColors);
        console.log(colors);
        points.push(vert);
        theta+=increment;
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, (points.length) );
}
