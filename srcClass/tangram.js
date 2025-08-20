import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';


// Colores tradicionales del Tangram (puedes personalizarlos)
const colors = {
	largeTriangle1: 0xff4136,  // Rojo
	largeTriangle2: 0x2ecc40,  // Verde
	mediumTriangle: 0x0074d9,  // Azul
	smallTriangle1: 0xffdc00,  // Amarillo
	smallTriangle2: 0xff851b,  // Naranja
	square: 0xb10dc9,         // Morado
	parallelogram: 0x39cccc    // Turquesa
};


export default function createTangramPieces ( sizePieceConst = 30 ) {
	let pieceSize = sizePieceConst;
	const SQRT_2 = Math.sqrt( 2 );
	const piecesDefinition = [
		// Pieza 1: Triángulo grande A (lado 2)
		{ name: 'triángulo grande A', points: [[0, 0], [1, 1], [1, -1]], color: 0xCD0E66 },

		// Pieza 2: Triángulo grande B (lado 2)
		{ name: 'triángulo grande B', points: [[0, 0], [1, 1], [1, -1]], color: 0x0F82F2 },

		// Pieza 3: Triángulo mediano (lado √2 aprox 1.414)
		{ name: 'triángulo mediano', points: [[0, 0], [1, 1], [0, 1]], color: 0x6D3BBF },

		// Pieza 4: Triángulo pequeño A (lado 1)
		{ name: 'triángulo pequeño A', points: [[0, 0], [1 / 2, 1 / 2], [1 / 2, -1 / 2]], color: 0xEB4726 },

		// Pieza 5: Triángulo pequeño B (lado 1)
		{ name: 'triángulo pequeño B', points: [[0, 0], [1 / 2, 1 / 2], [1 / 2, -1 / 2]], color: 0x009EA6 },

		// Pieza 6: Cuadrado (lado 1)
		{ name: 'cuadrado', points: [[0, 0], [SQRT_2 * 1 / 2, 0], [SQRT_2 * 1 / 2, SQRT_2 * 1 / 2], [0, SQRT_2 * 1 / 2]], color: 0x22AB24 },

		// Pieza 7: Paralelogramo (lado 1, base vector (1,0), altura 1, desplazado para paralelogramo)
		{ name: 'paralelogramo', points: [[0, 0], [1, 0], [3 * 1 / 2, 1 / 2], [1 / 2, 1 / 2]], color: 0xFD8C00 }
	];


	const piecesDefinition2 = [
		// Pieza 1: Triángulo grande A (lado 2)
		{ name: 'triángulo grande A', points: [[0, 0], [1, 1], [1, -1]], color: 0xff6666 },

		// Pieza 2: Triángulo grande B (lado 2)
		{ name: 'triángulo grande B', points: [[0, 0], [1, 1], [1, -1]], color: 0x66ccff },

		// Pieza 3: Triángulo mediano (lado √2 aprox 1.414)
		{ name: 'triángulo mediano', points: [[0, 0], [1, 1], [0, 1]], color: 0x66ff66 },

		// Pieza 4: Triángulo pequeño A (lado 1)
		{ name: 'triángulo pequeño A', points: [[0, 0], [1 / 2, 1 / 2], [1 / 2, -1 / 2]], color: 0xffff66 },

		// Pieza 5: Triángulo pequeño B (lado 1)
		{ name: 'triángulo pequeño B', points: [[0, 0], [1 / 2, 1 / 2], [1 / 2, -1 / 2]], color: 0xff66ff },

		// Pieza 6: Cuadrado (lado 1)
		{ name: 'cuadrado', points: [[0, 0], [SQRT_2 * 1 / 2, 0], [SQRT_2 * 1 / 2, SQRT_2 * 1 / 2], [0, SQRT_2 * 1 / 2]], color: 0x66ffff },

		// Pieza 7: Paralelogramo (lado 1, base vector (1,0), altura 1, desplazado para paralelogramo)
		{ name: 'paralelogramo', points: [[0, 0], [1, 0], [3 * 1 / 2, 1 / 2], [1 / 2, 1 / 2]], color: 0xd4a373 }
	];

	// 	const piecesDefinition = [
	// 	// Pieza 1: Triángulo grande A (lado 2)
	// 	{ name: 'triángulo grande A', points: [[0, 0], [1, 1], [1, -1]], color: 0xff6666 },

	// 	// Pieza 2: Triángulo grande B (lado 2)
	// 	{ name: 'triángulo grande B', points: [[0, 0], [1, 1], [1, -1]], color: 0x66ccff },

	// 	// Pieza 3: Triángulo mediano (lado √2 aprox 1.414)
	// 	{ name: 'triángulo mediano', points: [[0, 0], [1, 1], [0, 1]], color: 0x66ff66 },

	// 	// Pieza 4: Cuadrado (lado 1)
	// 	{ name: 'cuadrado', points: [[0, 0], [1 / 2, 1 / 2], [1 / 2, -1 / 2]], color: 0xffff66 },

	// 	// Pieza 5: Triángulo pequeño A (lado 1)
	// 	{ name: 'triángulo pequeño A', points: [[0, 0], [1, 0], [0, 1]], color: 0xff66ff },

	// 	// Pieza 6: Triángulo pequeño B (lado 1)
	// 	{ name: 'triángulo pequeño B', points: [[0, 0], [1, 0], [0, 1]], color: 0x66ffff },

	// 	// Pieza 7: Paralelogramo (lado 1, base vector (1,0), altura 1, desplazado para paralelogramo)
	// 	{ name: 'paralelogramo', points: [[0, 0], [1, 0], [1.5, 1], [0.5, 1]], color: 0xd4a373 }
	// ];


	const pieces = new THREE.Object3D();
	let piece;// piecesDefinition.length
	for ( let i = 0; i < piecesDefinition.length; i++ ) {

		const pieceShape = new THREE.Shape();
		const points = piecesDefinition[i].points
		pieceShape.moveTo( points[0][0], points[0][1] );
		for ( let j = 1; j < points.length; j++ ) {
			const point = points[j];
			pieceShape.lineTo( pieceSize * point[0], pieceSize * point[1] );

		}
		pieceShape.lineTo( points[0][0], points[0][1] );
		piece = createPiece( pieceShape, piecesDefinition[i].color );
		pieces.add( piece );
	}


	return pieces;
}

