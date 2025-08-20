import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';

import { tangram } from './main.js'

export class Piece extends THREE.Mesh {
	constructor ( vertices, color, sizeCircle = 0.09, sizeEdge = 4 ) {

		const shape = new THREE.Shape();
		shape.moveTo( vertices[0][0], vertices[0][1] );
		for ( let i = 1; i < vertices.length; i++ ) {
			shape.lineTo( vertices[i][0], vertices[i][1] );
		}
		shape.closePath();

		// let material = new THREE.MeshBasicMaterial( {
		// 	color: color,
		// 	// side: THREE.DoubleSide,
		// 	// transparent: true,
		// 	// opacity: 0.9,
		// 	// depthWrite: false // Importante para transparencias
		// } );

		// Mesh
		super(
			new THREE.ShapeGeometry( shape ),
			new THREE.MeshBasicMaterial( { color: color } )
		);

		this.color = color;
		this.sizeCircle = sizeCircle;
		this.sizeEdge = sizeEdge;

		this.tangram = tangram;
		tangram.userData.maxOrder += 0.01;
		this.position.z = tangram.userData.maxOrder;
		this.isPiece = true;
		this.vertices = this.geometry.attributes.position.array;
		this.vertices1 = this.geometry.attributes.position;
		this.userData.mesh = this;

		this.buildEdges();
		this.buildPivotRotate();
		this.buildIconRotate();
		this.buildSectors();

		this.updateWorldVertices();

		this.setVisible( false );
	}

	// Edges
	buildEdges () {
		const lineGeometry = new LineGeometry();
		lineGeometry.setPositions( [
			...this.vertices, this.vertices[0], this.vertices[1], 0
		] );

		const lineMaterial = new LineMaterial( {
			color: 0x000000,
			linewidth: this.sizeEdge, // Grosor en píxeles
			resolution: new THREE.Vector2( window.innerWidth, window.innerHeight ), // Necesario
			dashed: false // Opcional: para líneas discontinuas
		} );

		this.edge = new Line2( lineGeometry, lineMaterial );
		this.edge.position.z = 0.0001;
		this.edge.isEdge = true; // Para identificarlas después
		this.edge.userData.mesh = this; // Para identificarlas después
		// this.edge.renderOrder = 1;
		// this.edge.visible = false;
		// this.edge.computeLineDistances(); // Importante para líneas discontinuas
		// this.edge.userData.tangramPiece = mesh; // Para identificarlas después
		this.add( this.edge ); // Bordes como hijo de la malla
	}

	// Pivot rotate
	buildPivotRotate () {
		this.pivotRotate = new THREE.Mesh(
			new THREE.CircleGeometry( this.sizeCircle * 0.8, 32 ),
			new THREE.MeshBasicMaterial( { color: 0x000000 } )//0x778899 } )//0xff3478 } )
		);
		this.pivotRotate.position.z = 0.01;
		this.pivotRotate.isPivotRotate = true;
		this.pivotRotate.visible = true;
		this.pivotRotate.userData.mesh = this; // Para identificarlas después
		// this.pivotRotate.renderOrder = 1;
		this.add( this.pivotRotate ); // ¡Importante: hijo del polígono!
		this.updatePivotRotatePositionIndex( 0 );

	}

	// Icon rotate
	buildIconRotate () {
		this.iconRotate = new THREE.Mesh(
			new THREE.CircleGeometry( this.sizeCircle, 32 ),
			new THREE.MeshBasicMaterial( { color: 0x000000 } )
		);
		this.iconRotate.position.z = 0.01;
		this.iconRotate.isRotateIcon = true;
		this.iconRotate.userData.mesh = this;
		// this.iconRotate.renderOrder = 1;

		const middle = { x: 0, y: 0 }
		for ( let i = 0; i < this.vertices.length; i += 3 ) {
			middle.x += this.vertices[i + 0];
			middle.y += this.vertices[i + 1];
		}

		const nVertices = this.vertices.length / 3;
		this.iconRotate.position.set( middle.x / nVertices, middle.y / nVertices, 0 );
		this.add( this.iconRotate );
	}

