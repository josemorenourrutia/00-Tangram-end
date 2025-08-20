import * as THREE from 'three';

import { status } from './main.js';

export const updateSVGTexture = ( svgElement, svgPlaneMaterial ) => {
	// Asegura tamaño grande del SVG
	svgElement.setAttribute( "width", "1000" );
	svgElement.setAttribute( "height", "1000" );
	const svgString = new XMLSerializer().serializeToString( svgElement );
	const svgBlob = new Blob( [svgString], { type: "image/svg+xml;charset=utf-8" } );
	const url = URL.createObjectURL( svgBlob );

	const loader = new THREE.TextureLoader();
	loader.load(
		url,
		( texture ) => {
			texture.needsUpdate = true;
			svgPlaneMaterial.map = texture;
			svgPlaneMaterial.needsUpdate = true;
			URL.revokeObjectURL( url ); // Limpieza
			status.update();
		},
		undefined,
		( err ) => {
			console.error( "Error al cargar textura SVG", err );
		}
	);
};
