const canvas1 = document.querySelector('#canvas');
const ctx = canvas1.getContext('2d');
canvas1.width = window.innerWidth;
canvas1.height = window.innerHeight;
let particleArray = [];

//mouse1
let mouse1 = {
    x: null,
    y: null,
    radius: 20
}

window.addEventListener('mousemove', event => {
    mouse1.x = event.x + canvas1.clientLeft/2;
    mouse1.y = event.y + canvas1.clientTop/2;
});
function drawImage() {
    let imageWidth = png.width;
    let imageHeight = png.height;
    const data = ctx.getImageData( 0, 0, imageWidth, imageHeight);
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);

    class Particle {
        constructor(x, y, color, size) {
            this.x = x + canvas1.width/2 - png.width * 2,
                this.y = y + canvas1.height/4 - png.height *2,
                this.color = color,
                this.size = 2,
                this.baseX = x + canvas1.width/2 - png.width * 2,
                this.baseY = y + canvas1.height/4 - png.height * 2,
                this.density = (Math.random() * 10) + 2;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            ctx.fillStyle = this.color;

            // collision detection
            let dx = mouse1.x - this.x;
            let dy = mouse1.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            //max distance, past that the force will be 0
            const maxDistance = 100;
            let force = (maxDistance - distance) / maxDistance;
            if (force < 0) force = 0;

            let directionX = (forceDirectionX * force * this.density * 0.6);
            let directionY = (forceDirectionY * force * this.density * 0.6);

            if (distance < mouse1.radius + this.size) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if(this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx/20;
                } if (this.y !== this.baseY){
                    let dy = this.y - this.baseY;
                    this.y -= dy/20;
                }
            }
            this.draw();
        }
    }
    function init() {
        particleArray = [];

        for (let y = 0, y2 = data.height; y < y2; y++) {
            for (let x = 0, x2 = data.width; x < x2; x++){
                if(data.data[(y * 4 * data.width) + ( x * 4) + 3] > 128) {
                    let positionX = x;
                    let positionY = y;
                    let color = "rgb(" + data.data[(y * 4 * data.width) + (x * 4)] + "," +
                        data.data[(y * 4 * data.width) + (x * 4) + 1] + "," +
                        data.data[(y * 4 * data.width) + (x * 4) + 2] + ")";
                    particleArray.push(new Particle(positionX * 4, positionY * 4, color));
                }
            }
        }
    }
    function  animate() {
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0, 0, 0, .1)';
        ctx.fillRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].update();
        }
    }
    init();
    animate();

    window.addEventListener('resize', () => {
        canvas1.width = innerWidth;
        canvas1.height = innerHeight;
        init();
    })
}

