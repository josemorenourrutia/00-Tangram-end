import { canvas } from "./initScene.js";

import { onMouseDown, onMouseMove, onMouseUp, onMouseDoubleDown } from "./handlers.js";

// Event listeners
export const setupEventListeners = () => {
	canvas.addEventListener( 'mousedown', onMouseDown );
	canvas.addEventListener( 'mousemove', onMouseMove );
	canvas.addEventListener( 'mouseup', onMouseUp );
	canvas.addEventListener( 'dblclick', onMouseDoubleDown );
	// canvas.addEventListener( 'keydown', onKeyDown );
}