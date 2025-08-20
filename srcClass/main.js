import * as THREE from 'three'

import { initScene } from './initScene.js';
import { Piece } from './Piece.js';
import { squareTangram } from './tangram.js'

// import { sizeCamera } from './initScene.js'

import { setupEventListeners } from './listeners.js'

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

const props = {
  backgroundColor: 0xf0f0f0,
}

if ( !Math.clamp ) {
  Math.clamp = ( value, min, max ) => value < min ? min : ( value > max ? max : value );
}

export const status = { update: undefined, material: null }
export const tangram = new THREE.Object3D();
initScene( props )( ( { scene, camera, renderer } ) => {

  status.update = () => renderer.render( scene, camera )
  const geometry = new THREE.PlaneGeometry( 9, 9 ); // ajusta tamaño
  status.material = new THREE.MeshBasicMaterial( { opacity: 0.2, transparent: true } );
  const plane = new THREE.Mesh( geometry, status.material );
  scene.add( plane );

  const scalePiece = 1.5;
  const scalePlane = scalePiece / 2;
  plane.position.z = -1000; // lo colocas detrás de tus piezas
  plane.scale.set( scalePlane, scalePlane, 1 );

  tangram.userData.maxOrder = -999;
  tangram.isTangram = true;

  for ( let i = 0; i < piecesDefinition.length; i++ ) {
    const pieceDefinition = piecesDefinition[i]
    const piece = new Piece( pieceDefinition.points, pieceDefinition.color );

    piece.scale.set( scalePiece, scalePiece, 1 );

    tangram.add( piece )
  }

  scene.add( tangram );

  setupEventListeners();

  squareTangram( tangram, scalePiece );

  status.update();

  // function animate () {

  //   // if ( !status.update ) return;
  //   requestAnimationFrame( animate )
  //   renderer.render( scene, camera )
  //   // status.update = false;

  // }
  // animate()

} )