export function squareTangram ( pieces, pieceSize = 5 ) {
	// console.log( pieces )
	const SQRT_2 = Math.sqrt( 2 );
	// const squareShape = [
	// 	{ index: 0, position: [0, 0], rotation: Math.PI },             // Triángulo grande A en esquina inferior izquierda
	// 	{ index: 1, position: [0, 0], rotation: Math.PI / 2 },   // Triángulo grande B en esquina inferior derecha (rotado 90º)
	// 	{ index: 2, position: [-1 / 2, 0], rotation: Math.PI },       // Triángulo mediano en centro inferior (rotado 180º)
	// 	{ index: 3, position: [1 / 4, 1 / 4], rotation: 0 },             // Triángulo pequeño A arriba derecha
	// 	{ index: 4, position: [0, 0], rotation: -Math.PI / 2 },             // Triángulo pequeño B abajo centro (rotado -90º)
	// 	{ index: 5, position: [0, -SQRT_2 / 4], rotation: Math.PI / 4 },  // Cuadrado en centro
	// 	{ index: 6, position: [-1 / 2, -1 / 2], rotation: 0 }            // Paralelogramo en centro izquierda
	// ];
	const squareShape = [
		{ index: 0, position: [0, 0], rotation: Math.PI },             // Triángulo grande A en esquina inferior izquierda
		{ index: 1, position: [0, 0], rotation: Math.PI / 2 },   // Triángulo grande B en esquina inferior derecha (rotado 90º)
		{ index: 2, position: [-1, 0], rotation: Math.PI },       // Triángulo mediano en centro inferior (rotado 180º)
		{ index: 3, position: [1 / 2, 1 / 2], rotation: 0 },             // Triángulo pequeño A arriba derecha
		{ index: 4, position: [0, 0], rotation: -Math.PI / 2 },             // Triángulo pequeño B abajo centro (rotado -90º)
		{ index: 5, position: [0, -SQRT_2 / 2], rotation: Math.PI / 4 },  // Cuadrado en centro
		{ index: 6, position: [-1, -1], rotation: 0 }            // Paralelogramo en centro izquierda
	];
	// for ( let i = 0; i < pieces.children.length; i++ ) {
	// 	const piece = pieces.children[i];
	// 	piece.rotateZ( squareShape[i].rotation ).translateX( pieceSize * squareShape[i].position[0] ).translateY( pieceSize * squareShape[i].position[1] )
	// }

	// console.log( pieces )
	pieces.children.forEach( ( piece, i ) => {
		piece
			.rotateZ( squareShape[i].rotation )
			.translateX( pieceSize * squareShape[i].position[0] )
			.translateY( pieceSize * squareShape[i].position[1] )
		piece.updateWorldVertices();
	} )
	// console.log( pieces )


}
{
	// Triángulo grande 1 (rojo)
	// const largeTriangle1 = new THREE.Shape();
	// largeTriangle1.moveTo( 0, 0 );
	// largeTriangle1.lineTo( sizePiece, sizePiece );
	// largeTriangle1.lineTo( sizePiece, -sizePiece );
	// largeTriangle1.lineTo( 0, 0 );
	// let piece = createPiece( largeTriangle1, colors.largeTriangle1 );
	// piece.rotateZ( Math.PI );
	// pieces.add( piece );

	// // Triángulo grande 2 (verde)
	// const largeTriangle2 = new THREE.Shape();
	// largeTriangle2.moveTo( 0, 0 );
	// largeTriangle2.lineTo( sizePiece, sizePiece );
	// largeTriangle2.lineTo( sizePiece, -sizePiece );
	// largeTriangle2.lineTo( 0, 0 );
	// piece = createPiece( largeTriangle2, colors.largeTriangle2 );
	// piece.rotateZ( Math.PI / 2 );
	// pieces.add( piece );

	// // Triángulo mediano (azul)
	// const mediumTriangle = new THREE.Shape();
	// mediumTriangle.moveTo( 0, 0 );
	// mediumTriangle.lineTo( sizePiece, sizePiece );
	// mediumTriangle.lineTo( 0, sizePiece );
	// // mediumTriangle.lineTo( sizePiece, 0 );
	// mediumTriangle.lineTo( 0, 0 );
	// piece = createPiece( mediumTriangle, colors.mediumTriangle );
	// piece.rotateZ( Math.PI ).translateX( -sizePieceConst )
	// pieces.add( piece );

	// // Triángulo pequeño 1 (amarillo)
	// sizePiece = sizePieceConst / 2;
	// const smallTriangle1 = new THREE.Shape();
	// smallTriangle1.moveTo( 0, 0 );
	// smallTriangle1.lineTo( sizePiece, sizePiece );
	// smallTriangle1.lineTo( sizePiece, -sizePiece );
	// smallTriangle1.lineTo( 0, 0 );
	// piece = createPiece( smallTriangle1, colors.smallTriangle1 );
	// piece.translateX( sizePiece ).translateY( sizePiece );
	// pieces.add( piece );

	// // Triángulo pequeño 2 (naranja)
	// const smallTriangle2 = new THREE.Shape();
	// smallTriangle2.moveTo( 0, 0 );
	// smallTriangle2.lineTo( sizePiece, sizePiece );
	// smallTriangle2.lineTo( sizePiece, -sizePiece );
	// smallTriangle2.lineTo( 0, 0 );
	// piece = createPiece( smallTriangle2, colors.smallTriangle2 );
	// piece.rotateZ( -Math.PI / 2 )
	// pieces.add( piece );

	// // Cuadrado (morado)
	// sizePiece = sizePieceConst * Math.sqrt( 2 ) / 2;
	// const square = new THREE.Shape();
	// square.moveTo( 0, sizePiece / 1 );
	// square.lineTo( 0, 0 );
	// square.lineTo( -sizePiece / 1, 0 );
	// square.lineTo( -sizePiece / 1, sizePiece / 1 );
	// square.lineTo( 0, sizePiece / 1 );
	// piece = createPiece( square, colors.square );
	// piece.rotateZ( Math.PI / 4 ).translateX( sizePiece ).translateY( -sizePiece );
	// pieces.add( piece );

	// // Paralelogramo (turquesa)
	// sizePiece = sizePieceConst;
	// const parallelogram = new THREE.Shape();
	// parallelogram.moveTo( 0, 0 );
	// parallelogram.lineTo( sizePieceConst, 0 );
	// parallelogram.lineTo( 3 * sizePiece / 2, sizePiece / 2 );
	// parallelogram.lineTo( sizePiece / 2, sizePiece / 2 );
	// parallelogram.lineTo( 0, 0 );
	// piece = createPiece( parallelogram, colors.parallelogram );
	// piece.translateX( -sizePiece ).translateY( -sizePiece );
	// pieces.add( piece );
}
export function createTangramPieces1 () {
	const sizePieceConst = 30;
	let sizePiece = sizePieceConst;
	const pieces = new THREE.Object3D();

	// Triángulo grande 1 (rojo)
	const largeTriangle1 = new THREE.Shape();
	largeTriangle1.moveTo( 0, 0 );
	largeTriangle1.lineTo( -sizePiece, sizePiece );
	largeTriangle1.lineTo( -sizePiece, -sizePiece );
	largeTriangle1.lineTo( 0, 0 );
	pieces.add( createPiece( largeTriangle1, colors.largeTriangle1 ) );

	// Triángulo grande 2 (verde)
	const largeTriangle2 = new THREE.Shape();
	largeTriangle2.moveTo( 0, 0 );
	largeTriangle2.lineTo( sizePiece, sizePiece );
	largeTriangle2.lineTo( sizePiece, -sizePiece );
	largeTriangle2.lineTo( 0, 0 );
	let piece = createPiece( largeTriangle2, colors.largeTriangle2 );
	piece.rotateZ( Math.PI / 2 );
	pieces.add( piece );

	// Triángulo mediano (azul)->Pequeño
	const mediumTriangle = new THREE.Shape();
	mediumTriangle.moveTo( -sizePiece / 2, sizePiece / 2 );
	mediumTriangle.lineTo( 0, sizePiece );
	mediumTriangle.lineTo( 0, 0 );
	mediumTriangle.lineTo( -sizePiece / 2, sizePiece / 2 );
	piece = createPiece( mediumTriangle, colors.mediumTriangle );
	piece.rotateZ( -Math.PI / 2 ).translateX( sizePiece / 2 ).translateY( -sizePiece / 2 );
	pieces.add( piece );
	// pieces.add( createPiece( mediumTriangle, colors.mediumTriangle ) );

	// Triángulo pequeño 1 (amarillo)->Mediano
	const smallTriangle1 = new THREE.Shape();
	smallTriangle1.moveTo( 0, 0 );
	smallTriangle1.lineTo( sizePiece, sizePiece );
	smallTriangle1.lineTo( 0, sizePiece );
	smallTriangle1.lineTo( 0, 0 );
	piece = createPiece( smallTriangle1, colors.smallTriangle1 );
	piece.rotateZ( -Math.PI / 1 ).translateX( -sizePiece / 1 )//.translateY( -sizePiece / 1 );
	pieces.add( piece );
	// pieces.add( createPiece( smallTriangle1, colors.smallTriangle1 ) );

	// Triángulo pequeño 2 (naranja)->Pequeño
	const smallTriangle2 = new THREE.Shape();
	smallTriangle2.moveTo( -sizePiece / 2, sizePiece / 2 );
	smallTriangle2.lineTo( 0, sizePiece );
	smallTriangle2.lineTo( 0, 0 );
	smallTriangle2.lineTo( -sizePiece / 2, sizePiece / 2 );
	piece = createPiece( smallTriangle2, colors.smallTriangle2 );
	piece.rotateZ( 0 * Math.PI / 1 ).translateX( sizePiece / 1 )//.translateY( -sizePiece / 1 );
	pieces.add( piece );
	// pieces.add( createPiece( smallTriangle2, colors.smallTriangle2 ) );

	// Cuadrado (morado)
	sizePiece = sizePieceConst * Math.sqrt( 2 ) / 2;
	const square = new THREE.Shape();
	square.moveTo( 0, sizePiece / 1 );
	square.lineTo( 0, 0 );
	square.lineTo( -sizePiece / 1, 0 );
	square.lineTo( -sizePiece / 1, sizePiece / 1 );
	square.lineTo( 0, sizePiece / 1 );
	piece = createPiece( square, colors.square );
	piece.rotateZ( 1 * Math.PI / 4 ).translateX( sizePiece / 1 ).translateY( -sizePiece / 1 );
	pieces.add( piece );

	// pieces.add( createPiece( square, colors.square ) );

	// Paralelogramo (turquesa)
	sizePiece = sizePieceConst;
	const parallelogram = new THREE.Shape();
	// parallelogram.moveTo( 0, sizePiece );
	// parallelogram.lineTo( sizePiece, sizePiece );
	// parallelogram.lineTo( sizePiece / 2, 2 * sizePiece );
	// parallelogram.lineTo( -sizePiece / 2, 2 * sizePiece );
	// parallelogram.lineTo( 0, sizePiece );
	parallelogram.moveTo( -sizePiece, -sizePiece );
	parallelogram.lineTo( 0, -sizePiece );
	parallelogram.lineTo( sizePiece / 2, -sizePiece / 2 );
	parallelogram.lineTo( -sizePiece / 2, -sizePiece / 2 );
	parallelogram.lineTo( -sizePiece, -sizePiece );
	piece = createPiece( parallelogram, colors.parallelogram );
	// piece.rotateZ( 1 * Math.PI / 3 )//.translateX( sizePiece / 2 )//.translateY( -sizePiece / 1 );
	pieces.add( piece );
	// pieces.add( createPiece( parallelogram, colors.parallelogram ) );

	return pieces;
}

