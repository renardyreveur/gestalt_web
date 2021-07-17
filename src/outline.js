import * as THREE from 'three'
import { MeshLine } from './meshline/meshline.js'
import { MeshLineMaterial } from './meshline/material.js'


export class CreateOutlines {
	constructor ( scene, bloomPass, hullGeometry ){
		this.scene = scene;
		this.bloomPass = bloomPass;

		this.hullGeometry = hullGeometry;

		this.scales = [1.2, 1.5, 1.8];
		this.depth = [-1, -10, -20];
		this.colors = [ 0x2a9d8f, 0xe76f51, 0xe9c46a,]

		this.createHull();
	}

	createHull(){
		this.hullGeometry.computeBoundingBox();
		this.hullGeometry.translate(3, -1, 0);
		const yMid = (this.hullGeometry.boundingBox.max.y - this.hullGeometry.boundingBox.min.y)/3.3;

		const hullmeshes = [];
		for(let i =0; i < this.scales.length; i++){
			const material = new MeshLineMaterial( { color: this.colors[i], lineWidth: 2, sizeAttenuation: 1 } );

			const hullLine = new MeshLine();
			hullLine.setGeometry(this.hullGeometry)

			const hullmesh = new THREE.Mesh(hullLine, material);
			hullmesh.scale.set( i < 2 ? this.scales[i] : 1.5 , this.scales[i]*1.15, 1 );
			
			let box = new THREE.Box3().setFromObject( hullmesh );
			hullmesh.position.x = - 0.5 * ( box.max.x - box.min.x );
			hullmesh.position.y = yMid;
			hullmesh.position.z = this.depth[i];
			hullmeshes.push( hullmesh );
			this.scene.add( hullmesh );
		}
		
		this.bloomPass.selectedObjects = hullmeshes;
		this.bloomPass.threshold = Number( 0 );
		this.bloomPass.strength = Number( 0.4 );
		this.bloomPass.radius = Number( 0.05 );
	}
}

