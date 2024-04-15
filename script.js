/**  @type {HTMLCanvasElement}*/
// Canvas 1
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//Collision Canvas
const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let count = 1;
let score = 0;
ctx.font = '50px Impact'

let gameOver = false;
const gameOverSound = new Audio();
gameOverSound.src = 'gameOver.wav';

let timeToNextRaven = 0;
let ravenInterval = 700;
let lastTime = 0;


let explosions = [];
class Explosion {
    constructor(x, y, size)
    {
        this.explosionImage = new Image();
        this.explosionImage.src = 'boom.png';
        this.width = 200;
        this.height = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'shoot.mp3';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 50;
        this.markedForDeletion = false;
    }
    update(deltaTime){
        if(this.frame === 0) this.sound.play();

        this.timeSinceLastFrame += deltaTime;
        if(this.timeSinceLastFrame > this.frameInterval)
        {
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5) this.markedForDeletion = true;

        }

    }

    draw()
    {
        ctx.drawImage(this.explosionImage, this.frame * this.width, 0, this.width, this.height, this.x, this.y, this.size, this.size);
    }
}

let ravens = [];
class Raven {
    constructor(){
        this.ravenImage = new Image();
        this.ravenImage.src = "raven.png";
        this.ravenWidth = 271;
        this.ravenHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.3; //range bw 0.4 to 1
        this.width = this.ravenWidth * this.sizeModifier;
        this.height = this.ravenWidth * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 100 + 50;
        this.randomColor = [Math.floor(Math.random() * 255 ), Math.floor(Math.random() * 255 ), Math.floor(Math.random() * 255 )];
        this.color = 'rgb(' + this.randomColor[0] +','+ this.randomColor[1] +','+ this.randomColor[2] +')'

    }
    update(deltaTime){
        if(this.y < 0 || this.y > canvas.height - this.height)
        {
            this.directionY = this.directionY * -1 // reverses the movement    
        }
        
        this.x -= this.directionX;
        this.y += this.directionY;

        // delete raven from canvas
        if (this.x < 0 - this.width) this.markedForDeletion = true;

        // frame control
        this.timeSinceFlap += deltaTime;
        if(this.timeSinceFlap > this.flapInterval)
        {
            this.frame > this.maxFrame ? this.frame = 0 : this.frame++; 
            this.timeSinceFlap = 0;
            
        }
        
        //game Over condition
        if(this.x < 0 - this.width && count == 1 ) {
            document.getElementById('life1').remove();
        };
        if(this.x < 0 - this.width && count == 2 ) {
            document.getElementById('life2').remove();
        };
        if(this.x < 0 - this.width && count == 3 ) {
            document.getElementById('life3').remove();
            gameOver = true;
            gameOverSound.play()
        };
        if(this.x < 0 - this.width ) {
            count++;
        };

    }
    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.ravenImage, this.frame * this.ravenWidth, 0, this.ravenWidth,this.ravenHeight, this.x, this.y, this.width, this.height);
    }
}



function drawScore(){
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 50, 75); //(text, x axis, y axis)
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 55, 80);    
}

function drawGameOver(){
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER!', canvas.width/2, canvas.height/2);
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER!', canvas.width/2 + 5, canvas.height/2 + 5);
}

// //my code for game timer
// let timer;
// let startTime;
// let running = false;
// let min = 0;
// let sec = 0;
// let msec = 0;

// function startTimer(){
//     if (score >= 0){
//         startTime = Date.now();
//         timer = setInterval(updateTime, 200);
//         running = true;
//     }
//     else{
//         clearInterval(timer);
//         running = false;
//         document.getElementById('display').innerHTML = "00 : 00 : 00" ;

//     }
// }

// function updateTime(){
//     msec++;
//     if(msec == 1000){
//         msec = 0;
//         sec++;
//         if(sec == 60){
//             sec = 0;
//             min++;
//         }
//     }
//     document.getElementById('display').innerHTML = formatTime(min) + " : " + formatTime(sec) + " : " + formatTime(msec);
// }

// function formatTime(time){
//     return time < 10 ? '0' + time : time; 
// }

// //my code ends here

window.addEventListener('click', function(e)
{
    console.log(e.x, e.y);
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1); // 1 pixel detection
    console.log(detectPixelColor);
    const pixelColor = detectPixelColor.data;
    ravens.forEach( object => {
        if(pixelColor[0] == object.randomColor[0] && pixelColor[0] == object.randomColor[0] && pixelColor[0] == object.randomColor[0])
        {
            // collision detected
            object.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(object.x, object.y, object.width));
        }
       
    })
   
})

function animate(timeStamp) { //timeStamp is inbult funtion that gives time
    ctx.clearRect(0,0,canvas.width,canvas.height);
    collisionCtx.clearRect(0,0,canvas.width,canvas.height);
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    timeToNextRaven += deltaTime;
    // console.log(deltaTime);
    if(timeToNextRaven > ravenInterval)
    {
        ravens.push(new Raven());
        timeToNextRaven = 0;

        ravens.sort(function (a, b) {
            return a.width - b.width;
        })
        

    }


    drawScore();
    // startTimer();

    [...ravens, ...explosions].forEach(object => object.update(deltaTime));
    [...ravens, ...explosions].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion);
    explosions = explosions.filter(object => !object.markedForDeletion);

    // raven.update()
    // raven.draw();
    // ravenInterval--; // increases frequency of ravens 
    if(gameOver == false) requestAnimationFrame(animate);
    else drawGameOver();

        
}

animate(0);
