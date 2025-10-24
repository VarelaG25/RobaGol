import './style.css';
import $ from 'jquery';
import initScene from './modules/scene/scene.js';

// Insertar un contenedor para la escena
$('body').append('<div id="app"></div>');

// Inicializar la escena dentro del div
initScene($('#app')[0]);
