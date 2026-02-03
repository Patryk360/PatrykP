const canvas = document.getElementById('snake');
const ctx = canvas.getContext('2d');

const grid = 26;
const snakeSize = 20;

let fps = 5;
let myName = "Patryk";
let started = false;
let interval;

let direction = 'right';
let nextDirection = 'right';

let snake = [{x: 0, y: 0}];
let snakeLength = 1;

let xFood = 0;
let yFood = 0;
let multiFood = false;

let point = 0;
let leaderboard = [];
leaderboard.push({name: myName, point: 0});

const eat = new Audio("./js/fun/sound/food.mp3");

const leaderboardF = () => {
    let topHTML = "<tr><th>Name</th><th>Point</th></tr>";
    leaderboard.sort((a,b)=> b.point - a.point);
    for(const player of leaderboard){
        topHTML += `<tr><td>${player.name}</td><td>${player.point}</td></tr>`;
    }
    document.getElementById("leaderboard").innerHTML = topHTML;
}
leaderboardF();

const randomFoodPos = () => {
    const max = Math.floor(canvas.width / grid) - 1;
    xFood = Math.floor(Math.random() * max) * grid;
    yFood = Math.floor(Math.random() * max) * grid;
    for(const part of snake){
        if(part.x === xFood && part.y === yFood){
            randomFoodPos();
            break;
        }
    }
}

const draw = () => {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'yellow';
    ctx.fillRect(xFood, yFood, grid, grid);

    snake.forEach((part, i) => {
        ctx.fillStyle = i === 0 ? 'red' : 'black';
        ctx.fillRect(part.x, part.y, grid, grid);
    });
}

const moveSnake = () => {
    if(!started) return;
    direction = nextDirection;
    let head = {...snake[0]};
    if(direction==='right') head.x += grid;
    if(direction==='left') head.x -= grid;
    if(direction==='up') head.y -= grid;
    if(direction==='down') head.y += grid;
    if(head.x >= canvas.width) head.x = 0;
    if(head.x < 0) head.x = canvas.width - grid;
    if(head.y >= canvas.height) head.y = 0;
    if(head.y < 0) head.y = canvas.height - grid;
    snake.unshift(head);
    if(head.x === xFood && head.y === yFood){
        snakeLength++;
        point += multiFood ? 30 : 10;
        eat.play();
        const leader = leaderboard.find(a => a.name == myName);
        if(leader) leader.point += multiFood ? 30 : 10;
        if(snakeLength === 5) multiFood = true;
        document.getElementById("point").innerText = point;
        leaderboardF();
        randomFoodPos();
    }
    while(snake.length > snakeLength){
        snake.pop();
    }
    for(let i=1;i<snake.length;i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            stop();
            alert("Game Over!");
            return;
        }
    }
    draw();
}

const start = () => {
    if(started) return;
    started = true;
    snake = [{x: 0, y:0}];
    snakeLength = 1;
    point = 0;
    multiFood = false;
    direction = 'right';
    nextDirection = 'right';
    document.getElementById("point").innerText = point;
    randomFoodPos();
    interval = setInterval(moveSnake, 1000/fps);
}

const stop = () => {
    started = false;
    clearInterval(interval);
    snake = [{x:0,y:0}];
    snakeLength = 1;
    point = 0;
    multiFood = false;
    document.getElementById("point").innerText = point;
    draw();
}

const changeName = () => {
    const nameValue = document.getElementById("name").value.trim();
    if(nameValue === "") return;
    myName = nameValue;
    const leader = leaderboard.find(a=>a.name===myName);
    if(!leader) leaderboard.push({name: myName, point: 0});
    document.getElementById("point").innerText = point;
    leaderboardF();
}

document.addEventListener('keydown', (e) => {
    const key = e.key;
    if(!started) return;
    if(key==='w' && direction!=='down') nextDirection='up';
    if(key==='s' && direction!=='up') nextDirection='down';
    if(key==='a' && direction!=='right') nextDirection='left';
    if(key==='d' && direction!=='left') nextDirection='right';
});

draw();