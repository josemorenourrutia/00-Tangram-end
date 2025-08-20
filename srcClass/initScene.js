import * as THREE from 'three'

export let camera, scene, renderer, canvas, sizeCamera;

let mouse = new THREE.Vector2();

export const initScene = ( { backgroundColor } ) => {
	const init = ( fn ) => {

		// basic scene setup
		const scene = new THREE.Scene()
		scene.background = new THREE.Color( backgroundColor );

		// Cámara ortográfica para 2D
		canvas = document.getElementById( 'three-canvas' );
		sizeCamera = 3;
		const aspect = canvas.clientWidth / canvas.clientHeight;
		camera = new THREE.OrthographicCamera(
			-sizeCamera * aspect, sizeCamera * aspect, // left, right
			sizeCamera, -sizeCamera,                   // top, bottom
			0.0001, 2000
		);
		camera.position.z = sizeCamera / 2;

		// Renderer
		// canvas = document.getElementById( 'three-canvas' );

		const renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setSize( canvas.clientWidth, canvas.clientHeight );
		canvas.appendChild( renderer.domElement );
		// const renderer = new THREE.WebGLRenderer( { canvas, antialias: true } );
		// renderer.setSize( canvas.clientWidth, canvas.clientHeight, false );
		// camera.aspect = canvas.clientWidth / canvas.clientHeight;


		camera.updateProjectionMatrix();

		window.addEventListener( 'resize', () => {
			const rect = canvas.getBoundingClientRect();

			const aspect = rect.width / rect.height;
			camera.left = -sizeCamera * aspect;
			camera.right = sizeCamera * aspect;
			camera.updateProjectionMatrix();
			// renderer.setSize( canvas.clientWidth, canvas.clientHeight, false );
			renderer.setSize( rect.width, rect.height );
			renderer.render( scene, camera );
		} );

		fn( { scene, camera, renderer } )
	}

	return init
}