document.addEventListener('DOMContentLoaded',()=>{
    const width = 10;
    let squares = Array.from(document.querySelectorAll('.grid div'))
    let timerId;
    const scoreDisplay = document.querySelector('#score');
    const colors = ['yellow','darkorange','red','purple','green','blue'] //will be used to apply colors

    let currentHeadPosition;
    let currentDirection; //can be UP, DOWN, LEFT or RIGHT, stored as a string
    let inputQueue = [];
    let colorIterator; //used to apply colors
    let score;
    let food;
    let snake;
    
    
    

    document.addEventListener('keydown', control);
    const startBtn = document.querySelector('#start-button');
    
    startBtn.addEventListener('click',()=>{
        resetGame();
    });
    
    //RESET FUNCTION
    function resetGame() {
        for(let i = 0;i<squares.length;i++) {
            undraw([i,0]);
        }
        currentHeadPosition = 40;
        currentDirection = 'RIGHT'
        inputQueue = [currentDirection];
        colorIterator = 4;
        snake=[[currentHeadPosition,getNextColor()]];
        draw(snake[0]); // draws the first part of the snake array
        food = generateRandomFood();
        draw(food);
        score = 0;
        scoreDisplay.innerHTML = 'Score: '+score;
        clearInterval(timerId);
        timerId = setInterval(move,1000);
        
        
    }

    //COLOR HANDLING
    function getNextColor() {
        if(colorIterator<colors.length-1)
            colorIterator++;
        else
            colorIterator = 0;
        return colorIterator; 
    }
    
    //EVENTS FOR KEYS
    function control(e){
        //if(nextDirection) {currentDirection=nextDirection; nextDirection = null;} 
        if(e.keyCode == 37) //LEFT
        {
            if(currentDirection != 'RIGHT') {
                currentDirection = 'LEFT';
                inputQueue.push('LEFT');
            }
        }
        else if(e.keyCode == 39) //RIGHT
        {
            if(currentDirection != 'LEFT') {
                currentDirection = 'RIGHT';
                inputQueue.push('RIGHT');
            }
        }
        else if(e.keyCode == 38) //UP
        {
            if(currentDirection != 'DOWN') {
                currentDirection = 'UP';
                inputQueue.push('UP');
                
            }
        }
        else if(e.keyCode == 40) //DOWN
        {
            if(currentDirection != 'UP') {
                currentDirection = 'DOWN';
                inputQueue.push('DOWN');
            }
        }
        console.log(inputQueue);
    }

    //FUNCTION TO DRAW 1 ELEMENT OF TYPE [position,color]
    function draw([position,color]) {
        squares[position].classList.add('snakeBody');
        squares[position].style.backgroundColor=colors[color];
    }

    //FUNCION TO UNDRAW
    function undraw([position,color]) {
        squares[position].classList.remove('snakeBody');
        squares[position].style.backgroundColor='';
    }

    //MOVE
    function move() {
        undraw(snake[snake.length-1]);
        if(inputQueue.length>=1)
            currentDirection= inputQueue.shift();
        switch(currentDirection) {
            case 'UP':
                if(currentHeadPosition<width)    
                    currentHeadPosition+=9*width;
                else
                    currentHeadPosition-=width;
                break;
            case 'DOWN':
                if(currentHeadPosition>=9*width)    
                    currentHeadPosition-=9*width;
                else
                    currentHeadPosition+=width;
                break;
            case 'RIGHT':
                if((currentHeadPosition+1)%(width)==0)    
                    currentHeadPosition-=(width-1);
                else    
                    currentHeadPosition++;
                break;
            case 'LEFT':
                if(currentHeadPosition%(width)==0 )    
                    currentHeadPosition+=(width-1);
                else
                    currentHeadPosition--;
                break;  
            default:
                console.log('case default')
        }
        
        if (isBody([currentHeadPosition,0]))
            gameOver();
                    
        if (food[0]==currentHeadPosition){   //if the current head position matches the food position, food will be attached to snake
            snake = snake.concat([food]);
            food = generateRandomFood();
            draw(food);
            score+=10;
            scoreDisplay.innerHTML = 'Score: '+score;
        }
        for(let i = snake.length-1;i>0;i--)
        {
            snake[i][0]=snake[i-1][0];
            draw(snake[i]);
        }
        snake[0][0]=currentHeadPosition;
        draw(snake[0]);
    }

    function isBody([position,color]) { //checks if a given square index is ocupied by the body
        //variable color is not used in this function
        return snake.some(index=>index[0]==position);
        
    }
    
    function generateRandomFood() { //returns [position,color]
        let randomPosition;
        while(true) {
            randomPosition = Math.floor(Math.random()*squares.length);
            if(!isBody([randomPosition,0]))
                return [randomPosition,getNextColor()];    
        }
    }

    function gameOver(){
        clearInterval(timerId);
        scoreDisplay.innerHTML = 'Game Over! Your score: '+score;
    }
})
    