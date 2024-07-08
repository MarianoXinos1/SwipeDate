
let isAnimating = false
let pullDeltaX = 0                                                          // Delta = distancia hasta x punto (Distancia que se arrastra la card) 

function startDrag (event) {
    if (isAnimating) return                                                 // Para evitar que la función se ejecute si la animación está activa.

    // obtener primer articulo mas cercano que arrastremos
    const actualCard = event.target.closest('article')

    // obtener la posicion inicial del mouse                                 // pageX = punto donde apretaste en el eje horizontal de la página, se ve en la consola.
    const startX = event.pageX || event.touches[0].pageX                    // touches[0].pageX = lo mismo pero para dispositivos táctiles.               
   // console.log(startX);  

    // Para mousedown
    document.addEventListener('mousemove', onMove);                         // mousemove es el evento, onMove es la función que se ejecuta.
    document.addEventListener('mouseup', onEnd);

    // Para touchstart
    document.addEventListener('touchmove', onMove, {passive: true});        // passive: true =  le indicas al navegador que no va a haber una llamada a preventDefault, y el deslizamiento va a ser mas rapido y suave.
    document.addEventListener('touchend', onEnd, {passive: true});

    
function onMove (event) {
    
    //posicion actual del mouse
    const currentX= event.pageX || event.touches[0].pageX

    //distancia recorrio el mouse 
    pullDeltaX = currentX - startX
    //console.log(pullDeltaX)

    //No hay distancia recorrida
    if (pullDeltaX === 0) return

    isAnimating = true

    //Calculando grados de rotacion (15 max grados rotacion card)
    const deg = pullDeltaX / 15                                                          

    // Aplicar la rotacion
    actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`        //tranlate = moverlo hacia la izquierda o derecha
    
    actualCard.style.cursor = 'grabbing'                                               // Cambia el cursor a una manito cerrada
   
}

function onEnd (event) {
    document.removeEventListener('mousemove', onMove)                                  // Elimina el evento mousemove
    document.removeEventListener('mouseup', onEnd)                                      

    document.removeEventListener('touchmove', onMove)                                     
    document.removeEventListener('touchend', onEnd)              
    
    isAnimating = false

    pullDeltaX= 0

    actualCard.style.transform = 'none'

    actualCard.style.cursor = 'grab'                                                   // Cambia el cursor a una manito abierta

}
}




document.addEventListener('mousedown', startDrag)                           // mousedown = se dispara al apretar sobre un elemento
document.addEventListener('touchstart', startDrag, {passive: true})         // touchstart = lo mismo pero para dispositivos tactiles

