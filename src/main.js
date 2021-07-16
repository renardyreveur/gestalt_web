import './style.css'

import * as THREE from 'three'

import { CreateParticles } from './particles.js'
import { CreateOutlines }from './outline.js'


// Preload script: this is the main function that runs
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
  preload();
else
  document.addEventListener("DOMContentLoaded", preload ); 

// Block text selection
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
		this.outlineScene = new THREE.Scene();
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
		this.createParticles = new CreateParticles( this.scene, this.font, this.particles, this.camera, this.renderer, this.container.clientWidth, this.container.clientHeight);
		this.createOutlines = new CreateOutlines( this.outlineScene, this.renderer, this.camera, this.createParticles.hullGeometry )
	}
	
	render() {
		this.createParticles.render()
		
		// Render the scene with the camera
		// this.renderer.render( this.scene, this.camera )

		// this.createOutlines.composer.addPass(new RenderPass( this.renderer, this.camera ))
		this.createOutlines.composer.render()
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


