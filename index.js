
let isAnimating = false
let pullDeltaX = 0                                                           // Delta = distancia hasta x punto (Distancia que se arrastra la card) 
const decision_threshold = 100                                                

function startDrag (event) {
    if (isAnimating) return                                                 // Para evitar que la función se ejecute si la animación está activa.
    
    // obtener primer articulo mas cercano que arrastremos
    const actualCard = event.target.closest('article')
    if (!actualCard) return                                                  // Si no hay un articulo, no se ejecuta la función.
    
    // obtener la posicion inicial del mouse                                 // pageX = punto donde apretaste en el eje horizontal de la página, se ve en la consola.
    const startX = event.pageX || event.touches[0].pageX                    // touches[0].pageX = lo mismo pero para dispositivos táctiles.               
   //Console.log(startX);  

    // Para mousedown
    document.addEventListener('mousemove', onMove);                         // mousemove es el evento, onMove es la función que se ejecuta.
    document.addEventListener('mouseup', onEnd);

    // Para touchstart
    document.addEventListener('touchmove', onMove, {passive: true});        // passive: true =  le indicas al navegador que no va a haber una llamada a preventDefault, y el deslizamiento va a ser mas rapido y suave.
    document.addEventListener('touchend', onEnd, {passive: true});

    
    function onMove (event)  {
        
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
        
        //Cambiar opacidad segun la eleccion
        const opacity = Math.abs(pullDeltaX) / 100
        const isRight = pullDeltaX > 0

        const choiceElement = isRight ? actualCard.querySelector('.choice.yes') : actualCard.querySelector('.choice.nope')

        choiceElement.style.opacity = opacity

    }

    function onEnd (event) { 
        //Eliminamos los eventos
        document.removeEventListener('mousemove', onMove)                                  
        document.removeEventListener('mouseup', onEnd)                                      

        document.removeEventListener('touchmove', onMove)                                     
        document.removeEventListener('touchend', onEnd)  
        //console.log('Eventos removidos'); 
        
        //saber si el usuario tomo la decision
        const decisionMade = Math.abs(pullDeltaX) >= decision_threshold                 //  Math.abs = valor absoluto        
       

        if(decisionMade){
            const goRight = pullDeltaX >= 0
            const goLeft = !goRight

            //console.log('Dirección:', goRight ? 'Derecha' : 'Izquierda'); 
            
            //Agregar la clase segun la decision
            actualCard.classList.add(goRight ? 'go-right' : 'go-left')   
            actualCard.addEventListener('transitionend', () => {                       // transitionend = es un evento que ocurre cuando una transición CSS termina.
                actualCard.remove()                                                     
            }, {once: true})                                                           // {once: true} = solo se ejecuta una vez
            
        } else{
            actualCard.classList.add('reset')                                          //mirar css
            actualCard.classList.remove('go-right','go-left')
            //console.log('Reset de la tarjeta'); 

            actualCard.querySelectorAll('.choice').forEach(choice => {
                choice.style.opacity = 0
            })
        }

        // Resetea las variables
        actualCard.addEventListener('transitionend', () => {
            actualCard.removeAttribute('style')
            actualCard.classList.remove('reset')

            pullDeltaX= 0
            isAnimating = false
            //console.log('Tarjeta reseteada y variables limpiadas'); 
        }, {once: true})
        
    }
}



document.addEventListener('mousedown', startDrag)                           // mousedown = se dispara al apretar sobre un elemento
document.addEventListener('touchstart', startDrag, {passive: true})         // touchstart = lo mismo pero para dispositivos tactiles

