import * as THREE from 'three';

function pointToSegmentDistance ( P, A, B ) {
	// Vector AB y AP
	const AB = new THREE.Vector3().subVectors( B, A );
	const AP = new THREE.Vector3().subVectors( P, A );

	// Proyección escalar de AP sobre AB
	const abLenSq = AB.dot( AB ); // |AB|^2
	let t = AP.dot( AB ) / abLenSq;

	const t1 = t;
	// Limitar t al rango [0, 1] para quedarse dentro del segmento
	t = Math.max( 0, Math.min( 1, t ) );

	// Punto más cercano Q en el segmento
	const Q = A.clone().addScaledVector( AB, t );
	const Q1 = A.clone().addScaledVector( AB, t1 );

	return { pointS: Q, distance: P.distanceTo( Q ), t, pointR: Q1, distance1: P.distanceTo( Q1 ), t1, distanceA: P.distanceTo( A ), distanceB: P.distanceTo( B ) };
}


function alignSegment ( B1, B2, A1, A2 ) {
	// Vector del segmento fijo
	const vFixed = new THREE.Vector3().subVectors( A2, A1 ).normalize();

	// Vector actual del segmento móvil
	const vMobile = new THREE.Vector3().subVectors( B2, B1 ).normalize();

	// Ángulo entre ellos (0 a π)
	// let angle = Math.acos(THREE.MathUtils.clamp(vMobile.dot(vFixed), -1, 1));
	let angle = Math.acos( Math.clamp( vMobile.dot( vFixed ), -1, 1 ) );

	// Sentido de rotación usando producto cruzado
	const crossZ = vMobile.x * vFixed.y - vMobile.y * vFixed.x;
	if ( crossZ < 0 ) angle = -angle; // si es negativo, girar en sentido contrario

	if ( angle > Math.PI / 2 ) angle += -Math.PI;
	else if ( angle < -Math.PI / 2 ) angle += Math.PI;

	return angle;
}

export function snapPieceToPiece ( movedMesh, fixedMesh, snap = 0.3 ) {
	let movedVerts = movedMesh.getWorldVertices();
	const fixedVerts = fixedMesh.getWorldVertices();

	// let updates = 0;
	let minValue = { distance: Infinity, vertice: -1, firstPoint: undefined, pointS: undefined, v1: undefined, v2: undefined, vTOv: false };
	let firstPoint;

	outerLoop: // nombre de la etiqueta
	for ( let i = 0; i < fixedVerts.length; i++ ) {
		const v1 = fixedVerts[i];
		const v2 = fixedVerts[( i + 1 ) % fixedVerts.length];

		// Vértice a menor distancia    
		for ( let j = 0; j < movedVerts.length; j++ ) {
			firstPoint = movedVerts[j];
			// Estamos en el vertice
			if ( firstPoint.distanceTo( v1 ) < 1.2 * snap ) {
				minValue = { distance: 0, verticeMoved: j, verticeFixed: i, firstPoint, pointS: v1, vTOv: true };
				break outerLoop;
			}
			if ( firstPoint.distanceTo( v2 ) < 1.2 * snap ) {
				minValue = { distance: 0, verticeMoved: j, verticeFixed: ( i + 1 ) % fixedVerts.length, firstPoint, pointS: v2, vTOv: true };
				break outerLoop;
			}
			const { pointS, distance } = pointToSegmentDistance( firstPoint, v1, v2 );
			if ( distance < minValue.distance ) minValue = { distance, verticeMoved: j, verticeFixed: i, firstPoint, pointS, vTOv: false };
		}
	}

	if ( minValue.distance > snap ) return false;

	// updates = 1;
	const delta = new THREE.Vector3().subVectors( minValue.pointS, minValue.firstPoint );
	movedMesh.position.add( delta );

	function alignEdges ( firstPoint, vTri, v1, v2 ) {
		const { distance1 } = pointToSegmentDistance( vTri, v1, v2 );
		if ( distance1 < snap ) {
			const deltaAngle = alignSegment( firstPoint, vTri, v1, v2 );
			// rotateAroundWorldPoint( movedMesh, firstPoint, deltaAngle );
			movedMesh.rotateAroundWorldPoint( firstPoint, deltaAngle );
			// return true;
		}
	}
	for ( let k = 0; k < movedVerts.length; k++ ) { movedVerts[k].add( delta ); }

	const v1 = fixedVerts[minValue.verticeFixed];
	let v2 = fixedVerts[( minValue.verticeFixed + 1 + fixedVerts.length ) % fixedVerts.length];
	{
		const vTri = movedVerts[( minValue.verticeMoved - 1 + movedVerts.length ) % movedVerts.length];
		if ( alignEdges( minValue.firstPoint, vTri, v1, v2 ) ) { /*updates = 2;*/ return true; }
	}
	{
		const vTri = movedVerts[( minValue.verticeMoved + 1 + movedVerts.length ) % movedVerts.length];
		if ( alignEdges( minValue.firstPoint, vTri, v1, v2 ) ) { /*updates = 2;*/ return true; }
	}

	if ( !minValue.vTOv ) return true;

	v2 = fixedVerts[( minValue.verticeFixed - 1 + fixedVerts.length ) % fixedVerts.length];
	{
		const vTri = movedVerts[( minValue.verticeMoved - 1 + movedVerts.length ) % movedVerts.length];
		if ( alignEdges( minValue.firstPoint, vTri, v1, v2 ) ) { /*updates = 2;*/ return true; }
	}
	{
		const vTri = movedVerts[( minValue.verticeMoved + 1 + movedVerts.length ) % movedVerts.length];
		if ( alignEdges( minValue.firstPoint, vTri, v1, v2 ) ) { /*updates = 2;*/ return true; }
	}

	return true; //updates !== 0;
}

// function rotateAroundWorldPoint ( obj, point, angle ) {
// 	const q = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), angle );
// 	obj.position.sub( point );
// 	obj.position.applyQuaternion( q );
// 	obj.position.add( point );
// 	obj.quaternion.premultiply( q );
// }

// function getWorldVertices ( mesh ) {
// 	const verts = [];
// 	const pos = mesh.geometry.attributes.position;
// 	for ( let i = 0; i < pos.count; i++ ) {
// 		const v = new THREE.Vector3().fromBufferAttribute( pos, i );
// 		mesh.localToWorld( v );
// 		verts.push( v );
// 	}
// 	return verts;
// }



