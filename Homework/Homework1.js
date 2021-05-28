"use strict";

var canvas;
var gl;

var theta = 0.0;

var thetaLoc;
var offsetLocX;
var offsetLocY;
var scaleLocW;

var newOffsetX = 0;
var newOffsetY = 0;
var newScaleW = 1.0;
var thetaInc = 0;

var vPosition;
var squareBuffer, triangleBuffer;

var triangle = [];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

   
    //  Basic shit for every program
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	// Set triangle
    triangle.push(vec2(  1.0000,  0.0000 ));
    triangle.push(vec2(  0.0000,  0.3090 ));
    triangle.push(vec2(  0.0000, -0.3090 ));
	triangle.push(vec2(  0.3090,  0.9511 ));
    triangle.push(vec2( -0.3090,  0.0000 ));
    triangle.push(vec2(  0.3090, -0.3090 ));
	triangle.push(vec2(  -0.8090, 0.5878 ));
    triangle.push(vec2(  0.0000,  -0.3090 ));
    triangle.push(vec2(  1.0000, 0.0000 ));
	triangle.push(vec2(  -0.8090, -0.5878 ));
    triangle.push(vec2(  0.3090,  0.0000 ));
    triangle.push(vec2(  0.3090,  0.9511 ));
	triangle.push(vec2(  0.3090, -0.9511 ));
    triangle.push(vec2(  0.3090, -0.3090 ));
	triangle.push(vec2(  -0.8090,  0.5878 ));
    
    // Load the triangle
    triangleBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, triangleBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(triangle), gl.STATIC_DRAW );

    
    vPosition = gl.getAttribLocation( program, "vPosition" );
       
    thetaLoc = gl.getUniformLocation( program, "theta" );
    offsetLocX = gl.getUniformLocation( program, "offsetX" );
	offsetLocY = gl.getUniformLocation( program, "offsetY" );
	scaleLocW = gl.getUniformLocation( program, "scaleW" );
	
    render();
};

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    theta += thetaInc;
    
    gl.bindBuffer( gl.ARRAY_BUFFER, triangleBuffer );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.uniform1f( thetaLoc, theta );
    gl.uniform1f( offsetLocX, newOffsetX );
	gl.uniform1f( offsetLocY, newOffsetY );
	gl.uniform1f( scaleLocW, newScaleW );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, triangle.length );

    window.requestAnimFrame(render);
}

//Event listener
window.addEventListener("keypress", function() {
	switch (event.keyCode) {
		case 119: // ’w’ key
		newOffsetY += 0.1;
		break;
	
		case 97: // ’a’ key
		newOffsetX -= 0.1;
		break;

		case 115: // ’s’ key
		newOffsetY -= 0.1;
		break;

		case 100: // ’d’ key
		newOffsetX += 0.1;
		break;
		
		case 122: // ’z’ key
		newScaleW = newScaleW + (newScaleW * 0.75);
		break;
		
		case 90: // ’Z’ key
		newScaleW = newScaleW - (newScaleW * 0.75);
		break;
		
		case 114: // ’r’ key
		thetaInc = thetaInc + 0.1;
        break;
        
        case 82: // ’R’ key
		thetaInc = thetaInc - 0.1;
		break;
        
        case 32: // space key
		thetaInc = 0.0;
        break;
    }
});