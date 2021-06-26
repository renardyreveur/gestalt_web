import './style.css'
import * as THREE from 'three'

// Preload script this is the main function taht runs
const preload = () => {
	let manager = new THREE.LoadingManager();

	// Once loaded, instantiate an Environment object
	manager.onLoad = function() {
		const environ = new Environment( font_obj, [pt1, pt2, pt3] );
	}

	// Define font and particle texture which are the base to the environment
	var font_obj = null;
	const loader = new THREE.FontLoader( manager );
	const font = loader.load("/fonts/Ostrich_Sans_Black.json", function ( font ) { font_obj = font; });
	const pt1 = new THREE.TextureLoader( manager ).load( "/textures/p1.png" );
	const pt2 = new THREE.TextureLoader( manager ).load( "/textures/p2.png" );
	const pt3 = new THREE.TextureLoader( manager ).load( "/textures/p3.png" );
}

// If the document and all the sub-resources have finished loading, run the preload function
if ( document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll))
  preload ();
else
  document.addEventListener("DOMContentLoaded", preload ); 
document.body.onselectstart = function() { return false; } 

// Environment class - basic three.js setup [scene, camera, renderer, etc.]
class Environment {
	constructor( font, particles ){
		this.font = font;
		this.particles = particles;

		// Link to HTML Document
		this.container = document.querySelector( '#webgl' );
		
		// Create three.js base objects
		this.scene = new THREE.Scene();
		this.createCamera();
		this.createRenderer();
		this.setup();

		// Handle window resize events
		this.bindEvents();
	}

	bindEvents(){
		// Window Resize
		window.addEventListener( 'resize', this.onWindowResize.bind( this ) ); 
	}

	onWindowResize(){
		// Update renderer size on window resize
		this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
		this.camera.fov = (this.camera.aspect < 1.0) ?  2 * Math.atan( ( 100 / this.camera.aspect ) / ( 2 * 100 ) ) * ( 180 / Math.PI )*1.1 : 65;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
	
	}

	setup(){ 
		// Main particles effect rendering setup
		console.log("SETUP!")
		this.createParticles = new CreateParticles( this.scene, this.font, this.particles, this.camera, this.renderer );
	}
	
	render() {
		this.createParticles.render()
		// Render the scene with the camera
		this.renderer.render( this.scene, this.camera )
	}
	
	createCamera() {
		// Perspective Camera
		let aspect = this.container.clientWidth /  this.container.clientHeight
		let fov = (aspect < 1.0) ? 2 * Math.atan( ( 100 / aspect ) / ( 2 * 100 ) ) * ( 180 / Math.PI )*1.1 : 65;
		this.camera = new THREE.PerspectiveCamera( fov, aspect, 1, 500 );
		this.camera.position.set( 0, 0, 100 );
	
	}
	
	createRenderer() {
		// Renderer
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );

		this.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2));

		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.container.appendChild( this.renderer.domElement );

		this.renderer.setAnimationLoop(() => { this.render() })

	}
}


class CreateParticles {
	constructor ( scene, font, particleImgs, camera, renderer ){
		this.scene = scene;
		this.font = font;
		this.particleImgs = particleImgs;
		this.camera = camera;
		this.renderer = renderer;
		
		// Instantiate a Raycaster
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2(1, 0);

		this.colorChange = new THREE.Color();

		// Text Rendering data
		this.data = {
			text: 'GESTALT\nPOOL',
			amount: 200,
			particleSize: 5,
			particleColor: 0xffffff,
			textSize: 24,
			area: 10,
			ease: .05,
		}

		this.setup();
		this.bindEvents();
	}

