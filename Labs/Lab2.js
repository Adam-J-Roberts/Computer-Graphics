//Joint effort by Adam Roberts and Hunter Cool

"use strict";

var canvas;
var gl;
var vPosition;

var triangleBuffer, circleBuffer, pointBuffer;

var clickedPoints = [];
var triangle = [];
var circle = [];

var resetDraw = false;
var circleNumPoints = 100;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
	
	var add_point = function(t) 
	{
		
		// Reset the drawing when needed
		if (resetDraw) {
			triangle = [];
			clickedPoints = [];
			circle = [];
			clickedPoints.push(t);
			resetDraw = false;
		}
		else{
			// Push user points onto  array
			clickedPoints.push(t);
		}
		
		// Push user points onto triangle array
		triangle.push(t);
		
		if(clickedPoints.length >= 3){
			// Load the triangle vertex data into the GPU
			triangleBuffer = gl.createBuffer();
			gl.bindBuffer( gl.ARRAY_BUFFER, triangleBuffer );
			gl.bufferData( gl.ARRAY_BUFFER, flatten(triangle), gl.STATIC_DRAW );
			
			clickedPoints = [];
				
			// Calculate 3 Point Circle
			calculateCircle();
			
			// Reset flag
			resetDraw = true;
		}
		
		// Load the points into the GPU
		pointBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, pointBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, flatten(clickedPoints), gl.STATIC_DRAW );
    }
	
	// When user click on canvas
	canvas.addEventListener("mousedown", function(event){
		var t = vec2(2*event.clientX/canvas.width-1, 2*(canvas.height-event.clientY)/canvas.height-1);
		add_point(t);
	});


    //  Basic stuff for every program
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	 
    vPosition = gl.getAttribLocation( program, "vPosition" );
   
    render();
};

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    
	if (triangle.length == 3) {
		gl.bindBuffer( gl.ARRAY_BUFFER, triangleBuffer );
     	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
     	gl.enableVertexAttribArray( vPosition );
		gl.drawArrays( gl.LINE_LOOP, 0, triangle.length );
	}
	if (circle.length > 0) {
		gl.bindBuffer( gl.ARRAY_BUFFER, circleBuffer );
    	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
     	gl.enableVertexAttribArray( vPosition );
		gl.drawArrays( gl.LINE_LOOP, 0, circle.length );
	}
	if (clickedPoints.length > 0) {
		gl.bindBuffer( gl.ARRAY_BUFFER, pointBuffer );
     	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
     	gl.enableVertexAttribArray( vPosition );
		gl.drawArrays( gl.POINTS, 0, clickedPoints.length );	
	}
	
    window.requestAnimFrame(render);
}

// Calculate circle
function calculateCircle()
{
	// User defined points
	var userPointAx = triangle[0][0];
	var userPointAy = triangle[0][1];
	
	var userPointBx = triangle[1][0];
	var userPointBy = triangle[1][1];
	
	var userPointCx = triangle[2][0];
	var userPointCy = triangle[2][1];
	
	// Vectors
	var vector_a = vec2(userPointBx - userPointAx, userPointBy - userPointAy);
	var vector_b = vec2(userPointCx - userPointBx, userPointCy - userPointBy);
	var vector_c = vec2(userPointAx - userPointCx, userPointAy - userPointCy);
	
	// Perpendicular sub points
	var subPoint_a = vec2(vector_a[1] * -1, vector_a[0]);  
	var subPoint_b = vec2(vector_b[1] * -1, vector_b[0]);
	var subPoint_c = vec2(vector_c[1] * -1, vector_c[0]);
	
	// Dot product
	var dot_b_c = (vector_b[0] * vector_c[0]) + (vector_b[1] * vector_c[1]);
	var Dot_SubPoint_a_c = (subPoint_a[0] * vector_c[0]) + (subPoint_a[1] * vector_c[1]); 
	
	// Find Center
	var temp = vector_a[0] + dot_b_c / Dot_SubPoint_a_c * subPoint_a[0];
	var point_Sx = userPointAx + (temp/2);
	temp = vector_a[1] + dot_b_c / Dot_SubPoint_a_c * subPoint_a[1];
	var point_Sy = userPointAy + (temp/2);
	var point_S = vec2(point_Sx, point_Sy);
	clickedPoints.push(point_S);
	pointBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, pointBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(clickedPoints), gl.STATIC_DRAW );
	
	// Find radius
	temp = Math.pow(point_Sx - userPointAx, 2) + Math.pow(point_Sy - userPointAy,2);
	var circleRadius = Math.sqrt(temp);
	
	// Populate circle points
	for ( var i = 0; i <= circleNumPoints*2; ++i ) {
		let circTheta = i * Math.PI / 100;
		var x = point_Sx + circleRadius * Math.cos(circTheta);
		var y = point_Sy + circleRadius * Math.sin(circTheta);
		circle.push(vec2( x, y) );
     }

    circleBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, circleBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(circle), gl.STATIC_DRAW );
}
