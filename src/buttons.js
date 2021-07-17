import * as THREE from 'three'

import { MeshLine } from './meshline/meshline.js'
import { MeshLineMaterial } from './meshline/material.js'
import { PlaneGeometry } from 'three';


export class CreateButtons{
    constructor ( scene, camera ){
		this.scene = scene;
        this.mouse = new THREE.Vector2();
        this.camera = camera;

        this.raycaster = new THREE.Raycaster();

        this.setup()
        this.bindEvents();

    }

    bindEvents() {
		// Mouse event listeners
		// document.addEventListener("touchstart", this.touch2mouse, true);
		// document.addEventListener("touchmove", this.touch2mouse, true);
		// document.addEventListener("touchend", this.touch2mouse, true);

		// document.addEventListener("deviceorientation", this.deviceorientation, true);

		document.addEventListener( 'mousedown', this.onMouseMove.bind( this ) );
	}

	touch2mouse(e){
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

	onMouseMove( event ) { 
		let x, y;
        x = event.clientX;
        y = event.clientY;

		this.mouse.x = ( x / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( y / window.innerHeight ) * 2 + 1;
		console.log(this.mouse)
	}

    render(){
        // Picking ray(what objects in 3d the mouse is over) update with mouse and camera
        this.raycaster.setFromCamera( this.mouse, this.camera );

        const intersects = this.raycaster.intersectObject( this.EButtonArea );
        if (intersects.length > 0 ){
            console.log(intersects)
        }
    }

    setup(){
        console.log(this.camera.aspect)
        let EButton = new MeshLine();
        let EPoints;
        // if (this.camera.aspect < 0.8){
        //     EPoints = [-50, -45, 0, -10, -45, 0, -10, -60, 0, -50, -60, 0, -50, -45, 0, -51, -45, 0];
        // }else{
            EPoints = [20, 5, 0, 60, 5, 0, 60, -10, 0, 20, -10, 0, 20, 5, 0, 21, 5, 0];
        // }
        EButton.setPoints(EPoints);
        let EPlane = new PlaneGeometry(Math.abs(EPoints[3] - EPoints[0]), Math.abs(EPoints[7] - EPoints[1]));
        EPlane.translate((EPoints[3] + EPoints[0])/2, (EPoints[1] + EPoints[7])/2, 0);
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true } );
		this.EButtonArea = new THREE.Mesh( EPlane, material );
        this.EButtonArea.visible = false;
        this.scene.add(this.EButtonArea)

        let WPButton = new MeshLine();
        let WPPoints;
        // if (this.camera.aspect < 0.8){
        //     WPPoints = [10, -45, 0, 50, -45, 0, 50, -60, 0, 10, -60, 0, 10, -45, 0, 10, -45, 0];
        // }else{
            WPPoints = [20, -15, 0, 60, -15, 0, 60, -30, 0, 20, -30 ,0, 20, -15, 0, 21, -15, 0];
        // }
        WPButton.setPoints(WPPoints);
        let WPPlane = new PlaneGeometry(Math.abs(WPPoints[3] - WPPoints[0]), Math.abs(WPPoints[7] - WPPoints[1]));
        WPPlane.translate((WPPoints[3] + WPPoints[0])/2, (WPPoints[1] + WPPoints[7])/2, 0);
		this.WPButtonArea = new THREE.Mesh( WPPlane, material );
        this.WPButtonArea.visible = false;
        this.scene.add(this.WPButtonArea)


        const Ematerial = new MeshLineMaterial( { color: 0x2a9d8f, lineWidth: 2, sizeAttenuation: 1 } );
        const Bmaterial = new MeshLineMaterial( { color: 0xe76f51, lineWidth: 2, sizeAttenuation: 1 } );

        const EBMesh = new THREE.Mesh(EButton, Ematerial);
        const WBMesh = new THREE.Mesh(WPButton, Bmaterial);

        this.scene.add(EBMesh);
        this.scene.add(WBMesh);

    }
}