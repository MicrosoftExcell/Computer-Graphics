
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Normal;\n' +
  'attribute vec2 a_TexCoords;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform int u_Color;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'varying vec4 v_texColor;\n' +
  'varying vec2 v_TexCoords;\n' +
  'varying vec3 v_Position;\n' +
  'varying vec3 v_Normal;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  vec4 color = vec4(1.0, 0.4, 0.0, 1.0);\n' +
  '  if (u_Color == 0) {\n' +
  '     color = vec4(0.6, 0.2, 0.0, 1.0);\n' +  // red color
  '  } else if (u_Color == 1) {\n' +
  '     color = vec4(1.0, 1.0, 1.0, 1.0);\n' +  // white color
  '  } else if (u_Color == 2) {\n' +
  '     color = vec4(0.5, 0.5, 0.5, 1.0);\n' +  // grey color
  '  } else if (u_Color == 3) {\n' +
  '     color = vec4(0, 0, 0, 1.0);\n' +  // black color
  '  } else if (u_Color == 4) {\n' +
  '     color = vec4(0.6, 0.3, 0, 1.0);\n' +  // brown color
  '  } else if (u_Color == 5) {\n' +
  '     color = vec4(0.5, 0.3, 0.1, 1.0);\n' +  // dark brown color
  '  } else if (u_Color == 6) {\n' +
  '     color = vec4(1, 0.99, 0.75, 1.0);\n' +  // pale yellow color
  '  } else if (u_Color == 7) {\n' +
  '     color = vec4(0.3, 0.8, 0.1, 1.0);\n' +  // green color
  '  } else if (u_Color == 8) {\n' +
  '     color = vec4(0.0, 0.4, 0.05, 1.0);\n' +  // dark green color
  '  } else if (u_Color == 9) {\n' +
  '     color = vec4(1.0, 0.0, 0.00, 1.0);\n' +  // bright red color
  '  } else if (u_Color == 10) {\n' +
  '     color = vec4(0.0, 0.7, 1.0, 1.0);\n' +  // light blue color
  '  }\n' +
  '  v_Normal = normalize((u_NormalMatrix * a_Normal).xyz);\n' +
  '  v_Position = vec3(u_MvpMatrix * a_Position);\n' +
  '  v_TexCoords = a_TexCoords;\n' +
  '  v_Color = color;\n' + 
  '}\n';


// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'uniform int u_UseTextures;\n' +    // Texture enable/disable flag
  'uniform sampler2D u_Sampler;\n' +
  'uniform sampler2D u_Sampler2;\n' +
  'uniform sampler2D u_Sampler3;\n' +
  'uniform sampler2D u_Sampler4;\n' +
  'uniform vec3 u_LightPosition;\n' +  // Position of the light source
  'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
  'varying vec2 v_TexCoords;\n' +
  'varying vec3 v_Normal;\n' +
  'varying vec3 v_Position;\n' +
  'void main() {\n' +
  '  vec3 normal = normalize(v_Normal);\n' +
  '  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
  '  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
  '  vec3 diffuse;\n' +
  '  if (u_UseTextures == 1) {\n' +
  '     vec4 TexColor = texture2D(u_Sampler2, v_TexCoords);\n' +
  '     diffuse = TexColor.rgb * nDotL * 1.2;\n' +
  '  } else if (u_UseTextures == 2) {\n' +
  '     vec4 TexColor = texture2D(u_Sampler, v_TexCoords);\n' +
  '     diffuse = TexColor.rgb * nDotL * 1.2;\n' +
  '  } else if (u_UseTextures == 3) {\n' +
  '     vec4 TexColor = texture2D(u_Sampler3, v_TexCoords);\n' +
  '     diffuse = TexColor.rgb * nDotL * 1.2;\n' +
  '  } else if (u_UseTextures == 4) {\n' +
  '     vec4 TexColor = texture2D(u_Sampler4, v_TexCoords);\n' +
  '     diffuse = TexColor.rgb * nDotL * 1.2;\n' +
  '  } else {\n' +
  '     diffuse = v_Color.rgb * nDotL;\n' +
  '  }\n' +
  '  vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +
  '  gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n' +
  '}\n';

var rotation = 0;
var z_movement = 0;
var y_movement = 0;
var x1_movement = 0;
var x2_movement = 0;
var z_operation = 1;
var y_operation = 1;
var x1_operation = 1;
var x2_operation = 1;
var x_light = 6;
var y_light = 15;
var z_light = 50;
var look_x = 0;
var look_y = 5;
var look_z = 20;
var zoom = 50;

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');
  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas,false);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  var u_Color = gl.getUniformLocation(gl.program, 'u_Color');
  if (!u_Color) { 
    console.log('Failed to get the storage location for texture map enable flag');
    return;
  }

  // Set the vertex information
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 0.2);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
  if (!u_MvpMatrix || !u_NormalMatrix || !u_AmbientLight || !u_LightPosition) {
    console.log('Failed to get the storage location');
    return;
  }

  var u_UseTextures = gl.getUniformLocation(gl.program, "u_UseTextures");
  if (!u_UseTextures) { 
    console.log('Failed to get the storage location for texture map enable flag');
    return;
  }

 gl.uniform3f(u_LightPosition, x_light, y_light, z_light);
 // Set the ambient light
 gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

  // Calculate the view projection matrix
  var viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(zoom, canvas.width/canvas.height, 1, 100);
    viewProjMatrix.lookAt(look_x, look_y, look_z, 0, 0, 0, 0, 1, 0);

  var Cubetexture = gl.createTexture();   // Create a texture object
  if (!Cubetexture) {
    console.log('Failed to create the texture object');
    return false;
  }
    // Get the storage location of u_Sampler
  var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_Sampler) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }

  Cubetexture.image = new Image();  // Create the image object
  if (!Cubetexture.image) {
    console.log('Failed to create the image object');
    return false;
  }

  // Tell the browser to load an image
  // Register the event handler to be called on loading an image
  Cubetexture.image.onload = function(){ loadTexAndDraw(gl, n, Cubetexture, u_Sampler, u_UseTextures); };
  Cubetexture.image.src = '../resources/bricks.jpg';

  var Nexttexture = gl.createTexture();   // Create a texture object
  if (!Nexttexture) {
    console.log('Failed to create the texture object');
    return false;
  }
    // Get the storage location of u_Sampler
  var u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  Nexttexture.image = new Image();  // Create the image object
  if (!Nexttexture.image) {
    console.log('Failed to create the image object');
    return false;
  }


  // Tell the browser to load an image
  // Register the event handler to be called on loading an image
  Nexttexture.image.onload = function(){ loadTexAndDraw2(gl,n, Nexttexture, u_Sampler2, u_UseTextures); };  
  Nexttexture.image.src = '../resources/grass.jpg';

  var Thirdtexture = gl.createTexture();   // Create a texture object
  if (!Thirdtexture) {
    console.log('Failed to create the texture object');
    return false;
  }
    // Get the storage location of u_Sampler
  var u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return false;
  }

  Thirdtexture.image = new Image();  // Create the image object
  if (!Thirdtexture.image) {
    console.log('Failed to create the image object');
    return false;
  }

  // Tell the browser to load an image
  // Register the event handler to be called on loading an image
  Thirdtexture.image.onload = function(){ loadTexAndDraw3(gl, n, Thirdtexture, u_Sampler3, u_UseTextures); };
  Thirdtexture.image.src = '../resources/roof.jpg';

  var Fourthtexture = gl.createTexture();   // Create a texture object
  if (!Fourthtexture) {
    console.log('Failed to create the texture object');
    return false;
  }
    // Get the storage location of u_Sampler
  var u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to get the storage location of u_Sampler4');
    return false;
  }

  Fourthtexture.image = new Image();  // Create the image object
  if (!Fourthtexture.image) {
    console.log('Failed to create the image object');
    return false;
  }

  // Tell the browser to load an image
  // Register the event handler to be called on loading an image
  Fourthtexture.image.onload = function(){ loadTexAndDraw4(gl, n, Fourthtexture, u_Sampler4, u_UseTextures); };
  Fourthtexture.image.src = '../resources/green.jpg';


  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    // Register the event handler to be called when keys are pressed
    document.onkeydown = function(ev){ keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,u_Color,deltaTime, u_UseTextures,u_LightPosition); };
    then = now;

    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_Color,deltaTime, u_UseTextures);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

var ANGLE_STEP = 3.0;    // The increments of rotation angle (degrees)
var g_xAngle = 0.0;    // The rotation x angle (degrees)
var g_yAngle = 0.0;    // The rotation y angle (degrees)

function keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_Color,deltaTime, u_UseTextures,u_LightPosition) {
  switch (ev.keyCode) {
    case 40: // Up arrow key -> the positive rotation of arm1 around the y-axis
      g_xAngle = (g_xAngle + ANGLE_STEP) % 360;
      break;
    case 38: // Down arrow key -> the negative rotation of arm1 around the y-axis
      g_xAngle = (g_xAngle - ANGLE_STEP) % 360;
      break;
    case 39: // Right arrow key -> the positive rotation of arm1 around the y-axis
      g_yAngle = (g_yAngle + ANGLE_STEP) % 360;
      break;
    case 37: 
      g_yAngle = (g_yAngle - ANGLE_STEP) % 360;
      break;
    case 65: 
      x_light = x_light -3;
      gl.uniform3f(u_LightPosition, x_light, y_light, z_light);
      break;
    case 68: 
      x_light = x_light +3;
      gl.uniform3f(u_LightPosition, x_light, y_light, z_light);
      break;
    case 87: 
      y_light = y_light+3;
      gl.uniform3f(u_LightPosition, x_light, y_light, z_light);
      break;
    case 83: 
      y_light = y_light-3;
      gl.uniform3f(u_LightPosition, x_light, y_light, z_light);
      break;
    case 49: 
      viewProjMatrix.translate(1, 0, 0);
      break;
    case 50: 
      viewProjMatrix.translate(-1, 0, 0);
      break;
    case 51: 
      viewProjMatrix.translate(0, 1, 0);
      break;
    case 52: 
      viewProjMatrix.translate(0, -1, 0);
      break;
    case 81: 
      viewProjMatrix.translate(0, 0, 1);
      break;
    case 69: 
      viewProjMatrix.translate(0, 0, -1);
      break;
    case 70: 
      viewProjMatrix.rotate(3,0, 1, 0);
      break;
    case 72: 
      viewProjMatrix.rotate(-3,0, 1, 0);
      break;
    case 84: 
      viewProjMatrix.rotate(3,1,0, 0);
      break;
    case 71: 
      viewProjMatrix.rotate(-3,1,0, 0);
      break;
    case 53: 
      viewProjMatrix.rotate(3,0,0, 1);
      break;
    case 54: 
      viewProjMatrix.rotate(-3,0,0, 1);
      break;
    
    default: return; // Skip drawing at no effective action
  }
  draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,u_Color,deltaTime, u_UseTextures);
}

function initVertexBuffers(gl) {
  // Vertex coordinates（a cube)
  var vertices = new Float32Array([
    1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
   -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
   -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
    1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0,  // v4-v7-v6-v5 back
  ]);
  

  // Normal
  var normals = new Float32Array([
    0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
   -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
  ]);

  // Texture Coordinates
  var texCoords = new Float32Array([
    1.0, 1.0,    0.0, 1.0,   0.0, 0.0,   1.0, 0.0,  // v0-v1-v2-v3 front
    0.0, 1.0,    0.0, 0.0,   1.0, 0.0,   1.0, 1.0,  // v0-v3-v4-v5 right
    1.0, 0.0,    1.0, 1.0,   0.0, 1.0,   0.0, 0.0,  // v0-v5-v6-v1 up
    1.0, 1.0,    0.0, 1.0,   0.0, 0.0,   1.0, 0.0,  // v1-v6-v7-v2 left
    0.0, 0.0,    1.0, 0.0,   1.0, 1.0,   0.0, 1.0,  // v7-v4-v3-v2 down
    0.0, 0.0,    1.0, 0.0,   1.0, 1.0,   0.0, 1.0   // v4-v7-v6-v5 back
  ]);

  // Indices of the vertices
  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  // Write the vertex property to buffers (coordinates and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices, gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals, gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_TexCoords', texCoords,gl.FLOAT, 2)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, attribute, data, type, num) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

function loadTexAndDraw(gl, n, texture, u_Sampler, u_UseTextures) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);

  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Assign u_Sampler to TEXTURE0
  gl.uniform1i(u_Sampler, 0);

}
function loadTexAndDraw2(gl, n, texture, u_Sampler2, u_UseTextures) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE1);

  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Assign u_Sampler to TEXTURE0
  gl.uniform1i(u_Sampler2, 1);
 
}
function loadTexAndDraw3(gl, n, texture, u_Sampler3, u_UseTextures) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE2);

  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Assign u_Sampler to TEXTURE0
  gl.uniform1i(u_Sampler3, 2);

}
function loadTexAndDraw4(gl, n, texture, u_Sampler4, u_UseTextures) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE3);

  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Assign u_Sampler to TEXTURE0
  gl.uniform1i(u_Sampler4, 3);

}

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4(), g_mvpMatrix = new Matrix4();

function draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_Color,deltaTime, u_UseTextures) {
  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniform1i(u_Color,0);
  gl.uniform1i(u_UseTextures, 2);
  g_modelMatrix.setTranslate(0.0, 0.0, 0.0);
  g_modelMatrix.rotate(g_yAngle, 0.0, 1.0, 0.0); // Rotate along y axis
  g_modelMatrix.rotate(g_xAngle, 1.0, 0.0, 0.0); // Rotate along x axis
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(2.5, -0.2, -.5); 　　
  g_modelMatrix.scale(1.5, 0.8, 0.5); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-3.25, 0, 0); 　　
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-1, 0.25, 0.5); 　　
  g_modelMatrix.scale(.33, 1.25, 3); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(15.5, 0, 0); 　　
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-6.15, 0.1, 0.8); 　　
  g_modelMatrix.scale(.5, 1.1, 0.05); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-6.15, 0, 0); 　　
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(19.65, -0.1, 3.2); 
  g_modelMatrix.scale(.75, 0.9,1); 　　
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-3.25, 0, 0); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-38, 0, 0); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-3.25, 0, 0); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  gl.uniform1i(u_UseTextures, 0);
  gl.uniform1i(u_Color,1);
  
  g_modelMatrix.translate(22.5, 0.25, -2.3); 
  g_modelMatrix.scale(.75, 0.5,0.5); 

  g_modelMatrix.translate(-0.1, 1.5, -27); 
  g_modelMatrix.scale(7.5, 0.05,28); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-2.25, -15, -0.47); 
  g_modelMatrix.scale(1.3, 1,0.52); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(3.45, 0, 0);  
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(1.08, 0, 0.42);  
  g_modelMatrix.scale(0.4, 1,2.85); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-14.15, 0, 0);  
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(7.18, -45, 0.9);  
  g_modelMatrix.scale(0.3, 1.2,0.05); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(0, 55, -3);  
  g_modelMatrix.scale(1.5,4,0.5); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-0.5, -15.7, 7);  
  g_modelMatrix.scale(0.05,2.2,0.5); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(4, 0, 0);  
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(12, 0, 0);  
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(4, 0, 0);  
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,0);
  gl.uniform1i(u_UseTextures, 2);
  g_modelMatrix.translate(-75, 1, -5);  
  g_modelMatrix.scale(10,2,5); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(12.5, 0, 0);  
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(0.75, 0, -0.3); 
  g_modelMatrix.scale(0.5,1,1);
  g_modelMatrix.rotate(60, 0.0, 1.0, 0.0); // Rotate along y axis 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.rotate(-60, 0.0, 1.0, 0.0); // Rotate along y axis 
  g_modelMatrix.translate(-25, 0, 0);  
  g_modelMatrix.rotate(60, 0.0, 1.0, 0.0); // Rotate along y axis 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.rotate(-60, 0.0, 1.0, 0.0); // Rotate along y axis 
  g_modelMatrix.translate(-3, 0, 0);  
  g_modelMatrix.rotate(-60, 0.0, 1.0, 0.0); // Rotate along y axis 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.rotate(60, 0.0, 1.0, 0.0); // Rotate along y axis 
  g_modelMatrix.translate(25, 0, 0);  
  g_modelMatrix.rotate(-60, 0.0, 1.0, 0.0); // Rotate along y axis 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  gl.uniform1i(u_UseTextures, 0);
  gl.uniform1i(u_Color,2);
  gl.uniform1i(u_UseTextures, 3);
  g_modelMatrix.rotate(60, 0.0, 1.0, 0.0); // Rotate along y axis
  g_modelMatrix.translate(-11, 3, -11.6);  
  g_modelMatrix.scale(16.5,0.3,9.8); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-2, -2, -0.4);  
  g_modelMatrix.scale(1.4,1.2,0.5); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(3, 0, 0);  
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(0.1, 1, 0);  
  g_modelMatrix.scale(1,1,0.7);
  g_modelMatrix.rotate(45, 1.0, 0.0, 0.0); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.rotate(-45, 1.0, 0.0, 0.0); 
  g_modelMatrix.translate(-3.1, 0, 0); 
  g_modelMatrix.scale(1.25,1,1);
  g_modelMatrix.rotate(45, 1.0, 0.0, 0.0); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.rotate(-45, 1.0, 0.0, 0.0); 
  g_modelMatrix.translate(-1.04, 0.2, 0.62); 
  g_modelMatrix.scale(0.2,1,4.48);
  g_modelMatrix.rotate(45, 0.0, 0.0, 1.0);   
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.rotate(-45, 0.0, 0.0, 1.0); 
  g_modelMatrix.translate(21.7, 0, 0); 
  g_modelMatrix.rotate(45, 0.0, 0.0, 1.0);  
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.rotate(-45, 0.0, 0.0, 1.0);
  g_modelMatrix.translate(-10.8, 1.3, 0.12); 
  g_modelMatrix.scale(2.8,1,0.45);
  g_modelMatrix.rotate(45, 1.0, 0.0, 0.0); // Rotate along x axis  
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  gl.uniform1i(u_UseTextures, 0);
  gl.uniform1i(u_Color,1);

  g_modelMatrix.rotate(-45, 1.0, 0.0, 0.0); // Rotate along x axis
  g_modelMatrix.translate(-3.3, -5, 0.2);
  g_modelMatrix.scale(0.1,0.8,0.01);
  g_modelMatrix.translate(0, 0, -7); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var i=0;i<2;i++){
    g_modelMatrix.translate( 3, 0, 0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var i=0;i<3;i++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    }
  }

  for (var i=0;i<7;i++){
    gl.uniform1i(u_Color,1);

    g_modelMatrix.translate(12.5, 3, -0.01);
    g_modelMatrix.scale(5,5,1);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    gl.uniform1i(u_Color,3);

    g_modelMatrix.translate(-0.6, 0.6, 0.01);
    g_modelMatrix.scale(0.2,0.2,1);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    for (var k=0;k<2;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    }
    for (var j=0; j<2;j++){
      g_modelMatrix.translate( -9, -3, 0);
      for (var k=0;k<3;k++){
        g_modelMatrix.translate( 3, 0, 0);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
    }
  }

  for (var l=0;l<2;l++){
    g_modelMatrix.translate(-124, -17, 0);

    for (var i=0;i<8;i++){
      gl.uniform1i(u_Color,1);
      if (l==0 && (i==3 || i==4)){
        if (y_movement>5){
          y_movement = 5;
          y_operation = 0;
        } else if (y_movement<0){
          y_movement = 0;
          y_operation = 1;
        }
        if (y_operation == 0){
          y_movement = y_movement - (deltaTime*3);
        } else if (y_operation == 1){
          y_movement = y_movement + (deltaTime*3);
        }
        g_modelMatrix.translate(0,y_movement,0);
      }
      g_modelMatrix.translate(12.5, 3, -0.01);
      g_modelMatrix.scale(5,5,1);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

      gl.uniform1i(u_Color,3);

      g_modelMatrix.translate(-0.6, 0.6, 0.01);
      g_modelMatrix.scale(0.2,0.2,1);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

      for (var k=0;k<2;k++){
        g_modelMatrix.translate( 3, 0, 0);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
      for (var j=0; j<2;j++){
        g_modelMatrix.translate( -9, -3, 0);
        for (var k=0;k<3;k++){
          g_modelMatrix.translate( 3, 0, 0);
          drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
        }
      }
      if (l==0 && (i==3 || i==4)){
        g_modelMatrix.translate(0,-y_movement,0);
      }
    }
  }

  g_modelMatrix.translate(-124, 50, 0);
  for (var i=0;i<8;i++){
    gl.uniform1i(u_Color,1);

    g_modelMatrix.translate(12.5, 3, -0.01);
    g_modelMatrix.scale(5,5,1);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    gl.uniform1i(u_Color,3);

    g_modelMatrix.translate(-0.6, 0.6, 0.01);
    g_modelMatrix.scale(0.2,0.2,1);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    for (var k=0;k<2;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    }
    for (var j=0; j<2;j++){
      g_modelMatrix.translate( -9, -3, 0);
      for (var k=0;k<3;k++){
        g_modelMatrix.translate( 3, 0, 0);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
    }
  }

  g_modelMatrix.translate(221, 17, 0);

  for (var l=0;l<4;l++){
    g_modelMatrix.translate(-124, -17, 0);
    for (var i=0;i<8;i++){
      if (l==1 && (i==2 || i==5)){
        g_modelMatrix.translate(0,y_movement,0);
      }
      gl.uniform1i(u_Color,1);

      g_modelMatrix.translate(12.5, 3, -0.01);
      g_modelMatrix.scale(5,5,1);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

      gl.uniform1i(u_Color,3);

      g_modelMatrix.translate(-0.6, 0.6, 0.01);
      g_modelMatrix.scale(0.2,0.2,1);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

      for (var k=0;k<2;k++){
        g_modelMatrix.translate( 3, 0, 0);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
      for (var j=0; j<2;j++){
        g_modelMatrix.translate( -9, -3, 0);
        for (var k=0;k<3;k++){
          g_modelMatrix.translate( 3, 0, 0);
          drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
        }
      }
      if (l==1 && (i==2 || i==5)){
        g_modelMatrix.translate(0,-y_movement,0);
      }
    }
  }
  g_modelMatrix.translate(-116, 65, 0);
  g_modelMatrix.translate(0, 0, 7);
  g_modelMatrix.rotate(90,0.0,1.0,0.0);

  gl.uniform1i(u_Color,1);

  g_modelMatrix.translate(12.5, 3, -0.01);
  g_modelMatrix.scale(15,5,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    }
  }
  
  g_modelMatrix.rotate(-90,0.0,1.0,0.0)
  g_modelMatrix.translate(0, 3, 20);
  g_modelMatrix.rotate(90,0.0,1.0,0.0);
  
  gl.uniform1i(u_Color,1);

  g_modelMatrix.scale(5,5,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    }
  }

  for (var i=0;i<4;i++){

    g_modelMatrix.translate(-3, -13, 0);
    gl.uniform1i(u_Color,1);

    g_modelMatrix.scale(5,5,1);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    gl.uniform1i(u_Color,3);

    g_modelMatrix.translate(-0.6, 0.6, 0.01);
    g_modelMatrix.scale(0.2,0.2,1);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    for (var k=0;k<2;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    }
    for (var j=0; j<2;j++){
      g_modelMatrix.translate( -9, -3, 0);
      for (var k=0;k<3;k++){
        g_modelMatrix.translate( 3, 0, 0);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
    }
  }

  g_modelMatrix.rotate(90,0.0,1.0,0.0);
  g_modelMatrix.translate(101.5, 64, 30);
  g_modelMatrix.rotate(90,0.0,1.0,0.0);

  gl.uniform1i(u_Color,1);

  g_modelMatrix.translate(12.5, 3, -0.01);
  g_modelMatrix.scale(5,5,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    }
  }
  
  g_modelMatrix.rotate(-90,0.0,1.0,0.0)
  g_modelMatrix.translate(0, 3, -12);
  g_modelMatrix.rotate(90,0.0,1.0,0.0);
  
  gl.uniform1i(u_Color,1);

  g_modelMatrix.scale(5,5,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    }
  }

  for (var i=0;i<4;i++){

    g_modelMatrix.translate(-3, -13, 0);
    gl.uniform1i(u_Color,1);

    g_modelMatrix.scale(5,5,1);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    gl.uniform1i(u_Color,3);

    g_modelMatrix.translate(-0.6, 0.6, 0.01);
    g_modelMatrix.scale(0.2,0.2,1);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    for (var k=0;k<2;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    }
    for (var j=0; j<2;j++){
      g_modelMatrix.translate( -9, -3, 0);
      for (var k=0;k<3;k++){
        g_modelMatrix.translate( 3, 0, 0);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
    }
  }

  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(-219, 67, -2);
  g_modelMatrix.rotate(90,0.0,1.0,0.0);

  for (var i=0;i<4;i++){

    g_modelMatrix.translate(-3, -14, 0);
    gl.uniform1i(u_Color,1);

    g_modelMatrix.scale(5,5,1);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    gl.uniform1i(u_Color,3);

    g_modelMatrix.translate(-0.6, 0.6, 0.01);
    g_modelMatrix.scale(0.2,0.2,1);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    for (var k=0;k<2;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    }
    for (var j=0; j<2;j++){
      g_modelMatrix.translate( -9, -3, 0);
      for (var k=0;k<3;k++){
        g_modelMatrix.translate( 3, 0, 0);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
    }
  }

  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(0, 17, 0);
  g_modelMatrix.rotate(90,0.0,1.0,0.0);

  for (var l=0;l<3;l++){

    g_modelMatrix.rotate(-90,0.0,1.0,0.0);
    g_modelMatrix.translate(0, 51, -14);
    g_modelMatrix.rotate(90,0.0,1.0,0.0);

    for (var i=0;i<3;i++){

      g_modelMatrix.translate(-3, -14, 0);
      gl.uniform1i(u_Color,1);

      g_modelMatrix.scale(5,5,1);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

      gl.uniform1i(u_Color,3);

      g_modelMatrix.translate(-0.6, 0.6, 0.01);
      g_modelMatrix.scale(0.2,0.2,1);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

      for (var k=0;k<2;k++){
        g_modelMatrix.translate( 3, 0, 0);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
      for (var j=0; j<2;j++){
        g_modelMatrix.translate( -9, -3, 0);
        for (var k=0;k<3;k++){
          g_modelMatrix.translate( 3, 0, 0);
          drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
        }
      }
    }
  }

  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(389, 51, 130);
  g_modelMatrix.rotate(90,0.0,1.0,0.0);

  for (var i=0;i<4;i++){

    g_modelMatrix.translate(-3, -14, 0);
    gl.uniform1i(u_Color,1);

    g_modelMatrix.scale(5,5,1);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    gl.uniform1i(u_Color,3);

    g_modelMatrix.translate(-0.6, 0.6, 0.01);
    g_modelMatrix.scale(0.2,0.2,1);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    for (var k=0;k<2;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    }
    for (var j=0; j<2;j++){
      g_modelMatrix.translate( -9, -3, 0);
      for (var k=0;k<3;k++){
        g_modelMatrix.translate( 3, 0, 0);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
    }
  }

  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(0, 68, -18);
  g_modelMatrix.rotate(90,0.0,1.0,0.0);

  for (var l=0;l<7;l++){

    if ((l==2) || (l==3)){
      for (var i=0;i<3;i++){
        g_modelMatrix.translate(-3, -14, 0);
        gl.uniform1i(u_Color,1);
  
        g_modelMatrix.scale(5,5,1);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
        gl.uniform1i(u_Color,3);
  
        g_modelMatrix.translate(-0.6, 0.6, 0.01);
        g_modelMatrix.scale(0.2,0.2,1);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
        for (var k=0;k<2;k++){
          g_modelMatrix.translate( 3, 0, 0);
          drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
        }
        for (var j=0; j<2;j++){
          g_modelMatrix.translate( -9, -3, 0);
          for (var k=0;k<3;k++){
            g_modelMatrix.translate( 3, 0, 0);
            drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
          }
        }
      }
      g_modelMatrix.rotate(-90,0.0,1.0,0.0);
      g_modelMatrix.translate(0, 51, -18);
      g_modelMatrix.rotate(90,0.0,1.0,0.0);
    } else {
      for (var i=0;i<4;i++){

        g_modelMatrix.translate(-3, -14, 0);
        gl.uniform1i(u_Color,1);
  
        g_modelMatrix.scale(5,5,1);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
        gl.uniform1i(u_Color,3);
  
        g_modelMatrix.translate(-0.6, 0.6, 0.01);
        g_modelMatrix.scale(0.2,0.2,1);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
        for (var k=0;k<2;k++){
          g_modelMatrix.translate( 3, 0, 0);
          drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
        }
        for (var j=0; j<2;j++){
          g_modelMatrix.translate( -9, -3, 0);
          for (var k=0;k<3;k++){
            g_modelMatrix.translate( 3, 0, 0);
            drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
          }
        }
      }
      g_modelMatrix.rotate(-90,0.0,1.0,0.0);
      g_modelMatrix.translate(0, 68, -18);
      g_modelMatrix.rotate(90,0.0,1.0,0.0);
    }
  }
  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(0, -65, 97);
  g_modelMatrix.rotate(90,0.0,1.0,0.0);
  gl.uniform1i(u_Color,1);
  
  g_modelMatrix.scale(5,5,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  gl.uniform1i(u_Color,3);
  
  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    }
  }

  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(0, 3, -24);
  g_modelMatrix.rotate(90,0.0,1.0,0.0);
  gl.uniform1i(u_Color,1);
  
  g_modelMatrix.scale(5,5,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  gl.uniform1i(u_Color,3);
  
  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    }
  }

  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(0, 3, 16.5);
  g_modelMatrix.rotate(90,0.0,1.0,0.0);
  g_modelMatrix.scale(5,7,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(-438, 9.6, -12);
  g_modelMatrix.rotate(270,0.0,1.0,0.0);
  g_modelMatrix.scale(0.2,0.15,1);
  for (var i=0;i<4;i++){

    g_modelMatrix.translate(-3, -14, 0);
    gl.uniform1i(u_Color,1);

    g_modelMatrix.scale(5,5,1);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    gl.uniform1i(u_Color,3);

    g_modelMatrix.translate(-0.6, 0.6, 0.01);
    g_modelMatrix.scale(0.2,0.2,1);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    for (var k=0;k<2;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    }
    for (var j=0; j<2;j++){
      g_modelMatrix.translate( -9, -3, 0);
      for (var k=0;k<3;k++){
        g_modelMatrix.translate( 3, 0, 0);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
    }
  }

  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(0, 68, -18);
  g_modelMatrix.rotate(90,0.0,1.0,0.0);

  for (var l=0;l<7;l++){

    if ((l==2) || (l==3)){
      for (var i=0;i<3;i++){
        g_modelMatrix.translate(-3, -14, 0);
        gl.uniform1i(u_Color,1);
  
        g_modelMatrix.scale(5,5,1);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
        gl.uniform1i(u_Color,3);
  
        g_modelMatrix.translate(-0.6, 0.6, 0.01);
        g_modelMatrix.scale(0.2,0.2,1);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
        for (var k=0;k<2;k++){
          g_modelMatrix.translate( 3, 0, 0);
          drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
        }
        for (var j=0; j<2;j++){
          g_modelMatrix.translate( -9, -3, 0);
          for (var k=0;k<3;k++){
            g_modelMatrix.translate( 3, 0, 0);
            drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
          }
        }
      }
      g_modelMatrix.rotate(-90,0.0,1.0,0.0);
      g_modelMatrix.translate(0, 51, -18);
      g_modelMatrix.rotate(90,0.0,1.0,0.0);
    } else {
      for (var i=0;i<4;i++){

        g_modelMatrix.translate(-3, -14, 0);
        gl.uniform1i(u_Color,1);
  
        g_modelMatrix.scale(5,5,1);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
        gl.uniform1i(u_Color,3);
  
        g_modelMatrix.translate(-0.6, 0.6, 0.01);
        g_modelMatrix.scale(0.2,0.2,1);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
        for (var k=0;k<2;k++){
          g_modelMatrix.translate( 3, 0, 0);
          drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
        }
        for (var j=0; j<2;j++){
          g_modelMatrix.translate( -9, -3, 0);
          for (var k=0;k<3;k++){
            g_modelMatrix.translate( 3, 0, 0);
            drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
          }
        }
      }
      g_modelMatrix.rotate(-90,0.0,1.0,0.0);
      g_modelMatrix.translate(0, 68, -18);
      g_modelMatrix.rotate(90,0.0,1.0,0.0);
    }
  }
  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(0, -65, 97);
  g_modelMatrix.rotate(90,0.0,1.0,0.0);
  gl.uniform1i(u_Color,1);
  
  g_modelMatrix.scale(5,5,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  gl.uniform1i(u_Color,3);
  
  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    }
  }

  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(0, 3, -24);
  g_modelMatrix.rotate(90,0.0,1.0,0.0);
  gl.uniform1i(u_Color,1);
  
  g_modelMatrix.scale(5,5,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  gl.uniform1i(u_Color,3);
  
  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    }
  }

  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(0, 3, 16.5);
  g_modelMatrix.rotate(90,0.0,1.0,0.0);
  g_modelMatrix.scale(5,7,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(-388, -0.2, 15.4);
  g_modelMatrix.rotate(90,0.0,1.0,0.0);
  g_modelMatrix.scale(0.2,0.15,1);

  for (var l=0;l<4;l++){
  
    if ((l==0) || (l==1)){
      g_modelMatrix.rotate(-90,0.0,1.0,0.0);
      g_modelMatrix.translate(0, 60, -14);
      g_modelMatrix.rotate(90,0.0,1.0,0.0);
    } else {
      g_modelMatrix.rotate(-90,0.0,1.0,0.0);
      g_modelMatrix.translate(0, 45, -14);
      g_modelMatrix.rotate(90,0.0,1.0,0.0);
    }
    if ((l==0) || (l==3)){
      var len = 4;
    } else {
      var len = 3;
    }

    for (var i=0;i<len;i++){

      g_modelMatrix.translate(-3, -12, 0);
      gl.uniform1i(u_Color,1);

      g_modelMatrix.scale(5,5,1);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

      gl.uniform1i(u_Color,3);

      g_modelMatrix.translate(-0.6, 0.6, 0.01);
      g_modelMatrix.scale(0.2,0.2,1);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

      for (var k=0;k<2;k++){
        g_modelMatrix.translate( 3, 0, 0);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
      for (var j=0; j<2;j++){
        g_modelMatrix.translate( -9, -3, 0);
        for (var k=0;k<3;k++){
          g_modelMatrix.translate( 3, 0, 0);
          drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
        }
      }
    }
  }

  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(-40, 3, 54);
  gl.uniform1i(u_Color,1); 

  g_modelMatrix.scale(5,5,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.translate(27, 3, 0);
  gl.uniform1i(u_Color,1); 

  g_modelMatrix.scale(5,5,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.translate(-17.5, 3, 0);
  gl.uniform1i(u_Color,1); 

  g_modelMatrix.scale(5,5,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  gl.uniform1i(u_Color,1);
  g_modelMatrix.translate(-3, 16, 0);
  g_modelMatrix.scale(5,7,1);

  for (var i=0;i<3;i++){
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    g_modelMatrix.translate(0, 2.3, 0);
  }

  gl.uniform1i(u_Color,3);
  g_modelMatrix.translate(0,-3.1, 1);
  g_modelMatrix.scale(1,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(0,-13, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,-10, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.scale(0.3,2.5,1);
  g_modelMatrix.translate(-1.4,2.5, -0.1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(2.8,0, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,4.5,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-2.8,0, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,4.5,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(2.8,0, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw


  gl.uniform1i(u_Color,1); 

  g_modelMatrix.scale(2,0.6,1);
  g_modelMatrix.translate(-5.75,-8, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }
  gl.uniform1i(u_Color,1); 

  g_modelMatrix.scale(5,5,1);
  g_modelMatrix.translate(9.75,0.7, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.translate(592, -72, -1);

  gl.uniform1i(u_Color,1); 

  g_modelMatrix.scale(8,12,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.translate(27, 3, 0);
  gl.uniform1i(u_Color,1); 

  g_modelMatrix.scale(5,5,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.translate(-17.5, 3, 0);
  gl.uniform1i(u_Color,1); 

  g_modelMatrix.scale(5,5,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  gl.uniform1i(u_Color,1);
  g_modelMatrix.translate(-3, 16, 0);
  g_modelMatrix.scale(5,7,1);

  for (var i=0;i<3;i++){
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    g_modelMatrix.translate(0, 2.3, 0);
  }

  gl.uniform1i(u_Color,3);
  g_modelMatrix.translate(0,-3.1, 1);
  g_modelMatrix.scale(1,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(0,-13, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,-10, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.scale(0.3,2.5,1);
  g_modelMatrix.translate(-1.4,2.5, -0.1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(2.8,0, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,4.5,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-2.8,0, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,4.5,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(2.8,0, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw


  gl.uniform1i(u_Color,1); 

  g_modelMatrix.scale(2,0.6,1);
  g_modelMatrix.translate(-5.75,-8, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }
  gl.uniform1i(u_Color,1); 

  g_modelMatrix.scale(5,5,1);
  g_modelMatrix.translate(9.75,0.7, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.translate(-70, -80, -58);
  g_modelMatrix.scale(3,2.5,1);
  g_modelMatrix.rotate(270,0.0,1.0,0.0);
  gl.uniform1i(u_Color,1); 

  g_modelMatrix.scale(5,5,1);
  g_modelMatrix.translate(9.75,0.7, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.rotate(90,0.0,1.0,0.0);
  g_modelMatrix.translate(-147, 53, -7);
  g_modelMatrix.scale(2.5,4,1);
  gl.uniform1i(u_Color,1); 

  g_modelMatrix.translate(9.75,0.7, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.scale(5,5,1);
  gl.uniform1i(u_Color,1); 

  g_modelMatrix.translate(1.5,0.6, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.translate(75, 3, 0);
  g_modelMatrix.scale(5,5,1);
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.scale(5,5,1);
  gl.uniform1i(u_Color,1); 

  g_modelMatrix.translate(1.5,0.6, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.translate(-14, -10, 0);
  g_modelMatrix.scale(5,6,1);
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.scale(5,5,1);
  gl.uniform1i(u_Color,1); 

  g_modelMatrix.translate(2,0.6, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.translate(-16, -10, 0);
  g_modelMatrix.scale(5,5,1);
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.scale(5,5,1);
  gl.uniform1i(u_Color,1); 

  g_modelMatrix.translate(2,0.6, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.translate( -91, 26, 0);

  g_modelMatrix.translate(-14, -10, 0);
  g_modelMatrix.scale(5,5,1);
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.scale(5,5,1);
  gl.uniform1i(u_Color,1); 

  g_modelMatrix.translate(2,0.6, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.translate(-16, -10, 0);
  g_modelMatrix.scale(5,5,1);
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.scale(5,5,1);
  gl.uniform1i(u_Color,1); 

  g_modelMatrix.translate(2,0.6, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.translate(-11,-12.5, 8);

  g_modelMatrix.scale(5,5,1);
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }
  g_modelMatrix.translate(-3,-11, 0);

  g_modelMatrix.scale(5,5,1);
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.translate(87,3,0);
  g_modelMatrix.scale(5,5,1);
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }
  g_modelMatrix.translate(-3,17, 0);

  g_modelMatrix.scale(5,5,1);
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.translate(1.5, -11, -3); 
  g_modelMatrix.scale(5,5,1);
  g_modelMatrix.rotate(60, 0.0, 1.0, 0.0); // Rotate along y axis 
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }
  g_modelMatrix.scale(5,5,1);
  g_modelMatrix.rotate(-60, 0.0, 1.0, 0.0); // Rotate along y axis 
  g_modelMatrix.translate(-0.2,3.5, 0);
  g_modelMatrix.rotate(60, 0.0, 1.0, 0.0); // Rotate along y axis 
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.scale(5,5,1)
  g_modelMatrix.rotate(-60, 0.0, 1.0, 0.0); // Rotate along y axis 
  g_modelMatrix.translate(-18,0.5, 0);
  g_modelMatrix.rotate(60, 0.0, 1.0, 0.0); // Rotate along y axis 
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }
  g_modelMatrix.scale(5,5,1)
  g_modelMatrix.rotate(-60, 0.0, 1.0, 0.0); // Rotate along y axis 
  g_modelMatrix.translate(-0.2,-2.2, 0);
  g_modelMatrix.rotate(60, 0.0, 1.0, 0.0); // Rotate along y axis 
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.scale(5,5,1)
  g_modelMatrix.rotate(-60, 0.0, 1.0, 0.0); // Rotate along y axis 
  g_modelMatrix.translate(-3, 0.6, 0);  
  g_modelMatrix.rotate(-60, 0.0, 1.0, 0.0); // Rotate along y axis 
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }
  g_modelMatrix.scale(5,5,1)
  g_modelMatrix.rotate(60, 0.0, 1.0, 0.0); // Rotate along y axis 
  g_modelMatrix.translate(-0.2, 3.4, 0);  
  g_modelMatrix.rotate(-60, 0.0, 1.0, 0.0); // Rotate along y axis 
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.scale(5,5,1)
  g_modelMatrix.rotate(60, 0.0, 1.0, 0.0); // Rotate along y axis 
  g_modelMatrix.translate(17.8, 0.6, 0);  
  g_modelMatrix.rotate(-60, 0.0, 1.0, 0.0); // Rotate along y axis 
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }
  g_modelMatrix.scale(5,5,1)
  g_modelMatrix.rotate(60, 0.0, 1.0, 0.0); // Rotate along y axis 
  g_modelMatrix.translate(-0.2, -2.2, 0);  
  g_modelMatrix.rotate(-60, 0.0, 1.0, 0.0); // Rotate along y axis 
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }
  g_modelMatrix.scale(5,5,1)
  g_modelMatrix.rotate(60, 0.0, 1.0, 0.0); // Rotate along y axis 
  g_modelMatrix.translate(-13, 9, -6.2); 
  gl.uniform1i(u_Color,1); 

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);

  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  for (var i=0;i<4;i++){
    g_modelMatrix.translate(9, 3, 0); 
    g_modelMatrix.scale(5,5,1);
    gl.uniform1i(u_Color,1); 

    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    gl.uniform1i(u_Color,3);

    g_modelMatrix.translate(-0.6, 0.6, 0.01);
    g_modelMatrix.scale(0.2,0.2,1);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    for (var k=0;k<2;k++){
      g_modelMatrix.translate( 3, 0, 0);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    }
    for (var j=0; j<2;j++){
      g_modelMatrix.translate( -9, -3, 0);
      for (var k=0;k<3;k++){
        g_modelMatrix.translate( 3, 0, 0);
        drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
        }
    }
  }
  for(var l=0; l<2;l++){
    g_modelMatrix.translate(-60, -13, 0);
    for (var i=0;i<5;i++){
      g_modelMatrix.translate(9, 3, 0); 
      g_modelMatrix.scale(5,5,1);
      gl.uniform1i(u_Color,1); 
  
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
      gl.uniform1i(u_Color,3);
  
      g_modelMatrix.translate(-0.6, 0.6, 0.01);
      g_modelMatrix.scale(0.2,0.2,1);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
      for (var k=0;k<2;k++){
        g_modelMatrix.translate( 3, 0, 0);
          drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
      for (var j=0; j<2;j++){
        g_modelMatrix.translate( -9, -3, 0);
        for (var k=0;k<3;k++){
          g_modelMatrix.translate( 3, 0, 0);
          drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
          }
      }
    }
  }
  
  g_modelMatrix.translate(-60, -16, 0);
  g_modelMatrix.translate(9, 3, 0); 
  g_modelMatrix.scale(5,5,1);
  gl.uniform1i(u_Color,1); 
  
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  gl.uniform1i(u_Color,3);
  
  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }
  g_modelMatrix.translate(45, 3, 0); 
  g_modelMatrix.scale(5,5,1);
  gl.uniform1i(u_Color,1); 
  
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  gl.uniform1i(u_Color,3);
  
  g_modelMatrix.translate(-0.6, 0.6, 0.01);
  g_modelMatrix.scale(0.2,0.2,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var j=0; j<2;j++){
    g_modelMatrix.translate( -9, -3, 0);
    for (var k=0;k<3;k++){
      g_modelMatrix.translate( 3, 0, 0);
      drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
      }
  }

  g_modelMatrix.translate(-36, 8.3, 1); 
  g_modelMatrix.scale(8,0.8,7);
  g_modelMatrix.rotate(45, 0.0, 1.0, 0.0);
  gl.uniform1i(u_Color,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.rotate(-45, 0.0, 1.0, 0.0);
  g_modelMatrix.translate(2.5, 0, 0); 
  g_modelMatrix.rotate(-45, 0.0, 1.0, 0.0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.rotate(45, 0.0, 1.0, 0.0);
  g_modelMatrix.translate(0.5, -9, 0); 
  g_modelMatrix.scale(0.1,9,0.1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-36, 0, 0); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);
  g_modelMatrix.translate(18, -0.1, 0); 
  g_modelMatrix.scale(10,0.9,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-2.8, 8.7, -12.5); 
  g_modelMatrix.scale(0.3,0.3,3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(18.5, 0, 0); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-12.8, -0.2, 1.7); 
  g_modelMatrix.scale(1.3,1.4,1);
  gl.uniform1i(u_Color,2); 
  
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  for (var k=0;k<2;k++){
    g_modelMatrix.translate( 3, 0, 0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }

  g_modelMatrix.translate(-3.5, -11.6, 1.3); 
  g_modelMatrix.scale(1.8,5.5,1);
  gl.uniform1i(u_Color,4); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,5); 
  g_modelMatrix.translate(0, 0.95, 0); 
  g_modelMatrix.scale(1,0.05,4);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(0, -18, 0); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,0); 
  gl.uniform1i(u_UseTextures, 2);
  g_modelMatrix.translate(-6, 58, -4); 
  g_modelMatrix.scale(1,7,0.8);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-0.5, 1.3, 0.9); 
  g_modelMatrix.scale(0.3,0.3,0.1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var i=0;i<4;i++){
    g_modelMatrix.translate(0, 0, -4.2); 
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.translate(3, 0, -4.2); 
  for (var i=0;i<5;i++){
    g_modelMatrix.translate(0, 0, 4.2); 
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.translate(39, -5, -10); 
  g_modelMatrix.scale(3,4,10);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-0.5, 1.2, 0.9); 
  g_modelMatrix.scale(0.3,0.25,0.1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var i=0;i<4;i++){
    g_modelMatrix.translate(0, 0, -4.2); 
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.translate(3, 0, -4.2); 
  for (var i=0;i<5;i++){
    g_modelMatrix.translate(0, 0, 4.2); 
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }

  g_modelMatrix.translate(-155, -10, 20); 
  g_modelMatrix.scale(3,4,5);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(0, 1.2, 0.4); 
  g_modelMatrix.scale(0.3,0.25,0.1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(0, 0, -8); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(292, -5, 0); 
  g_modelMatrix.scale(3,5,10);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(0, 1.2, 0.4); 
  g_modelMatrix.scale(0.3,0.2,0.1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(0, 0, -8); 
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  gl.uniform1i(u_UseTextures, 0);
  gl.uniform1i(u_Color,6);
  g_modelMatrix.translate(-170, -50, 150); 
  g_modelMatrix.scale(325,2,500);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(0.025, 1.2, -0.1);
  g_modelMatrix.scale(0.07,0.5,0.1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(0, -0.5, 0.5);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(0, -0.5, 0.5);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-1, 0.7, -1);
  g_modelMatrix.scale(2,1,1);
  g_modelMatrix.rotate(45,0.0,0.0,1.0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.rotate(-45,0.0,0.0,1.0);
  g_modelMatrix.translate(1, 0, 0);
  g_modelMatrix.rotate(45,0.0,0.0,1.0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,0);
  gl.uniform1i(u_UseTextures, 2);
  g_modelMatrix.rotate(-45,0.0,0.0,1.0);
  g_modelMatrix.translate(0.5, 0, 1);
  g_modelMatrix.scale(0.5,1.4,0.1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-4, 0, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  gl.uniform1i(u_UseTextures, 0);
  gl.uniform1i(u_Color,7);

  gl.uniform1i(u_UseTextures, 1);
  g_modelMatrix.translate(-9.6, -1, -55);
  g_modelMatrix.scale(3,1,44);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(0.52, 1, 2.7);
  g_modelMatrix.scale(1.5,1,0.8);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(1, 0, -0.7);
  g_modelMatrix.scale(0.05,1,0.3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(1.8, 0, 0);
  g_modelMatrix.rotate(-0.5,0.0,1.0,0.0)
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var i=0;i<2;i++){
    g_modelMatrix.translate(1.8, 0, 0.03);
    g_modelMatrix.rotate(-0.5,0.0,1.0,0.0)
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }

  g_modelMatrix.translate(1.8, 0, 0.03);
  g_modelMatrix.rotate(-1,0.0,1.0,0.0)
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(1.8, 0, 0.03);
  g_modelMatrix.rotate(-2,0.0,1.0,0.0)
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var i=0;i<2;i++){
    g_modelMatrix.translate(1.8, 0, 0.04);
    g_modelMatrix.rotate(-4,0.0,1.0,0.0)
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }

  g_modelMatrix.rotate(12.5,0,1,0);
  g_modelMatrix.translate(-12, 0, 3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(1.8, 0, 0);
  g_modelMatrix.rotate(0.5,0.0,1.0,0.0)
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var i=0;i<2;i++){
    g_modelMatrix.translate(1.8, 0, -0.03);
    g_modelMatrix.rotate(0.5,0.0,1.0,0.0)
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }

  g_modelMatrix.translate(1.8, 0, -0.03);
  g_modelMatrix.rotate(1,0.0,1.0,0.0)
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(1.8, 0, -0.03);
  g_modelMatrix.rotate(2,0.0,1.0,0.0)
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var i=0;i<2;i++){
    g_modelMatrix.translate(1.8, 0, -0.04);
    g_modelMatrix.rotate(4,0.0,1.0,0.0)
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }

  g_modelMatrix.rotate(-12.5,0,1,0);
  g_modelMatrix.translate(-1.5, 0, -2.4);
  g_modelMatrix.scale(3,1,0.4);
  g_modelMatrix.rotate(10,0,1,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var i=0;i<9;i++){
    g_modelMatrix.translate(0, 0, 1);
    g_modelMatrix.rotate(-2,0.0,1.0,0.0)
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  for (var i=0;i<3;i++){
    g_modelMatrix.translate(0, 0, 0.8);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }

  g_modelMatrix.rotate(9,0,1,0);
  g_modelMatrix.translate(4, 0, 0.5);
  g_modelMatrix.scale(0.8,1,0.5);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  for (var i=0;i<9;i++){
    g_modelMatrix.translate(0, 0, -1);
    g_modelMatrix.rotate(-2,0.0,1.0,0.0)
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }

  g_modelMatrix.rotate(18,0,1,0);
  g_modelMatrix.translate(-0.1, 0, 0.7);
  g_modelMatrix.scale(0.3,1,3);
  g_modelMatrix.rotate(8,0.0,1.0,0.0)
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  for (var i=0;i<9;i++){
    g_modelMatrix.translate(1, 0, 0);
    g_modelMatrix.rotate(-2,0.0,1.0,0.0)
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }

  g_modelMatrix.rotate(10,0,1,0);
  g_modelMatrix.translate(-1.2, 0, -0.2);
  g_modelMatrix.scale(3.2,1,0.33);
  g_modelMatrix.rotate(8,0.0,1.0,0.0)
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  for (var i=0;i<9;i++){
    g_modelMatrix.translate(0, 0, 1);
    g_modelMatrix.rotate(-2,0.0,1.0,0.0)
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }

  g_modelMatrix.rotate(10,0,1,0);
  g_modelMatrix.translate(5, 0, -30);
  g_modelMatrix.scale(5,1,1);
  g_modelMatrix.rotate(5,0.0,1.0,0.0)
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  for (var i=0;i<20;i++){
    g_modelMatrix.translate(0, 0, 1);
    g_modelMatrix.rotate(-0.3,0.0,1.0,0.0)
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }

  g_modelMatrix.translate(1.2, 0, -20);
  g_modelMatrix.scale(0.4,1,1);
  g_modelMatrix.rotate(11,0.0,1.0,0.0)
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  for (var i=0;i<15;i++){
    g_modelMatrix.translate(0, 0, 1);
    g_modelMatrix.rotate(-0.3,0.0,1.0,0.0)
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  gl.uniform1i(u_UseTextures, 0);
  gl.uniform1i(u_Color,2);
  g_modelMatrix.translate(4.8, -1, -76);
  g_modelMatrix.scale(1.5,1,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  for (var i=0;i<35;i++){
    g_modelMatrix.translate(-0.04, 0, 1);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }

  for (var i=0;i<35;i++){
    g_modelMatrix.translate(-0.04, 0, 1);
    g_modelMatrix.rotate(0.2,0.0,1.0,0.0)
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }

  gl.uniform1i(u_Color,7);
  gl.uniform1i(u_UseTextures, 1);
  g_modelMatrix.rotate(-10,0.0,1.0,0.0)
  g_modelMatrix.translate(-12.5, 1, 7.5);
  g_modelMatrix.scale(1,1,14);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(3.25, 0, 0.68);
  g_modelMatrix.scale(0.32,1,0.3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_UseTextures, 0);
  gl.uniform1i(u_Color,5);
  g_modelMatrix.translate(-31, 3, -12);
  g_modelMatrix.scale(0.1,4,0.15);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var i=0;i<16;i++){
    g_modelMatrix.translate(-0.2, 0, -4);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }

  g_modelMatrix.translate(4, 0, 0);
  g_modelMatrix.scale(2,1,0.5);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  for (var i=0;i<17;i++){
    g_modelMatrix.translate(3, 0, 0.1);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }

  g_modelMatrix.translate(-30, 1.2, 15);
  g_modelMatrix.scale(1.5,2,3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  for (var i=0;i<45;i++){
    g_modelMatrix.rotate(2,0.0,1.0,0.0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(-2, 0.5, 0);
  g_modelMatrix.scale(3,0.05,0.3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0, -15, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(1.5, 5, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0, 8, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-1, 7, 5);
  g_modelMatrix.scale(0.2,1,5);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0, -8, -2);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0, 10, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(10, -18, 23);
  g_modelMatrix.scale(5/3,20,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  for (var i=0;i<45;i++){
    g_modelMatrix.rotate(2,0.0,1.0,0.0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(0, 0.8, 0);
  g_modelMatrix.scale(4,0.5,3.5);
  gl.uniform1i(u_Color,8);
  gl.uniform1i(u_UseTextures, 4);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  for (var i=0;i<180;i++){
    g_modelMatrix.rotate(.5,1.0,1.0,1.0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.rotate(-90,1.0,1.0,1.0);
  gl.uniform1i(u_UseTextures, 0);
  gl.uniform1i(u_Color,5);

  g_modelMatrix.translate(5, -1.2, 10);
  g_modelMatrix.scale(0.25,2,0.2);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  for (var i=0;i<45;i++){
    g_modelMatrix.rotate(2,0.0,1.0,0.0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(-2, 0.5, 0);
  g_modelMatrix.scale(3,0.05,0.3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0, -15, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(1.5, 5, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0, 8, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-1, 7, 5);
  g_modelMatrix.scale(0.2,1,5);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0, -8, -2);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0, 10, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-20, -27, -3);
  g_modelMatrix.scale(5/3,15,0.5);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  for (var i=0;i<45;i++){
    g_modelMatrix.rotate(2,0.0,1.0,0.0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(-2, 0.5, 0);
  g_modelMatrix.scale(3,0.05,0.3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0, -15, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(1.5, 5, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0, 8, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-1, 7, 5);
  g_modelMatrix.scale(0.2,1,5);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0, -8, -2);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0, 10, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
  g_modelMatrix.translate(-25, -15, 5);
  g_modelMatrix.scale(2,25,0.6);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  for (var i=0;i<45;i++){
    g_modelMatrix.rotate(2,0.0,1.0,0.0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(-2, 0.5, 0);
  g_modelMatrix.scale(3,0.05,0.3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0, -15, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(1.5, 5, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0, 8, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-1, 7, 5);
  g_modelMatrix.scale(0.2,1,5);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0, -8, -2);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0, 10, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(20, -22, 8);
  g_modelMatrix.scale(5/3,10,1.2);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  for (var i=0;i<45;i++){
    g_modelMatrix.rotate(2,0.0,1.0,0.0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(0, 0.8, 0);
  g_modelMatrix.scale(2,0.5,1.5);
  gl.uniform1i(u_Color,8);
  gl.uniform1i(u_UseTextures, 4);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  for (var i=0;i<180;i++){
    g_modelMatrix.rotate(.5,1.0,1.0,1.0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.rotate(-90,1.0,1.0,1.0);
  gl.uniform1i(u_UseTextures, 0);
  gl.uniform1i(u_Color,5);
  g_modelMatrix.translate(6, -1.2, -9);
  g_modelMatrix.scale(0.6,3,0.6);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  for (var i=0;i<45;i++){
    g_modelMatrix.rotate(2,0.0,1.0,0.0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(0, 0.8, 0);
  g_modelMatrix.scale(2,0.5,1.5);
  gl.uniform1i(u_Color,8);
  gl.uniform1i(u_UseTextures, 4);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  for (var i=0;i<180;i++){
    g_modelMatrix.rotate(.5,1.0,1.0,1.0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.rotate(-90,1.0,1.0,1.0);
  gl.uniform1i(u_UseTextures, 0);
  gl.uniform1i(u_Color,5);
  g_modelMatrix.translate(23, 0.2, 10);
  g_modelMatrix.scale(0.6,4.5,0.6);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  for (var i=0;i<45;i++){
    g_modelMatrix.rotate(2,0.0,1.0,0.0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.rotate(-90,0.0,1.0,0.0);
  g_modelMatrix.translate(0, 0.8, 0);
  g_modelMatrix.scale(4,0.5,5);
  gl.uniform1i(u_Color,8);
  gl.uniform1i(u_UseTextures, 4);
  rotation = rotation + (deltaTime*5);
  g_modelMatrix.rotate(rotation,0,1,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  for (var i=0;i<180;i++){
    g_modelMatrix.rotate(.5,1.0,1.0,1.0);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.rotate(-90,1.0,1.0,1.0);
  g_modelMatrix.rotate(-rotation,0,1,0);
  g_modelMatrix.translate(-15.2, -2.9, -6);
  g_modelMatrix.scale(0.07,0.07,0.07);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  for (var i=0;i<49;i++){
    g_modelMatrix.translate(3,0,0.13);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  for (var i=0;i<2;i++){
    g_modelMatrix.translate(3,0,0.8);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  for (var i=0;i<2;i++){
    g_modelMatrix.translate(2,0,1.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  for (var i=0;i<2;i++){
    g_modelMatrix.translate(2,0,2.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  for (var i=0;i<5;i++){
    g_modelMatrix.translate(1.5,0,3.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }

  g_modelMatrix.translate(48,0,-30);
  for (var i=0;i<23;i++){
    g_modelMatrix.translate(3,0,0.13);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  for (var i=0;i<3;i++){
    g_modelMatrix.translate(2.5,0,1.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  for (var i=0;i<5;i++){
    g_modelMatrix.translate(2.5,0,2.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  for (var i=0;i<3;i++){
    g_modelMatrix.translate(2.2,0,3.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  for (var i=0;i<3;i++){
    g_modelMatrix.translate(2.0,0,4.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  for (var i=0;i<2;i++){
    g_modelMatrix.translate(1.0,0,5.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.translate(-1.0,0,5.5);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(-102,0,-60);
  for (var i=0;i<3;i++){
    g_modelMatrix.translate(2.5,0,1.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  for (var i=0;i<5;i++){
    g_modelMatrix.translate(2.5,0,2.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  for (var i=0;i<3;i++){
    g_modelMatrix.translate(2.2,0,3.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  for (var i=0;i<3;i++){
    g_modelMatrix.translate(2.0,0,4.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  for (var i=0;i<2;i++){
    g_modelMatrix.translate(1.0,0,5.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.translate(-1.0,0,5.5);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-1.0,0,4.5);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(73,0,-60);
  for (var i=0;i<3;i++){
    g_modelMatrix.translate(2.5,0,2.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  for (var i=0;i<5;i++){
    g_modelMatrix.translate(2.5,0,3.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  for (var i=0;i<4;i++){
    g_modelMatrix.translate(2.2,0,4.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }

  g_modelMatrix.translate(-7,-0.3,-44);
  for (var i=0;i<3;i++){
    g_modelMatrix.translate(2.5,0,2.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  for (var i=0;i<5;i++){
    g_modelMatrix.translate(2.5,0,3.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  for (var i=0;i<4;i++){
    g_modelMatrix.translate(2.2,0,4.5);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.translate(-27,0,-41);
  for (var i=0;i<6;i++){
    g_modelMatrix.translate(-3,0,0.13);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.translate(44.5,0,41);
  for (var i=0;i<6;i++){
    g_modelMatrix.translate(-3,0,0.13);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  }
  g_modelMatrix.translate(-12,0,-33);
  g_modelMatrix.scale(5,1,4);
  g_modelMatrix.rotate(35,0,1,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.rotate(-35,0,1,0);
  g_modelMatrix.translate(3,0,6);
  g_modelMatrix.rotate(25,0,1,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.rotate(-25,0,1,0);
  gl.uniform1i(u_UseTextures, 0);
  gl.uniform1i(u_Color,5);
  g_modelMatrix.translate(-1.5,0,-3);
  g_modelMatrix.scale(0.3,5,0.4);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,2);
  g_modelMatrix.translate(-118,0,8);
  g_modelMatrix.scale(1,0.5,3.2);
  g_modelMatrix.rotate(10,0,1,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.rotate(-10,0,1,0);
  g_modelMatrix.translate(0.4,0,2);
  g_modelMatrix.rotate(10,0,1,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.rotate(-10,0,1,0);
  g_modelMatrix.translate(0.1,0,1.6);
  g_modelMatrix.rotate(-5,0,1,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.rotate(5,0,1,0);
  g_modelMatrix.translate(0,0,1.6);
  g_modelMatrix.rotate(-5,0,1,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.rotate(5,0,1,0);
  g_modelMatrix.translate(-0.4,0,1.6);
  g_modelMatrix.rotate(-25,0,1,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.rotate(25,0,1,0);
  g_modelMatrix.translate(-1,0,1.6);
  g_modelMatrix.rotate(-30,0,1,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.rotate(30,0,1,0);
  g_modelMatrix.translate(-1,0,1.6);
  g_modelMatrix.rotate(-30,0,1,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.rotate(30,0,1,0);

  g_modelMatrix.translate(43,-0.1,-13);
  g_modelMatrix.scale(1.5,1,1.2);
  g_modelMatrix.rotate(45,0,1,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.rotate(-45,0,1,0);
  g_modelMatrix.translate(5.6,0,5.6);
  g_modelMatrix.scale(0.8,1.6,0.6);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,1);
  g_modelMatrix.translate(-3,0.1,-4);
  g_modelMatrix.rotate(45,0,1,0);
  g_modelMatrix.scale(0.6,0.15,2);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.rotate(-45,0,1,0);
  g_modelMatrix.translate(-0.5,-2,-0.5);
  g_modelMatrix.rotate(-45,0,1,0);
  g_modelMatrix.scale(0.2,3,0.8);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.rotate(45,0,1,0);
  g_modelMatrix.translate(4,0,4);
  g_modelMatrix.rotate(-45,0,1,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,3);
  g_modelMatrix.rotate(45,0,1,0);
  g_modelMatrix.translate(6,4,8);
  g_modelMatrix.scale(0.2,0.8,0.1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  for (var i=0;i<3;i++){
    g_modelMatrix.translate(0,0,7);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  g_modelMatrix.translate(0,-1,-14);
  g_modelMatrix.scale(8,0.2,10);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,1);
  g_modelMatrix.translate(-11,-4,-24);
  g_modelMatrix.scale(1.5,1.5,1.5);
  g_modelMatrix.rotate(45,1,1,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(0,0.5,1);
  g_modelMatrix.rotate(-75,0,1,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.rotate(75,0,1,1);
  g_modelMatrix.rotate(-45,1,1,0);

  g_modelMatrix.rotate(3,0,1,0);
  gl.uniform1i(u_Color,3);
  g_modelMatrix.translate(-38,-1,-3);
  g_modelMatrix.scale(0.7,7,0.8);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,5);
  g_modelMatrix.translate(-20,0,-3);
  g_modelMatrix.scale(4,0.2,2);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,-3,1);
  g_modelMatrix.scale(1,1,0.2);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,0,-15);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-0.7,0,10);
  g_modelMatrix.scale(0.1,4,0.6);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(14,0,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(15,0.9,100);
  g_modelMatrix.scale(10,0.25,8.3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,-3,1);
  g_modelMatrix.scale(1,1,0.2);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,0,-15);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-0.7,0,10);
  g_modelMatrix.scale(0.1,4,0.6);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(14,0,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,1);
  g_modelMatrix.scale(1.2,1.3,1.2);
  g_modelMatrix.translate(260,-0.5,55);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-55,0,-18);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-55,0,-18);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-10,0,-120);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-30,0,-10);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(60,0,22);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(30,0,10);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,2);
  g_modelMatrix.scale(1,3,1);
  g_modelMatrix.translate(66,1,20);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.scale(1,1.3,1);
  g_modelMatrix.translate(13,0,-180);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.scale(1,1.1,1);
  g_modelMatrix.translate(-130,0,220);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.scale(1,1.1,1);
  g_modelMatrix.translate(-120,0,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.scale(1,1.1,1);
  g_modelMatrix.translate(-30,0,-100);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.scale(1,0.25,1);
  g_modelMatrix.translate(-75,-2,-160);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,0,-20);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(8,0,23);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,0,-20);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(8,0,23);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,0,-20);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(8,0,23);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,0,-20);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(0,0.8,10);
  g_modelMatrix.scale(1,0.2,10);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-8,0,-0.3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-8,0,-0.3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-8,0,-0.3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,0,0.35);

  g_modelMatrix.scale(1,5,1/10);
  g_modelMatrix.translate(410,-1,420);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,0,-20);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(8,0,23);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,0,-20);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(8,0,23);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,0,-20);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(8,0,23);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,0,-20);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.translate(0,0.8,10);
  g_modelMatrix.scale(1,0.2,9);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-8,0,-0.3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-8,0,-0.3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-8,0,-0.3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,0,0.3);

  g_modelMatrix.scale(1,5,1/9);
  gl.uniform1i(u_Color,3);
  g_modelMatrix.translate(25,0,-25);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,0,-20);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  gl.uniform1i(u_Color,7);
  gl.uniform1i(u_UseTextures, 1);
  g_modelMatrix.scale(20,0.2,30);
  g_modelMatrix.translate(-8,0,-2);
  g_modelMatrix.rotate(-12,0,1,0);
  g_modelMatrix.translate(-13,-8,-9);
  g_modelMatrix.scale(4,1,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(2.2,0,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  gl.uniform1i(u_UseTextures, 0);
  gl.uniform1i(u_Color,9);
  g_modelMatrix.translate(2,2,0);
  g_modelMatrix.scale(0.2,3,0.6);
  g_modelMatrix.rotate(5.5,0,1,0);
  g_modelMatrix.scale(0.5,1,1.3);
  g_modelMatrix.translate(0,0,-2);
  if (z_movement>5){
    z_movement=5;
    z_operation = 0;
  } else if (z_movement<-4){
    z_movement=-4;
    z_operation = 1;
  }
  if (z_operation == 0){
    z_movement = z_movement - deltaTime;
  } else if (z_operation == 1){
    z_movement = z_movement + deltaTime;
  }
  g_modelMatrix.translate(0,0,z_movement);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,1,-0.3);
  g_modelMatrix.scale(1.0,1.5,0.73);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  gl.uniform1i(u_Color,10);
  g_modelMatrix.translate(0,0,0.3);
  g_modelMatrix.scale(0.8,0.8,0.8);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  gl.uniform1i(u_Color,6);
  g_modelMatrix.translate(-0.7,-0.5,0.9);
  g_modelMatrix.scale(0.2,0.3,1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(6,0,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  gl.uniform1i(u_Color,3);
  g_modelMatrix.translate(-2.5,-1,-0.5);
  g_modelMatrix.scale(7,1.4,0.3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,0,-5);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.scale(1,1,5.7);
  g_modelMatrix.translate(0,0,-z_movement);
  gl.uniform1i(u_Color,10);
  g_modelMatrix.translate(-27.3,1.4,3.75);
  g_modelMatrix.scale(0.35,8,0.05);
  if (x1_movement>1.5){
    x1_movement=1.5;
    x1_operation = 0;
  } else if (x1_movement<0){
    x1_movement=0;
    x1_operation = 1;
  }
  if (x1_operation == 0){
    x1_movement = x1_movement - deltaTime;
  } else if (x1_operation == 1){
    x1_movement = x1_movement + deltaTime;
  }
  g_modelMatrix.translate(-x1_movement,0,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(x1_movement,0,0);
  g_modelMatrix.translate(2,0,0);
  if (x1_movement>1.5){
    x1_movement=1.5;
    x1_operation = 0;
  } else if (x1_movement<0){
    x1_movement=0;
    x1_operation = 1;
  }
  if (x1_operation == 0){
    x1_movement = x1_movement - deltaTime;
  } else if (x1_operation == 1){
    x1_movement = x1_movement + deltaTime;
  }
  g_modelMatrix.translate(x1_movement,0,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-x1_movement,0,0);
  g_modelMatrix.translate(0,0,-0.75);
  gl.uniform1i(u_Color,3);
  g_modelMatrix.translate(-33.2,2,-74);
  g_modelMatrix.scale(1.46,0.4,1);
  g_modelMatrix.translate(0,0,-0.2);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(-3.1,0,-1.1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(41,3.55,17.5);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(9.4,0.1,4);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(0,0,0.2);
  gl.uniform1i(u_Color,9);
  g_modelMatrix.translate(-30,-9.4,140);
  g_modelMatrix.scale(1,0.1,2.5);
  if (x2_movement>12){
    x2_movement=12;
    x2_operation = 0;
  } else if (x2_movement<-1){
    x2_movement=-1;
    x2_operation = 1;
  }
  if (x2_operation == 0){
    x2_movement = x2_movement - (deltaTime*15);
  } else if (x2_operation == 1){
    x2_movement = x2_movement + (deltaTime*15);
  }
  g_modelMatrix.translate(x2_movement,0,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  gl.uniform1i(u_Color,3);
  g_modelMatrix.translate(-0.6,-0.8,0);
  g_modelMatrix.scale(0.2,0.9,1.1);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix.translate(5.7,0,0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  g_modelMatrix.scale(5,1/.9,1/1.1);
  g_modelMatrix.translate(-x2_movement,0,0);

}

var g_normalMatrix = new Matrix4(); // Coordinate transformation matrix for normals

// Draw the cube
function drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
  // Calculate the model view project matrix and pass it to u_MvpMatrix
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
  // Calculate the normal transformation matrix and pass it to u_NormalMatrix
  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
  // Draw
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}