	setup(){
		// Setup an invisible planeArea
		const geometry = new THREE.PlaneGeometry( this.visibleWidthAtZDepth( 100, this.camera ), this.visibleHeightAtZDepth( 100, this.camera ));
		const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true } );
		this.planeArea = new THREE.Mesh( geometry, material );
		this.planeArea.visible = false;
		
		// Create the Text Meshes
		this.createText();
	}

	bindEvents() {
		// Mouse event listeners
		// document.addEventListener( 'dbclick', this.onMouseDBClick.bind( this ));
		document.addEventListener( 'mousemove', this.onMouseMove.bind( this ) );
		document.addEventListener( 'deviceorientation' , this.onDeviceOrientation.bind(this) );
		// document.addEventListener( 'touchmove', this.onMouseMove.bind( this ));
		document.addEventListener( 'mouseup', this.onMouseUp.bind( this ) );
	}

	onDeviceOrientation(){
		let x = event.beta;
		let y = event.gamma;
		// if (x >  90) { x =  90};
  		// if (x < -90) { x = -90};
		// x /= 180;
		// y /= 180;

		// this.mouse.x = x;
		// this.mouse.y = y;
		console.log(x, y)
	}

	onMouseDBClick(){
		
		// this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		// this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		// const vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 0.5);
		// vector.unproject( this.camera );
		// const dir = vector.sub( this.camera.position ).normalize();
		// const distance = - this.camera.position.z / dir.z;
		// this.currenPosition = this.camera.position.clone().add( dir.multiplyScalar( distance ) );
		
		// const pos = this.particles.geometry.attributes.position;
		this.buttom = true;
		this.data.ease = .01;
		
	}

	onMouseUp(){

		this.buttom = false;
		this.data.ease = .05;
	}

	onMouseMove( ) { 

	    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	}

	render( level ){ 
		// Relative Timing
		const time = ((.001 * performance.now())%12)/12;
		const zigzagTime = (1 + (Math.sin( time * 2 * Math.PI )))/6;

		// Picking ray(what objects in 3d the mouse is over) update with mouse and camera
		this.raycaster.setFromCamera( this.mouse, this.camera );

		// Calculate objects intersecting picking ray
		const intersects = this.raycaster.intersectObject( this.planeArea );

		// If objects intersect with the mouse picking ray
		if ( intersects.length > 0 ) {

			const pos = this.particles.geometry.attributes.position;
			const copy = this.geometryCopy.attributes.position; // original position
			const coulors = this.particles.geometry.attributes.customColor;
			const size = this.particles.geometry.attributes.size;

		    const mx = intersects[ 0 ].point.x;
		    const my = intersects[ 0 ].point.y;
		    const mz = intersects[ 0 ].point.z;

		    for ( var i = 0, l = pos.count; i < l; i++) {

		    	const initX = copy.getX(i);
		    	const initY = copy.getY(i);
		    	const initZ = copy.getZ(i);

		    	let px = pos.getX(i);
		    	let py = pos.getY(i);
		    	let pz = pos.getZ(i);

		    	this.colorChange.setHSL( .5, 1 , 1 )
		    	coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
		    	coulors.needsUpdate = true;

		    	size.array[ i ]  = this.data.particleSize;
		    	size.needsUpdate = true;

		    	let dx = mx - px;
		    	let dy = my - py;
		    	const dz = mz - pz;

		    	const mouseDistance = this.distance( mx, my, px, py )
		    	let d = ( dx = mx - px ) * dx + ( dy = my - py ) * dy;
		    	const f = - this.data.area/d;

		    	if( this.buttom ){ 

		    		const t = Math.atan2( dy, dx );
		    		px -= f * Math.cos( t );
		    		py -= f * Math.sin( t );

		    		this.colorChange.setHSL( .5 + zigzagTime, 1.0 , .5 )
		    		coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
		    		coulors.needsUpdate = true;

		    		if ((px > (initX + 70)) || ( px < (initX - 70)) || (py > (initY + 70) || ( py < (initY - 70)))){

		    			this.colorChange.setHSL( .15, 1.0 , .5 )
		    			coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
		    			coulors.needsUpdate = true;

		    		}

		    	}else{
		    	
			    	if( mouseDistance < this.data.area ){

			    		if(i%5==0){

			    			const t = Math.atan2( dy, dx );
			    			px -= .03 * Math.cos( t );
			    			py -= .03 * Math.sin( t );

			    			this.colorChange.setHSL( .15 , 1.0 , .5 )
			    			coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
			    			coulors.needsUpdate = true;

							size.array[ i ]  =  this.data.particleSize /1.2;
							size.needsUpdate = true;

			    		}else{

					    	const t = Math.atan2( dy, dx );
					    	px += f * Math.cos( t );
					    	py += f * Math.sin( t );

					    	pos.setXYZ( i, px, py, pz );
					    	pos.needsUpdate = true;

					    	size.array[ i ]  = this.data.particleSize * 1.3 ;
					    	size.needsUpdate = true;
				    	}

			    		if ((px > (initX + 10)) || ( px < (initX - 10)) || (py > (initY + 10) || ( py < (initY - 10)))){

			    			this.colorChange.setHSL( .15, 1.0 , .5 )
			    			coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
			    			coulors.needsUpdate = true;

			    			size.array[ i ]  = this.data.particleSize /1.8;
			    			size.needsUpdate = true;

			    		}
			    	}

		    	}

		    	px += ( initX  - px ) * this.data.ease;
		    	py += ( initY  - py ) * this.data.ease;
		    	pz += ( initZ  - pz ) * this.data.ease;

		    	pos.setXYZ( i, px, py, pz );
		    	pos.needsUpdate = true;

		    }
		}

		this.camera.position.x = Math.sin(this.mouse.x * Math.PI * 0.1) * 50
		this.camera.position.z = Math.cos(this.mouse.x * Math.PI * 0.1) * 100
		this.camera.position.y = this.mouse.y * 20
		this.camera.lookAt(0, 0, 0)
	}

	createText(){ 
		//From setup()
		// Hold the Vector3D position of the points of the text shape exterior
		let thePoints = [];

		// Get 2D plane shape geometry with rendered font
		let shapes = this.font.generateShapes( this.data.text , this.data.textSize  );
		let geometry = new THREE.ShapeGeometry( shapes );
		geometry.computeBoundingBox();
	
		// Get mid point of text bounding box
		const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
		const yMid =  (geometry.boundingBox.max.y - geometry.boundingBox.min.y)/2.85;

		geometry.center();

		// Get the exterior path of the text shapes -> We're going to render the path with particles
		let holeShapes = [];
		for ( let q = 0; q < shapes.length; q ++ ) {
			let shape = shapes[ q ];
			if ( shape.holes && shape.holes.length > 0 ) {
				for ( let j = 0; j < shape.holes.length; j ++ ) {
					let  hole = shape.holes[ j ];
					holeShapes.push( hole );
				}
			}
		}
		shapes.push.apply( shapes, holeShapes );

		let colors = [];
		let sizes = [];

		// For each shape in shapes
		for ( let x = 0; x < shapes.length; x ++ ) {
			let shape = shapes[ x ];
			// If shape is path then use half of the number of particles, else use full
			const amountPoints = ( shape.type == 'Path') ? this.data.amount/2 : this.data.amount;
			
			// Points to render particles at -> Equally spaced $amountPoints number of points around the text exterior
			let points = shape.getSpacedPoints( amountPoints ) ;
			points.forEach( ( element, z ) => {						
				const a = new THREE.Vector3( element.x, element.y, 0 );
				thePoints.push( a );
				// colour change defined in the render function
				colors.push( this.colorChange.r, this.colorChange.g, this.colorChange.b);
				sizes.push( 1 )
				});
		}

		// Create a buffergeometry as we can mutalize all points, they're the same
		let geoParticles = new THREE.BufferGeometry().setFromPoints( shuffle(thePoints) );
		
		// translate to the text mid-points
		geoParticles.translate( xMid, yMid, 0 );
		geoParticles.setAttribute( 'customColor', new THREE.Float32BufferAttribute( colors, 3 ) );
		geoParticles.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1) );
		
		// To Render with three different materials
		geoParticles.addGroup(0, Math.floor(thePoints.length/3), 0)
		geoParticles.addGroup(Math.floor(thePoints.length/3), Math.floor(thePoints.length/3), 1)
		geoParticles.addGroup(Math.floor(thePoints.length/3)*2, thePoints.length - Math.floor(thePoints.length/3)*2, 2)
		
		// Define custom material to render the particles with GLSL		
		const materials = [];
		for (let i = 0; i < 3; i++){
			materials.push(
				new THREE.ShaderMaterial( {
					uniforms: {
						color: { value: new THREE.Color( 0xffffff ) },
						pointTexture: { value: this.particleImgs[i] }
					},
					vertexShader: vertexShader(),
					fragmentShader: fragmentShader(),
		
					blending: THREE.AdditiveBlending,
					depthTest: false,
					transparent: true,
				} )
			);
		}
		
		// Create Particle Meshes and add to Scene
		this.particles = new THREE.Points( geoParticles, materials );
		this.scene.add( this.particles );


		// Create a separate copy
		this.geometryCopy = new THREE.BufferGeometry();
		this.geometryCopy.copy( this.particles.geometry );
		
	}

	visibleHeightAtZDepth ( depth, camera ) {

	  const cameraOffset = camera.position.z;
	  if ( depth < cameraOffset ) depth -= cameraOffset;
	  else depth += cameraOffset;

	  const vFOV = camera.fov * Math.PI / 180; 

	  return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
	}

	visibleWidthAtZDepth( depth, camera ) {

	  const height = this.visibleHeightAtZDepth( depth, camera );
	  return height * camera.aspect;

	}

	distance (x1, y1, x2, y2){
	   
	    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
	}
}


function vertexShader() {
	return `
		attribute float size;
		attribute vec3 customColor;
		varying vec3 vColor;
		
		void main() {
			vColor = customColor;
			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
			gl_PointSize = size * ( 300.0 / -mvPosition.z );
			gl_Position = projectionMatrix * mvPosition;
		}
	`
}

function fragmentShader() {
	return `
		uniform vec3 color;
		uniform sampler2D pointTexture;
		
		varying vec3 vColor;
		
		void main() {
		
			gl_FragColor = vec4( color * vColor, 1.0 );
			gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
		}
	`
}

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}


function shuffle(array) {
	var currentIndex = array.length,  randomIndex;
  
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
  
	  // Pick a remaining element...
	  randomIndex = Math.floor(Math.random() * currentIndex);
	  currentIndex--;
  
	  // And swap it with the current element.
	  [array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];
	}
  
	return array;
  }