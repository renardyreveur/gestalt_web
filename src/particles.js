import * as THREE from 'three'

import hull from './hull/hull.js'

export class CreateParticles {
	constructor ( scene, font, particleImgs, camera, renderer){
		this.scene = scene;
		this.font = font;
		this.particleImgs = particleImgs;
		this.camera = camera;
		this.renderer = renderer;
		
		// Instantiate a Raycaster
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2(1, 0);

		this.colorChange = new THREE.Color();
		// let initWidth = renderer.getSize(new THREE.Vector2()).x

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
		document.addEventListener("touchstart", this.touch2mouse, true);
		document.addEventListener("touchmove", this.touch2mouse, true);
		document.addEventListener("touchend", this.touch2mouse, true);

		// document.addEventListener("deviceorientation", this.deviceorientation, true);

		document.addEventListener( 'mousemove', this.onMouseMove.bind( this ) );
	}

	touch2mouse(e){
		console.log("AAA")
		var theTouch = e.changedTouches[0];
		var mouseEv;

		switch(e.type)
		{
			case "touchstart": mouseEv="mousedown"; break;  
			case "touchend":   mouseEv="mouseup"; break;
			case "touchmove":  mouseEv="mousemove"; break;
			default: return;
		}

		var mouseEvent = document.createEvent("MouseEvent");
		mouseEvent.initMouseEvent(mouseEv, true, true, window, 1, theTouch.screenX, theTouch.screenY, theTouch.clientX, theTouch.clientY, false, false, false, false, 0, null);
		theTouch.target.dispatchEvent(mouseEvent);

		e.preventDefault();
	}

	// deviceorientation(e){
	// 	console.log("EHERE")
	// 	var absolute = e.absolute;
	// 	var alpha    = e.alpha;
	// 	var x     = e.beta;
	// 	var y    = e.gamma;

	// 	if (x >  90) { x =  90};
  	// 	if (x < -90) { x = -90};
	// 	x += 90;
  	// 	y += 90;
	// 	x /=180;
	// 	y /= 180;
	// 	console.log(x, y)
	// 	e.preventDefault();
	// }

	onMouseMove( event ) { 
		let x, y;
		x = event.clientX;
		y = event.clientY;

		this.mouse.x = ( x / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( y / window.innerHeight ) * 2 + 1;
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
			const colors = this.particles.geometry.attributes.customColor;
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

				this.colorChange.setHex(0xe76f51);
		    	colors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
		    	colors.needsUpdate = true;

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
		    		colors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
		    		colors.needsUpdate = true;

		    		if ((px > (initX + 70)) || ( px < (initX - 70)) || (py > (initY + 70) || ( py < (initY - 70)))){

		    			this.colorChange.setHSL( .15, 1.0 , .5 )
		    			colors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
		    			colors.needsUpdate = true;

		    		}

		    	}else{
		    	
			    	if( mouseDistance < this.data.area ){

			    		if(i%5==0){

			    			const t = Math.atan2( dy, dx );
			    			px -= .03 * Math.cos( t );
			    			py -= .03 * Math.sin( t );

			    			this.colorChange.setHSL( .15 , 1.0 , .5 )
			    			colors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
			    			colors.needsUpdate = true;

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
			    			colors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
			    			colors.needsUpdate = true;

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
		

		// Get Hull of the Text
		let xylist = [];
		for (let p = 0; p < thePoints.length; p++){
			xylist.push([thePoints[p].x, thePoints[p].y])
		}
		let h = hull(xylist, 20);
		let hullpoints = []
		for (let x = 0; x < h.length; x++ ){
			hullpoints.push( new THREE.Vector2(h[x][0], h[x][1]) );
		}

		const hullShape = new THREE.Shape(hullpoints);
		this.hullGeometry = new THREE.ShapeGeometry(hullShape);
	

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
