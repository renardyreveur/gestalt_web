import * as THREE from 'three'

import { MeshLine } from './meshline/meshline.js'
import { MeshLineMaterial } from './meshline/material.js'
import { PlaneGeometry } from 'three';


export class CreateButtons{
    constructor ( scene, camera, font, container ){
		this.scene = scene;
        this.mouse = new THREE.Vector2();
        this.camera = camera;
        this.font = font;
        this.container = container

        this.raycaster = new THREE.Raycaster();

        this.setup()
        this.bindEvents();

    }

    bindEvents() {
		// Mouse event listeners
		document.addEventListener("touchstart", this.touch2mouse, true);
		document.addEventListener("touchmove", this.touch2mouse, true);
		document.addEventListener("touchend", this.touch2mouse, true);

		document.addEventListener( 'mousemove', this.onMouseMove.bind( this ) );
        document.addEventListener( 'click', this.onClick.bind( this ) );
        // document.addEventListener( 'mouseup', this.onClick.bind( this ) );
    }

	touch2mouse(e){
		var theTouch = e.changedTouches[0];
		var mouseEv;

		switch(e.type)
		{
			case "touchstart": mouseEv="click"; break;  
			case "touchend":   mouseEv="click"; break;
			case "touchmove":  mouseEv="mousemove"; break;
			default: return;
		}

		var mouseEvent = document.createEvent("MouseEvent");
		mouseEvent.initMouseEvent(mouseEv, true, true, window, 1, theTouch.screenX, theTouch.screenY, theTouch.clientX, theTouch.clientY, false, false, false, false, 0, null);
		theTouch.target.dispatchEvent(mouseEvent);

		// e.preventDefault();
	}

	onMouseMove( event ) { 
		let x, y;
        x = event.clientX;
        y = event.clientY;

		this.mouse.x = ( x / this.container.clientWidth ) * 2 - 1;
		this.mouse.y = - ( y / this.container.clientHeight ) * 2 + 1;
	}

    onClick ( event ) {
        let x, y;
        x = event.clientX;
        y = event.clientY;

		this.mouse.x = ( x / this.container.clientWidth ) * 2 - 1;
		this.mouse.y = - ( y / this.container.clientHeight ) * 2 + 1;
        
        if (this.Eintersects.length > 0) {
            this.comingSoon();
        }else if (this.WPintersects.length > 0) {
            window.open("/white_paper/gestalt.pdf", '_blank')
        }
        else{
            this.CSTMesh.visible = false;
            this.EBMesh.visible = true;
            this.ETMesh.visible = true;
        }
    }

    comingSoon(){
        this.EBMesh.visible = false;
        this.ETMesh.visible = false;
        this.CSTMesh.visible = true;
        
        // await new Promise(r => setTimeout(r, 5000));
        // this.CSTMesh.visible = false;
        // this.EBMesh.visible = true;
        // this.ETMesh.visible = true;
    }

    render(){
        // Picking ray(what objects in 3d the mouse is over) update with mouse and camera
        this.raycaster.setFromCamera( this.mouse, this.camera );

        this.Eintersects = this.raycaster.intersectObject( this.EButtonArea );
        this.WPintersects = this.raycaster.intersectObject( this.WPButtonArea );
        
        if (this.Eintersects.length > 0 ){
            this.EBMesh.position.x = 3.8;
            this.ETMesh.position.x = 3.8;
            this.EBMesh.scale.set(0.9, 0.9, 1.3);
            this.ETMesh.scale.set(0.9, 0.9, 1.3);
            document.body.style.cursor = 'pointer';
        }else if ( this.WPintersects.length > 0 ){
            this.WBMesh.position.x = 3.8;
            this.WBMesh.position.y = -2.5;
            this.WTMesh.position.x = 3.8;
            this.WTMesh.position.y = -2.5;
            this.WBMesh.scale.set(0.9, 0.9, 1.3);
            this.WTMesh.scale.set(0.9, 0.9, 1.3);
            document.body.style.cursor = 'pointer';
        }else{
            this.EBMesh.scale.set(1, 1, 1);
            this.EBMesh.position.x = 0;
            this.ETMesh.scale.set(1, 1, 1);
            this.ETMesh.position.x = 0;

            this.WBMesh.scale.set(1, 1, 1);
            this.WBMesh.position.x = 0;
            this.WBMesh.position.y = 0;
            this.WTMesh.scale.set(1, 1, 1);
            this.WTMesh.position.x = 0;
            this.WTMesh.position.y = 0;
            document.body.style.cursor = 'default';
        }
    }

