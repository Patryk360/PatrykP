"use strict";

const canvas = document.getElementById('snake');
const ctx = canvas.getContext('2d');

const grid = 26;

let fps = 5;
let myName = localStorage.getItem('snakeNick') || "LoL";
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

const eat = new Audio("./js/fun/sound/food.mp3");

const updateLeaderboard = async () => {
    try {
        const response = await fetch('/snake/players');
        const players = await response.json();
        
        const tbody = document.getElementById('leaderboard');
        if (!tbody) return;

        let htmlContent = ''; 
        players.sort((a, b) => b.score - a.score).slice(0, 10).forEach((p, index) => {
                htmlContent += `
                    <tr>
                        <td style="width: 15%">${index + 1}</td>
                        <td style="width: 55%" class="text-truncate fw-bold text-info">${p.username}</td>
                        <td style="width: 30%" class="text-end text-success fw-bold">${p.score.toLocaleString()}</td>
                    </tr>`;
            });
        
        tbody.innerHTML = htmlContent;
    } catch (err) {
        console.error("Błąd aktualizacji rankingu:", err);
    }
};

const stopAndSave = async () => {
    stop();

    const scoreToSend = point;
    const nickToSend = myName;

    await fetch('/snake/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: nickToSend, score: scoreToSend })
    });

    updateLeaderboard();
};

const changeName = () => {
    const input = document.getElementById("name");
    const nameValue = input.value.trim();
    if (nameValue === "") return;
    
    myName = nameValue;
    localStorage.setItem('snakeNick', myName);
    alert("Nick został zmieniony!");
    updateLeaderboard();
};

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
};

const draw = () => {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'yellow';
    ctx.fillRect(xFood, yFood, grid, grid);

    snake.forEach((part, i) => {
        ctx.fillStyle = i === 0 ? 'red' : 'black';
        ctx.fillRect(part.x, part.y, grid, grid);
    });
};

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
        point += multiFood ? 10 : 1;
        if(eat.readyState >= 2) eat.play();
        
        if(snakeLength === 20) multiFood = true;
        document.getElementById("point").innerText = point;
        randomFoodPos();
    }

    while(snake.length > snakeLength) snake.pop();

    for(let i=1; i<snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            alert("Game Over! Wynik: " + point);
            stopAndSave();
            return;
        }
    }
    draw();
};

const start = () => {
    if(started) return;
    document.getElementById('snake').scrollIntoView({ behavior: 'smooth', block: 'center' });
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
};

const stop = () => {
    started = false;
    clearInterval(interval);
    snake = [{x: 0, y: 0}]; 
    snakeLength = 1;
    document.getElementById("point").innerText = point;
    draw();
};

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if(!started) return;
    if((key==='w') && direction!=='down') nextDirection='up';
    if((key==='s') && direction!=='up') nextDirection='down';
    if((key==='a') && direction!=='right') nextDirection='left';
    if((key==='d') && direction!=='left') nextDirection='right';
});

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById("name");
    if(input) input.value = myName;
    updateLeaderboard();
    setInterval(updateLeaderboard, 10000);
});

draw();