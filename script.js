const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const questionDiv = document.getElementById('question');
const feedbackDiv = document.getElementById('feedback');
const checkBtn = document.getElementById('checkBtn');
const newBtn = document.getElementById('newBtn');

const size = 500;
const gridMin = -10;
const gridMax = 10;
const cellSize = size / (gridMax - gridMin + 1);
let targetPoint = { x: 0, y: 0 };
let dragPoint = { x: 0, y: 0 };
let dragging = false;

function gridToCanvas(x, y) {
    // Convert grid coordinates to canvas coordinates
    return {
        cx: size / 2 + x * cellSize,
        cy: size / 2 - y * cellSize
    };
}

function drawGrid() {
    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    // Draw grid lines and numbers
    ctx.font = '14px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = gridMin; i <= gridMax; i++) {
        // Vertical grid lines
        ctx.beginPath();
        ctx.moveTo(gridToCanvas(i, gridMin).cx, gridToCanvas(i, gridMin).cy);
        ctx.lineTo(gridToCanvas(i, gridMax).cx, gridToCanvas(i, gridMax).cy);
        ctx.stroke();
        // Horizontal grid lines
        ctx.beginPath();
        ctx.moveTo(gridToCanvas(gridMin, i).cx, gridToCanvas(gridMin, i).cy);
        ctx.lineTo(gridToCanvas(gridMax, i).cx, gridToCanvas(gridMax, i).cy);
        ctx.stroke();
        // X axis numbers (bottom)
        if (i !== 0) {
            ctx.fillText(i, gridToCanvas(i, 0).cx, size / 2 + 20);
        }
        // Y axis numbers (left)
        if (i !== 0) {
            ctx.fillText(i, size / 2 - 20, gridToCanvas(0, i).cy);
        }
    }
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    // x-axis
    ctx.beginPath();
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.stroke();
    // y-axis
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.stroke();
}

function drawPoint(point, color = 'blue') {
    const { cx, cy } = gridToCanvas(point.x, point.y);
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.stroke();
}

function draw() {
    drawGrid();
    drawPoint(dragPoint, 'blue');
}

function randomPoint() {
    return {
        x: Math.floor(Math.random() * (gridMax - gridMin + 1)) + gridMin,
        y: Math.floor(Math.random() * (gridMax - gridMin + 1)) + gridMin
    };
}

function setQuestion() {
    targetPoint = randomPoint();
    dragPoint = { x: 0, y: 0 };
    questionDiv.textContent = `Plot the point (${targetPoint.x}, ${targetPoint.y})`;
    feedbackDiv.textContent = '';
    draw();
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { cx, cy } = gridToCanvas(dragPoint.x, dragPoint.y);
    if (Math.hypot(mx - cx, my - cy) < 15) {
        dragging = true;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    // Snap to nearest integer grid
    let x = Math.round((mx - size / 2) / cellSize);
    let y = Math.round((size / 2 - my) / cellSize);
    x = Math.max(gridMin, Math.min(gridMax, x));
    y = Math.max(gridMin, Math.min(gridMax, y));
    dragPoint = { x, y };
    draw();
});

canvas.addEventListener('mouseup', () => {
    dragging = false;
});

checkBtn.addEventListener('click', () => {
    if (dragPoint.x === targetPoint.x && dragPoint.y === targetPoint.y) {
        feedbackDiv.textContent = 'Correct!';
        feedbackDiv.style.color = '#388e3c';
    } else {
        feedbackDiv.textContent = 'Try again!';
        feedbackDiv.style.color = '#d32f2f';
    }
});

newBtn.addEventListener('click', setQuestion);

setQuestion();