    setup(){
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
            WPPoints = [20, -20, 0, 60, -20, 0, 60, -35, 0, 20, -35 ,0, 20, -20, 0, 21, -20, 0];
        // }
        WPButton.setPoints(WPPoints);
        let WPPlane = new PlaneGeometry(Math.abs(WPPoints[3] - WPPoints[0]), Math.abs(WPPoints[7] - WPPoints[1]));
        WPPlane.translate((WPPoints[3] + WPPoints[0])/2, (WPPoints[1] + WPPoints[7])/2, 0);
		this.WPButtonArea = new THREE.Mesh( WPPlane, material );
        this.WPButtonArea.visible = false;
        this.scene.add(this.WPButtonArea)


        const Ematerial = new MeshLineMaterial( { color: 0x2a9d8f, lineWidth: 2, sizeAttenuation: 1 } );
        const Bmaterial = new MeshLineMaterial( { color: 0xe76f51, lineWidth: 2, sizeAttenuation: 1 } );
        
        this.EBMesh = new THREE.Mesh(EButton, Ematerial);
        this.WBMesh = new THREE.Mesh(WPButton, Bmaterial);

        // Write Text on the buttons
		let ETShape = this.font.generateShapes( "Enter", 10 );
        let WTShape = this.font.generateShapes( "White Paper", 6 );
        let CSTShape = this.font.generateShapes( "Coming Soon!", 8);

		let ETGeom = new THREE.ShapeGeometry( ETShape );
        ETGeom.computeBoundingBox();
        const ETx = EPoints[0] + ((EPoints[3] - EPoints[0]) - (ETGeom.boundingBox.max.x-ETGeom.boundingBox.min.x))/2
        const ETy = EPoints[1] + ((EPoints[7] - EPoints[1]) - (ETGeom.boundingBox.max.y-ETGeom.boundingBox.min.y))/2
        ETGeom.translate( ETx, ETy, 0)

        let CSTGeom = new THREE.ShapeGeometry( CSTShape );
        CSTGeom.computeBoundingBox();
        CSTGeom.translate( ETx-10, ETy, 0)

        let WTGeom = new THREE.ShapeGeometry( WTShape );
        WTGeom.computeBoundingBox();
        const WTx = WPPoints[0] + ((WPPoints[3] - WPPoints[0]) - (WTGeom.boundingBox.max.x-WTGeom.boundingBox.min.x))/2
        const WTy = WPPoints[1] + ((WPPoints[7] - WPPoints[1]) - (WTGeom.boundingBox.max.y-WTGeom.boundingBox.min.y))/2
        WTGeom.translate(WTx, WTy, 0)
        
        let ETMat = new THREE.MeshBasicMaterial( { color: 0xe9c46a } );
        let WTMat = new THREE.MeshBasicMaterial({ color: 0xe9c46a } );
        let CSTMat = new THREE.MeshBasicMaterial({ color: 0x264653 } );

        this.ETMesh = new THREE.Mesh(ETGeom, ETMat);
        this.WTMesh = new THREE.Mesh(WTGeom, WTMat);
        this.CSTMesh = new THREE.Mesh(CSTGeom, CSTMat);
        this.CSTMesh.visible = false;
        
        this.scene.add(this.CSTMesh);
        this.scene.add(this.ETMesh)
        this.scene.add(this.WTMesh)


        this.scene.add(this.EBMesh);
        this.scene.add(this.WBMesh);

    }
}