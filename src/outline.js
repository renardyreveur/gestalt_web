import * as THREE from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';


export class CreateOutlines {
	constructor ( scene, renderer, camera, hullGeometry ){
		this.scene = scene;
		this.renderer = renderer;
		this.camera = camera;
		this.hullGeometry = hullGeometry;

		this.setup();
		// this.bindEvents();
	}

	setup(){
		// Setup an invisible planeArea
		// const geometry = new THREE.PlaneGeometry( this.visibleWidthAtZDepth( 100, this.camera ), this.visibleHeightAtZDepth( 100, this.camera ));
		// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true } );
		// this.planeArea = new THREE.Mesh( geometry, material );
		// this.planeArea.visible = false;
		
		// Create the Text Meshes
		this.createHull();
	}

	bindEvents() {
		// Mouse event listeners
		// document.addEventListener( 'dbclick', this.onMouseDBClick.bind( this ));
		document.addEventListener( 'mousemove', this.onMouseMove.bind( this ) );
		// document.addEventListener( 'touchmove', this.onTouchMove.bind( this ), true);
		// document.addEventListener( 'deviceorientation' , this.onDeviceOrientation.bind(this) );
		// document.addEventListener( 'touchmove', this.onMouseMove.bind( this ));
		// document.addEventListener( 'mouseup', this.onMouseUp.bind( this ) );
	}

	onDeviceOrientation(){
		let x = event.beta;
		let y = event.gamma;
		// if (x >  90) { x =  90};
  		// if (x < -90) { x = -90};
		// x /= 180;
		// y /= 180;

		this.mouse.x = x;
		this.mouse.y = y;
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

	onTouchMove(e){
		var theTouch = e.changedTouches[0];
		mouseEvent.initMouseEvent('mousemove', true, true, window, 1, theTouch.screenX, theTouch.screenY, theTouch.clientX, theTouch.clientY, false, false, false, false, 0, null);
		theTouch.target.dispatchEvent(mouseEvent);
		e.preventDefault();	
	}

	onMouseMove( event ) { 
		let x, y;
		if ( event.changedTouches ) {
			console.log("AAAAA")
			x = event.changedTouches[ 0 ].pageX;
			y = event.changedTouches[ 0 ].pageY;

		} else {
			x = event.clientX;
			y = event.clientY;
		}

		this.mouse.x = ( x / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( y / window.innerHeight ) * 2 + 1;
	}

	render( level ){
		
	}

	createHull(){
		this.hullGeometry.center();
		this.hullGeometry.translate( 0, 0, 0 );
		const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		let hullmesh = new THREE.Mesh(this.hullGeometry, material)
		this.scene.add( hullmesh )
		// hullmesh.visible = false;

		// postprocessing
		let rendererSize = new THREE.Vector2();
		this.renderer.getSize(rendererSize)
		this.composer = new EffectComposer( this.renderer );
		let renderPass = new RenderPass( this.scene, this.camera );
		let outlinePass = new OutlinePass( new THREE.Vector2( rendererSize.x, rendererSize.y ), this.scene, this.camera );
		outlinePass.renderToScreen = true;
		let selectedObjects =[ hullmesh ];
		console.log(selectedObjects)
		outlinePass.selectedObjects = selectedObjects;

		this.composer.addPass( renderPass );
		this.composer.addPass( outlinePass );

		outlinePass.usePatternTexture = false;
		outlinePass.edgeStrength = Number( 10 );
		outlinePass.edgeGlow = Number( 1);
		outlinePass.edgeThickness = Number( 4 );
		outlinePass.pulsePeriod = Number( 1 );
		outlinePass.visibleEdgeColor = new THREE.Color(1, 1, 1);;
		// outlinePass.hiddenEdgeColor.set( "#d81111" );
		// let effectFXAA = new ShaderPass(FXAAShader);
		// effectFXAA.uniforms['resolution'].value.set(1 / rendererSize.x, 1 / rendererSize.y);
		// effectFXAA.renderToScreen = true;
		// this.composer.addPass(effectFXAA);
	}
}

