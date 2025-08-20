import * as THREE from 'three';
import { camera, canvas } from './initScene.js';
// import managerPiece from './managerPiece.js'
// import managerTangram from './managerTangram.js'

import { tangram } from './main.js'
import { tan } from 'three/src/nodes/TSL.js';

import { snapPieceToPiece } from './managerPiece.js'

import { status } from './main.js';

let initialAngle = 0;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let mouseStart = new THREE.Vector2();
let currentPiece;
export let previousMousePosition = new THREE.Vector2();
let plane = new THREE.Mesh(
	new THREE.PlaneGeometry( 1000, 1000 ),
	new THREE.MeshBasicMaterial( { visible: false } )
);
let isDragging = false;
export let isRotating = false;

function getMouseEvent ( event, canvas ) {
	const rect = canvas.getBoundingClientRect();

	mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
	mouse.y = -( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
}

function getMouseCoord ( x, y, canvas ) {
	const rect = canvas.getBoundingClientRect();

	mouse.x = ( ( x - rect.left ) / rect.width ) * 2 - 1;
	mouse.y = -( ( y - rect.top ) / rect.height ) * 2 + 1;
}

function getMouseWorldPosition ( clientX, clientY ) {

	getMouseCoord( clientX, clientY, canvas )

	raycaster.setFromCamera( mouse, camera );
	const intersects = raycaster.intersectObject( plane );
	return intersects[0]?.point || new THREE.Vector3();
}

function getMouseWorldPositionEvent ( event ) {

	getMouseEvent( event, canvas )

	raycaster.setFromCamera( mouse, camera );
	const intersects = raycaster.intersectObject( plane );
	return intersects[0]?.point || new THREE.Vector3();
}

export function isRotate ( value ) { isRotating = value }

export function onMouseDoubleDown ( event ) {
	getMouseEvent( event, canvas );

	mouseStart.set( event.clientX, event.clientY );
	previousMousePosition.set( event.clientX, event.clientY ); // Guardar posición inicial

	raycaster.setFromCamera( mouse, camera );
	const intersects = raycaster.intersectObject( tangram );

	if ( intersects.length === 0 ) return;

	const intersectObject = intersects[0].object;
	currentPiece = intersectObject.userData.mesh;
	currentPiece.setSelected()
	currentPiece.getClosestVertex( intersects[0].point );
	currentPiece.setVisible( true );

	status.update();
}

export function onMouseDown ( event ) {
	currentPiece?.setVisible( false );
	getMouseEvent( event, canvas );

	mouseStart.set( event.clientX, event.clientY );
	previousMousePosition.set( event.clientX, event.clientY ); // Guardar posición inicial
	raycaster.setFromCamera( mouse, camera );

	// intersectObject
	const intersects = raycaster.intersectObject( tangram );

	if ( intersects.length === 0 ) return;

	// let intersectObject;
	// let maxValue = { index: 0, mesh: intersects[0].object };
	// for ( let i = 1; i < intersects.length; i++ ) {
	// 	if ( intersects[i].object.isRotateIcon && maxValue.mesh === intersects[i].object.userData.mesh ) {
	// 		maxValue = { index: i, mesh: intersects[i].object };
	// 	}
	// }

	// intersectObject = intersects[maxValue.index].object;


	let intersectObject = intersects[0].object;
	// console.log( intersects )
	for ( let i = 1; i < intersects.length; i++ ) {
		if ( intersects[i].object.isRotateIcon && intersectObject === intersects[i].object.userData.mesh ) {
			intersectObject = intersects[i].object;
		}
	}

	if ( intersectObject.isRotateIcon ) isRotating = true;

	currentPiece = intersectObject.userData.mesh;
	currentPiece.setSelected()

	if ( event.shiftKey ) { // Cambiar pivote con Shift + Clic
		currentPiece.getClosestVertex( intersects[0].point );
		currentPiece.setVisible( true );
	} else {
		isDragging = true;
	}
	if ( isRotating ) {
		currentPiece.setVisible( true );
		const mouseWorldPos = getMouseWorldPositionEvent( event );
		const pivotWorldPos = new THREE.Vector3().setFromMatrixPosition( currentPiece.pivotRotate.matrixWorld );
		initialAngle = Math.atan2(
			mouseWorldPos.y - pivotWorldPos.y,
			mouseWorldPos.x - pivotWorldPos.x
		);
		initialAngle = Math.round( initialAngle / ( Math.PI / 60 ) ) * Math.PI / 60

	}
	status.update();

}

export const onMouseMove = ( event ) => {
	if ( !isDragging ) return;

	const mouseEnd = new THREE.Vector2( event.clientX, event.clientY );

	if ( isRotating ) {
		// // Rotación (igual que antes)
		// 1. Obtener posición del mouse en coordenadas del mundo
		const mouseWorldPos = getMouseWorldPositionEvent( event );

		// 2. Obtener posición del pivote en el mundo
		const pivotWorldPos = new THREE.Vector3().setFromMatrixPosition( currentPiece.pivotRotate.matrixWorld );

		// 3. Calcular ángulo actual entre mouse y pivote
		let currentAngle = Math.atan2(
			mouseWorldPos.y - pivotWorldPos.y,
			mouseWorldPos.x - pivotWorldPos.x
		);
		currentAngle = Math.round( currentAngle / ( Math.PI / 60 ) ) * Math.PI / 60

		// 4. Rotar la figura según la diferencia de ángulos
		currentPiece.rotateAroundPivot( currentAngle - initialAngle );
		// currentPiece.rotateAroundWorldPoint( currentAngle - initialAngle )

		// 5. Actualizar ángulo inicial para el siguiente frame
		initialAngle = currentAngle;
	} else {
		// Traslación: convertir desplazamiento del mouse a coordenadas del mundo
		const deltaX = mouseEnd.x - previousMousePosition.x;
		const deltaY = mouseEnd.y - previousMousePosition.y;

		// Convertir desplazamiento en píxeles a unidades de mundo
		const worldDelta = new THREE.Vector3(
			deltaX * ( camera.right - camera.left ) / canvas.clientWidth,
			-deltaY * ( camera.top - camera.bottom ) / canvas.clientHeight,
			0
		);
		currentPiece.addPosition( worldDelta );//position.add( worldDelta );
		mouseStart.set( event.clientX, event.clientY );
	}

	previousMousePosition.set( event.clientX, event.clientY ); // Actualizar posición anterior
	status.update();

}

export function onMouseUp ( event ) {
	if ( isDragging ) {
		currentPiece.updateWorldVertices();
		for ( let i = 0; i < tangram.children.length; i++ ) {
			if ( currentPiece.uuid === tangram.children[i].uuid ) continue;
			const update = snapPieceToPiece( currentPiece, tangram.children[i], 0.3 );
			if ( update ) break
		}
	}

	isDragging = false; isRotating = false;
	currentPiece?.setVisible( false );
	status.update();
}
// export function onKeyDown ( event ) { }

