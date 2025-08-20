import * as THREE from 'three';
// import createTangramPieces from './tangram.js'

const managerPiece = {

	piece: null,
	// currentPivotIndex: 0,
	isRotating: false,

	// init ( scene ) {
	// 	this.piece = createTangramPieces().children[0];
	// 	scene.add( this.piece );
	// },

	// Actualizar posición del pivote (coordenadas locales)
	updatePivotMarkerPosition ( pivotIndex ) {
		const vertices = this.piece.geometry.attributes.position.array;
		const pivotMarker = this.piece.children[0];
		if ( pivotMarker === undefined ) return;

		let currentPivotIndex = pivotIndex * 3;

		console.log( 'pivotMarker', pivotMarker )
		pivotMarker.position.set(
			vertices[currentPivotIndex++],
			vertices[currentPivotIndex],
			// vertices[this.currentPivotIndex * 3],
			// vertices[this.currentPivotIndex * 3 + 1],
			0
		);
	},

	// Rotar alrededor del pivote actual
	rotateAroundPivot ( angle ) {
		const pivotMarker = new THREE.Vector3().setFromMatrixPosition( this.piece.children[0].matrixWorld );

		const pivotX = pivotMarker.x;
		const pivotY = pivotMarker.y;

		const matrix = new THREE.Matrix4()
			.makeTranslation( pivotX, pivotY, 0 )
			.multiply( new THREE.Matrix4().makeRotationZ( angle ) )
			.multiply( new THREE.Matrix4().makeTranslation( -pivotX, -pivotY, 0 ) );

		this.piece.applyMatrix4( matrix );
	},

	// Rotar alrededor del pivote actual - Original
	rotateAroundPivot1 ( angle ) {
		const pivotMarker = new THREE.Vector3().setFromMatrixPosition( this.piece.children[0].matrixWorld );

		const pivotX = pivotMarker.x;
		const pivotY = pivotMarker.y;

		const matrix = new THREE.Matrix4()
			.makeTranslation( pivotX, pivotY, 0 )
			.multiply( new THREE.Matrix4().makeRotationZ( angle ) )
			.multiply( new THREE.Matrix4().makeTranslation( -pivotX, -pivotY, 0 ) );

		this.piece.applyMatrix4( matrix );
	},

	// Detectar vértice más cercano al clic
	getClosestVertex ( point ) {
		const vertices = this.piece.geometry.attributes.position.array;
		let closestIndex = 0;
		let minDistance = Infinity;

		for ( let i = 0; i < vertices.length; i += 3 ) {
			const vertex = new THREE.Vector3( vertices[i], vertices[i + 1], 0 ).applyMatrix4( this.piece.matrixWorld );
			const distance = point.distanceTo( vertex );
			if ( distance < minDistance ) {
				minDistance = distance;
				closestIndex = i / 3;
			}
		}
		return closestIndex;
	},
}

export default managerPiece;
