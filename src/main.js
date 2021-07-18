//Dearest Diana

import './style.css'

import * as THREE from 'three'

import { CreateParticles } from './particles.js'
import { CreateOutlines }from './outline.js'
import { CreateButtons } from './buttons.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import p1 from './assets/textures/p1.png'
import p2 from './assets/textures/p2.png'
import p3 from './assets/textures/p3.png'

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
	const pt1 = new THREE.TextureLoader( manager ).load( p1 );
	const pt2 = new THREE.TextureLoader( manager ).load( p2 );
	const pt3 = new THREE.TextureLoader( manager ).load( p3 );
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
	constructor( font, particle_textures ){
		this.font = font;
		this.particle_textures = particle_textures;

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
		this.camera.fov = (this.camera.aspect < 0.8) ? Math.max(2 * Math.atan( ( 100 / this.camera.aspect ) / ( 2 * 100 ) ) * ( 180 / Math.PI )*1.2, 85) : 85;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
		this.composer.setSize( this.container.clientWidth, this.container.clientHeight );
		this.bloomPass.setSize( this.container.clientWidth, this.container.clientHeight );
	}

	setup(){ 
		// Main particles effect rendering setup
		console.log("SETUP!")
		this.createParticles = new CreateParticles( this.scene, this.font, this.particle_textures, this.camera, this.renderer, this.container);
		this.createOutlines = new CreateOutlines( this.scene, this.bloomPass, this.createParticles.hullGeometry )
		this.createButtons = new CreateButtons( this.scene, this.camera, this.font, this.container );
	}
	
	render() {
		// Particel Movement logic
		this.createParticles.render()
		this.createButtons.render()

		// this.is.dayeon.hi()
		
		// Render the scene with the camera
		this.composer.render()
	}
	

	createCamera() {
		// Perspective Camera
		let aspect = this.container.clientWidth /  this.container.clientHeight
		let fov = (aspect < 0.8) ? Math.max(2 * Math.atan( ( 100 / aspect ) / ( 2 * 100 ) ) * ( 180 / Math.PI )*1.2, 85) : 85;
		this.camera = new THREE.PerspectiveCamera( fov, aspect, 1, 500 );
		this.camera.position.set( 0, 0, 100 );
	
	}
	
	createRenderer() {
		// Renderer
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.toneMapping = THREE.ReinhardToneMapping;
		this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );

		this.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2));

		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.container.appendChild( this.renderer.domElement );

		this.renderer.setAnimationLoop(() => { this.render() })


		// Effect Composer
		this.composer = new EffectComposer( this.renderer );//, renderTarget );
		this.composer.addPass( new RenderPass( this.scene, this.camera ) );
		// Unreal Bloom pass.
		this.bloomPass = new UnrealBloomPass( new THREE.Vector2( this.container.clientWidth, this.container.clientHeight ), 1.5, 0.4, 0.85 );
		this.composer.addPass(this.bloomPass);
	}
}