const png = new Image();
png.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI0IiBoZWlnaHQ9IjE3IiB2aWV3Qm94PSIwIDAgMTI0IDE3IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMCAzLjA5NFYyLjFIOC4zMTZWMy45MDZMNi40ODkgMy42NTRWMy4wOTRIMi44N1Y2LjAwNkg2LjQ4OVY1LjQ0Nkw4LjMxNiA1LjE5NFY3SDEuMDQzVjMuMDk0SDBaTTkuNTczMDUgN1YyLjFIMTYuODQ2VjdIOS41NzMwNVpNMTEuNCA2LjAwNkgxNS4wMTlWMy4wOTRIMTEuNFY2LjAwNlpNMTcuNTQ3OSA2LjA1NVY0LjgwMkwxOC41OTA5IDQuNTIyVjIuMUgyMC40MTc5VjQuMDI1TDIzLjk5NDkgMy4wNTlWMi4xSDI1LjgyMTlWMy44MjJMMjMuMDAwOSA0LjU4NUwyNC42NTI5IDUuOTVIMjUuODYzOVY3SDIzLjU2NzlMMjEuMjY0OSA1LjA0N0wyMC40MTc5IDUuMjc4VjdIMTguNTkwOVY1Ljc3NUwxNy41NDc5IDYuMDU1Wk0yNy4wNTI1IDdWMi4xSDM0LjMyNTVWN0gyNy4wNTI1Wk0yOC44Nzk1IDYuMDA2SDMyLjQ5ODVWMy4wOTRIMjguODc5NVY2LjAwNlpNMzUuMDk3MyA3TDM2LjgwNTMgMy4wOTRIMzUuOTM3M1YyLjFINDAuODAyM0w0Mi45MzAzIDdINDEuMDQwM0wzOS4zMzIzIDMuMDk0SDM4LjcwMjNMMzYuOTk0MyA3SDM1LjA5NzNaTTQzLjYyOTcgN1YyLjFINTAuOTAyN1Y3SDQzLjYyOTdaTTQ1LjQ1NjcgNi4wMDZINDkuMDc1N1YzLjA5NEg0NS40NTY3VjYuMDA2Wk01MS42MDQ1IDMuMDk0VjIuMUg1OS45MjA1VjQuMDI1TDU4LjMxNzUgNC41NUw1OS45MjA1IDUuMDc1VjdINTIuNjQ3NVYzLjA5NEg1MS42MDQ1Wk01NC40NzQ1IDYuMDA2SDU4LjA5MzVWNS42NDlMNTYuNzE0NSA1LjA0N0g1NC40NzQ1VjYuMDA2Wk01NC40NzQ1IDQuMDUzSDU2LjcxNDVMNTguMDkzNSAzLjQ1MVYzLjA5NEg1NC40NzQ1VjQuMDUzWk02NC4xMjI3IDdMNjUuODMwNyAzLjA5NEg2NC45NjI3VjIuMUg2OS44Mjc3TDcxLjk1NTcgN0g3MC4wNjU3TDY5LjUzMzcgNS43NzVINjYuNTUxN0w2Ni4wMTk3IDdINjQuMTIyN1pNNjYuOTg1NyA0Ljc4MUg2OS4wOTk3TDY4LjM1NzcgMy4wOTRINjcuNzI3N0w2Ni45ODU3IDQuNzgxWk03Mi4wMjUxIDdMNzMuNzMzMSAzLjA5NEg3Mi44NjUxVjIuMUg3Ny43MzAxTDc5Ljg1ODEgN0g3Ny45NjgxTDc2LjI2MDEgMy4wOTRINzUuNjMwMUw3My45MjIxIDdINzIuMDI1MVpNNzkuMjgzMiAzLjA5NFYyLjFIODcuNjA2MlYzLjkwNkw4NS43NzkyIDMuNjU0VjMuMDk0SDgyLjE2MDJWNC4wNTNIODUuMTM1MlY1LjA0N0g4Mi4xNjAyVjYuMDA2SDg1Ljc3OTJWNS40NDZMODcuNjA2MiA1LjE5NFY3SDgwLjMzMzJWMy4wOTRINzkuMjgzMlpNODguMTYzMSA2LjA1NVY0LjgwMkw4OS4yMDYxIDQuNTIyVjIuMUg5MS4wMzMxVjQuMDI1TDk0LjYxMDEgMy4wNTlWMi4xSDk2LjQzNzFWMy44MjJMOTMuNjE2MSA0LjU4NUw5NS4yNjgxIDUuOTVIOTYuNDc5MVY3SDk0LjE4MzFMOTEuODgwMSA1LjA0N0w5MS4wMzMxIDUuMjc4VjdIODkuMjA2MVY1Ljc3NUw4OC4xNjMxIDYuMDU1Wk05Ni45Njc4IDMuMDk0VjIuMUgxMDUuMjg0VjMuOTA2TDEwMy40NTcgMy42NTRWMy4wOTRIOTkuODM3OFY2LjAwNkgxMDMuNDU3VjUuNDQ2TDEwNS4yODQgNS4xOTRWN0g5OC4wMTA4VjMuMDk0SDk2Ljk2NzhaTTEwNS44NDEgMy4wOTRWMi4xSDExNC4xNjRWMy45MDZMMTEyLjMzNyAzLjY1NFYzLjA5NEgxMDguNzE4VjQuMDUzSDExMS42OTNWNS4wNDdIMTA4LjcxOFY2LjAwNkgxMTIuMzM3VjUuNDQ2TDExNC4xNjQgNS4xOTRWN0gxMDYuODkxVjMuMDk0SDEwNS44NDFaTTExNS40MjEgN1YyLjFIMTE3LjI0OFY0Ljk5OEwxMjAuODY3IDMuNDA5VjIuMUgxMjIuNjk0VjIuNjA0TDEyMy43MzcgMi4xNDlWMy40NThMMTIyLjY5NCAzLjkxM1Y3SDEyMC44NjdWNC43MThMMTE3LjI0OCA2LjMwN1Y3SDExNS40MjFaTTExNy45NDEgMi4yMDVWMS4yOTVMMTE4LjgxNiAwLjkxVjBIMTIwLjYzNlYwLjk4TDExNy45NDEgMi4yMDVaIiBmaWxsPSIjRkYwMDAwIi8+CjxwYXRoIGQ9Ik0xMC41IDEzLjA5NFYxMi4xSDE4LjIzNVYxMy44NzFMMTYuNDA4IDEzLjYxOVYxMy4wOTRIMTMuMzdWMTQuMzk2SDE2LjQwOFYxNS4zOUgxMy4zN1YxN0gxMS41NDNWMTMuMDk0SDEwLjVaTTE4LjQ0MzQgMTUuOTA4VjE0LjgyM0wxOS40ODY0IDE0LjY0OFYxMi4xSDI2Ljc1OTRWMTQuNTA4TDI0LjY0NTQgMTQuODY1TDI3LjA0NjQgMTdIMjQuNTE5NEwyMi41MjQ0IDE1LjIyMkwyMS4zMTM0IDE1LjQyNVYxN0gxOS40ODY0VjE1LjczM0wxOC40NDM0IDE1LjkwOFpNMjEuMzEzNCAxNC4zMjZMMjQuOTMyNCAxMy43MTdWMTMuMDk0SDIxLjMxMzRWMTQuMzI2Wk0yOC4wMjMyIDE3VjEyLjFIMzUuMjk2MlYxN0gyOC4wMjMyWk0yOS44NTAyIDE2LjAwNkgzMy40NjkyVjEzLjA5NEgyOS44NTAyVjE2LjAwNlpNMzYuNjk4IDE3VjExLjkwNEw0Mi4xNDQgMTQuOTQ5VjEzLjA5NEg0MS41NDlWMTIuMUg0My45NzFWMTdINDIuNDI0TDM4LjUyNSAxNC43NlYxNi4wMDZIMzkuMTJWMTdIMzYuNjk4Wk00NC44ODI5IDE0LjA2VjEyLjFINTIuNzE1OVYxNC4wNkw1MC44ODg5IDEzLjgwOFYxMy4wOTRINDkuNzEyOVYxN0g0Ny44ODU5VjEzLjA5NEg0Ni43MDk5VjEzLjgwOEw0NC44ODI5IDE0LjA2Wk01My4yNzM4IDE1LjA0N1YxNC4wNTNINTguMDg5OFYxNS4wNDdINTMuMjczOFpNNTguNDQwNCAxMy4wOTRWMTIuMUg2Ni43NjM0VjEzLjkwNkw2NC45MzY0IDEzLjY1NFYxMy4wOTRINjEuMzE3NFYxNC4wNTNINjQuMjkyNFYxNS4wNDdINjEuMzE3NFYxNi4wMDZINjQuOTM2NFYxNS40NDZMNjYuNzYzNCAxNS4xOTRWMTdINTkuNDkwNFYxMy4wOTRINTguNDQwNFpNNjguMDIwMyAxN1YxMS45MDRMNzMuNDY2MyAxNC45NDlWMTMuMDk0SDcyLjg3MTNWMTIuMUg3NS4yOTMzVjE3SDczLjc0NjNMNjkuODQ3MyAxNC43NlYxNi4wMDZINzAuNDQyM1YxN0g2OC4wMjAzWk03NS45OTUxIDEzLjA5NFYxMi4xSDgyLjA3MTFMODQuMzA0MSAxMy4yOVYxN0g3Ny4wMzgxVjEzLjA5NEg3NS45OTUxWk03OC44NzIxIDE2LjAwNkg4Mi40ODQxVjEzLjU3TDgxLjU4ODEgMTMuMDk0SDc4Ljg3MjFWMTYuMDA2Wk04OC40MzY1IDEzLjA5NFYxMi4xSDk0LjUxMjVMOTYuNzQ1NSAxMy4yOVYxN0g4OS40Nzk1VjEzLjA5NEg4OC40MzY1Wk05MS4zMTM1IDE2LjAwNkg5NC45MjU1VjEzLjU3TDk0LjAyOTUgMTMuMDk0SDkxLjMxMzVWMTYuMDA2Wk05Ny4zNzc5IDEzLjA5NFYxMi4xSDEwNS43MDFWMTMuOTA2TDEwMy44NzQgMTMuNjU0VjEzLjA5NEgxMDAuMjU1VjE0LjA1M0gxMDMuMjNWMTUuMDQ3SDEwMC4yNTVWMTYuMDA2SDEwMy44NzRWMTUuNDQ2TDEwNS43MDEgMTUuMTk0VjE3SDk4LjQyNzlWMTMuMDk0SDk3LjM3NzlaTTEwNi4xODggMTMuMDk0VjEyLjFIMTA4LjU2OEwxMTAuNTU2IDE1LjM0MUwxMTIuNTMgMTIuMUgxMTQuNDU1TDExMS40MzEgMTdIMTA5LjY1M0wxMDcuMjMxIDEzLjA5NEgxMDYuMTg4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==';

window.addEventListener('load', event => {
    console.log('page has loaded');

    ctx.drawImage(png, 0, 0);
    drawImage();
})