	// Sectors
	buildSectors () {
		this.sectors = new THREE.Group();
		this.sectors.position.z = 0.01;
		this.sectors.userData.mesh = this;
		for ( let i = 0; i < this.vertices.length; i += 3 ) {
			const shape = new THREE.Shape();

			// 3. Calcular ángulo actual entre mouse y pivote
			const ii1 = ( i - 3 + this.vertices.length ) % this.vertices.length
			const startAngle = Math.atan2(
				this.vertices[ii1 + 1] - this.vertices[i + 1],
				this.vertices[ii1 + 0] - this.vertices[i + 0]
			);
			const ii2 = ( i + 3 + this.vertices.length ) % this.vertices.length
			let endAngle = Math.atan2(
				this.vertices[ii2 + 1] - this.vertices[i + 1],
				this.vertices[ii2 + 0] - this.vertices[i + 0]
			);
			// if ( angle2 < angle1 ) angle2 += Math.PI

			shape.moveTo( this.vertices[i], this.vertices[i + 1] ); // Centro del círculo

			let radius = 1. * this.sizeEdge / Math.abs( Math.sin( ( endAngle - startAngle ) / 2 ) ) / 80;//0.1  // Radio
			// radius /= camera.position.distanceTo( this.position );

			// 2. Dibujar el sector circular
			shape.absarc(
				this.vertices[i], this.vertices[i + 1], // Centro (x, y)
				radius, // Radio
				startAngle, // Ángulo inicial
				endAngle, // Ángulo final
				false // Sentido horario (false = antihorario)
			);
			shape.lineTo( this.vertices[i], this.vertices[i + 1] ); // Volver al centro para cerrar la forma

			// 3. Convertir a geometría
			const geometry = new THREE.ShapeGeometry( shape );

			// 4. Crear malla y añadir a la escena
			const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide } );
			const sector = new THREE.Mesh( geometry, material );
			sector.isSector = true;
			sector.userData.mesh = this;
			this.sectors.add( sector );
		}
		this.add( this.sectors );

	}

	setRenderOrder ( index, index2 ) {
		this.renderOrder = index;
		this.edge.renderOrder = index2; // Objetos transparentes al final
		this.pivotRotate.renderOrder = index2; // Objetos transparentes al final
		this.iconRotate.renderOrder = index2; // Objetos transparentes al final
		this.sectors.renderOrder = index2; // Objetos transparentes al final

	}

	setVisible ( visible ) {
		this.edge.visible = visible;
		this.pivotRotate.visible = visible;
		this.sectors.visible = visible;
	}

	setSelected () {
		tangram.userData.maxOrder += 0.001;
		this.position.z = tangram.userData.maxOrder;
		this.pivotRotate.visible = false;
		this.edge.visible = true;
	}

	updatePivotRotatePositionIndex ( indexPivotRotate ) {
		this.pivotRotate.position.x = this.vertices[indexPivotRotate + 0];
		this.pivotRotate.position.y = this.vertices[indexPivotRotate + 1];
	}

	updatePivotRotatePositionIndex2 ( indexPivotRotate ) {
		const countVertices = this.vertices.length / 3;
		const indexVertex = ( indexPivotRotate + countVertices ) % ( countVertices );
		this.pivotRotate.position.x = this.vertices[indexVertex + 0];
		this.pivotRotate.position.y = this.vertices[indexVertex + 1];
	}

	updatePivotRotatePosition ( pivotRotate ) {
		this.pivotRotate.position.x = pivotRotate.x;
		this.pivotRotate.position.y = pivotRotate.y;
		this.pivotRotate.updateMatrixWorld( true );
	}

	getClosestVertex ( point ) {
		let closestIndex = 0;
		let minDistance = Infinity;

		for ( let i = 0; i < this.verticesWorld.length; i++ ) {
			const distance = point.distanceTo( this.verticesWorld[i] );
			if ( distance < minDistance ) {
				minDistance = distance;
				closestIndex = i;/// 3;
			}
		}
		this.updatePivotRotatePositionIndex( closestIndex * 3 )
		// return closestIndex;
	}

	addPosition ( worldDelta ) {
		this.position.add( worldDelta );
		// this.updateWorldVertices();
	}

	// rotateAroundWorldPoint ( pivot, angle ) {
	// 	// const point = pivot.position.clone().applyMatrix4( this.matrixWorld );

	// 	const q = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), angle );

	// 	this.position
	// 		.sub( point )
	// 		.applyQuaternion( q )
	// 		.add( point );

	// 	this.quaternion.premultiply( q );

	// 	this.updateWorldVertices();
	// }

	rotateAroundWorldPoint ( point, angle ) {
		const q = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), angle );
		this.position.sub( point );
		this.position.applyQuaternion( q );
		this.position.add( point );
		this.quaternion.premultiply( q );

		this.updateWorldVertices();
	}

	// Rotar alrededor del pivote actual
	rotateAroundPivot ( angle ) {
		const { x, y } = new THREE.Vector3().setFromMatrixPosition( this.pivotRotate.matrixWorld );

		const matrix = new THREE.Matrix4()
			.makeTranslation( x, y, 0 )
			.multiply( new THREE.Matrix4().makeRotationZ( angle ) )
			.multiply( new THREE.Matrix4().makeTranslation( -x, -y, 0 ) );

		this.applyMatrix4( matrix );

		// this.updateWorldVertices();
	}

	// Rotar alrededor del pivote actual
	rotateAroundPivot1 ( angle ) {
		const pivotRotate = new THREE.Vector3().setFromMatrixPosition( this.pivotRotate.matrixWorld );

		const pivotX = pivotRotate.x;
		const pivotY = pivotRotate.y;

		const matrix = new THREE.Matrix4()
			.makeTranslation( pivotX, pivotY, 0 )
			.multiply( new THREE.Matrix4().makeRotationZ( angle ) )
			.multiply( new THREE.Matrix4().makeTranslation( -pivotX, -pivotY, 0 ) );

		this.applyMatrix4( matrix );
	}

	getWorldVertices () { return this.verticesWorld }

	updateWorldVertices () {
		const verts = [];
		const prevPositionZ = this.position.z;
		this.position.z = 0;

		for ( let i = 0; i < this.vertices.length; i += 3 ) {
			const v = new THREE.Vector3( this.vertices[i], this.vertices[i + 1], 0 );
			this.localToWorld( v );
			verts.push( v );
		}

		this.position.z = prevPositionZ;
		this.verticesWorld = verts;
		return verts;
	}

	updateWorldVertices1 () {
		const verts = [];
		const pos = this.geometry.attributes.position;
		const prevPositionZ = this.position.z;
		this.position.z = 0;
		for ( let i = 0; i < pos.count; i++ ) {
			const v = new THREE.Vector3().fromBufferAttribute( pos, i );
			console.log( v )
			v.z = 0;
			console.log( v, this.position )
			this.localToWorld( v );
			verts.push( v );
		}
		this.position.z = prevPositionZ;
		this.verticesWorld = verts;
		return verts;
	}
}