function createPiece ( shape, color ) {
	let geometry = new THREE.ShapeGeometry( shape );
	let material = new THREE.MeshBasicMaterial( {
		color: color,
		side: THREE.DoubleSide,
		// transparent: true,
		// opacity: 0.9,
		// depthWrite: false // Importante para transparencias
	} );
	const mesh = new THREE.Mesh( geometry, material );
	// mesh.renderOrder = -1; // Objetos transparentes al final
	mesh.userData.shape = shape;
	mesh.userData.isTangramPiece = true; // Para identificarlas después
	mesh.userData.tangramPiece = mesh; // Para identificarlas después

	// const geometryPoint = new THREE.BufferGeometry();
	// geometryPoint.setAttribute( 'position', new THREE.Float32BufferAttribute( [0, 0, 0], 3 ) );
	// material = new THREE.PointsMaterial( {
	// 	color: 0xff0000,
	// 	size: 10,
	// 	sizeAttenuation: false
	// } );
	// const pivotMarker = new THREE.Points( geometryPoint, material );

	const pivotMarker = new THREE.Mesh(
		new THREE.CircleGeometry( 0.35, 32 ),
		new THREE.MeshBasicMaterial( { color: 0x000000 } )//0x778899 } )//0xff3478 } )
	);
	pivotMarker.visible = false;
	pivotMarker.userData.isPivotPiece = true; // Para identificarlas después
	pivotMarker.userData.tangramPiece = mesh; // Para identificarlas después

	pivotMarker.isPivot = true;
	// Children[0]. Punto pivote
	mesh.add( pivotMarker ); // ¡Importante: hijo del polígono!
	updatePivotMarkerPosition( mesh )

	// // Extraer bordes
	// // 3. Extraer puntos del contorno para el borde
	// const points = shape.getPoints(); // Obtiene puntos 2D
	// const vertices = points.map( p => new THREE.Vector3( p.x, p.y, 0 ) );

	// // 4. Crear geometría del borde
	// const lineGeometry = new LineGeometry();
	// // lineGeometry.setPositions( vertices.flatMap( v => [v.x, v.y, v.z] ) );

	// // console.log( points )
	// // const verts = [];
	// // points.forEach( p => verts.push( p.x, p.y, 0 ) )
	// // console.log( points.map( v => [v.x, v.y, 0] ) )
	// lineGeometry.setPositions( points.flatMap( p => [p.x, p.y, 0] ) );

	// Extraer bordes
	// 3. Extraer puntos del contorno para el borde
	const points = shape.getPoints(); // Obtiene puntos 2D

	// 4. Crear geometría del borde
	const lineGeometry = new LineGeometry();
	lineGeometry.setPositions( points.flatMap( p => [p.x, p.y, 0] ) );

	// 5. Configurar el material del borde (¡grosor funciona!)
	const lineMaterial = new LineMaterial( {
		color: 0x000000,
		linewidth: 6, // Grosor en píxeles
		resolution: new THREE.Vector2( window.innerWidth, window.innerHeight ), // Necesario
		dashed: false // Opcional: para líneas discontinuas
	} );

	// 6. Crear la línea gruesa
	const border = new Line2( lineGeometry, lineMaterial );
	border.visible = false;
	// border.computeLineDistances(); // Importante para líneas discontinuas
	border.userData.isBorderPiece = true; // Para identificarlas después
	border.userData.tangramPiece = mesh; // Para identificarlas después

	mesh.add( border ); // Bordes como hijo de la malla

	// console.log( mesh )
	// Icono de rotación (círculo negro, hijo)
	const rotateIcon = new THREE.Mesh(
		new THREE.CircleGeometry( 0.35, 32 ),
		new THREE.MeshBasicMaterial( { color: 0x000000 } )
	);

	// function getCentroid ( points ) {
	// 	const sum = points.reduce( ( acc, p ) => acc.add( p ), new THREE.Vector2( 0, 0 ) );
	// 	return sum.multiplyScalar( 1 / points.length );
	// }
	// const middle = getCentroid( mesh )
	const vertex = mesh.geometry.attributes.position;
	const middle = { x: 0, y: 0 }
	for ( let i = 0; i < vertex.count; i++ ) {
		middle.x += vertex.array[i * 3 + 0];
		middle.y += vertex.array[i * 3 + 1];

	}

	rotateIcon.position.set( middle.x / vertex.count, middle.y / vertex.count, 0 );
	rotateIcon.userData.isRotateIcon = true;
	rotateIcon.userData.tangramPiece = mesh;
	mesh.add( rotateIcon );

	return mesh;
}
function createPiece2 ( shape, color ) {
	let geometry = new THREE.ShapeGeometry( shape );
	let material = new THREE.MeshBasicMaterial( {
		color: color,
		side: THREE.DoubleSide,
		transparent: true,
		opacity: 0.8
	} );
	const mesh = new THREE.Mesh( geometry, material );
	mesh.userData.isTangramPiece = true; // Para identificarlas después

	const geometryPoint = new THREE.BufferGeometry();
	geometryPoint.setAttribute( 'position', new THREE.Float32BufferAttribute( [0, 0, 0], 3 ) );
	material = new THREE.PointsMaterial( {
		color: 0xff0000,
		size: 10,
		sizeAttenuation: false
	} );
	const pivotMarker = new THREE.Points( geometryPoint, material );
	pivotMarker.visible = false;

	// Children[0]. Punto pivote
	mesh.add( pivotMarker ); // ¡Importante: hijo del polígono!
	updatePivotMarkerPosition( mesh )

	// Extraer bordes
	// const shapePoints = shape.getPoints(); // devuelve Vector2[]
	// // 3. Extraer puntos del contorno para el borde
	// const points = shape.getPoints(); // Obtiene puntos 2D
	// const vertices = points.map( p => new THREE.Vector3( p.x, p.y, 0 ) );

	// // 4. Configurar el material del borde (¡grosor funciona!)
	// const lineMaterial = new LineMaterial( {
	// 	color: 0xff0000,
	// 	linewidth: 4, // Grosor en píxeles
	// 	resolution: new THREE.Vector2( window.innerWidth, window.innerHeight ), // Necesario
	// 	dashed: false // Opcional: para líneas discontinuas
	// } );

	// // 5. Crear geometría del borde
	// const lineGeometry = new LineGeometry();
	// lineGeometry.setPositions( vertices.flatMap( v => [v.x, v.y, v.z] ) );

	// // 6. Crear la línea gruesa
	// const border = new Line2( lineGeometry, lineMaterial );
	// // border.computeLineDistances(); // Importante para líneas discontinuas

	// mesh.add( border ); // Bordes como hijo de la malla

	// Extraer bordes
	const edges = new THREE.EdgesGeometry( geometry );
	const lineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
	const wireframe = new THREE.LineSegments( edges, lineMaterial );
	// Children[1]. Borde de la figura
	mesh.add( wireframe ); // Bordes como hijo de la malla

	return mesh;
}

function updatePivotMarkerPosition ( polygon ) {
	const vertices = polygon.geometry.attributes.position.array;
	const pivotMarker = polygon.children[0];

	const currentPivotIndex = 0;
	pivotMarker.position.set(
		vertices[currentPivotIndex * 3],
		vertices[currentPivotIndex * 3 + 1],
		0
	);
}

