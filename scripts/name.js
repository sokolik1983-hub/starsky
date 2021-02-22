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
                this.y = y + canvas1.height/5 - png.height *2,
                this.color = color,
                this.size = 1.8,
                this.baseX = x + canvas1.width/2 - png.width * 2,
                this.baseY = y + canvas1.height/5 - png.height * 2,
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
if(innerWidth >= 768) {
    png.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI0IiBoZWlnaHQ9IjE3IiB2aWV3Qm94PSIwIDAgMTI0IDE3IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMCAzLjA5NFYyLjFIOC4zMTZWMy45MDZMNi40ODkgMy42NTRWMy4wOTRIMi44N1Y2LjAwNkg2LjQ4OVY1LjQ0Nkw4LjMxNiA1LjE5NFY3SDEuMDQzVjMuMDk0SDBaTTkuNTczMDUgN1YyLjFIMTYuODQ2VjdIOS41NzMwNVpNMTEuNCA2LjAwNkgxNS4wMTlWMy4wOTRIMTEuNFY2LjAwNlpNMTcuNTQ3OSA2LjA1NVY0LjgwMkwxOC41OTA5IDQuNTIyVjIuMUgyMC40MTc5VjQuMDI1TDIzLjk5NDkgMy4wNTlWMi4xSDI1LjgyMTlWMy44MjJMMjMuMDAwOSA0LjU4NUwyNC42NTI5IDUuOTVIMjUuODYzOVY3SDIzLjU2NzlMMjEuMjY0OSA1LjA0N0wyMC40MTc5IDUuMjc4VjdIMTguNTkwOVY1Ljc3NUwxNy41NDc5IDYuMDU1Wk0yNy4wNTI1IDdWMi4xSDM0LjMyNTVWN0gyNy4wNTI1Wk0yOC44Nzk1IDYuMDA2SDMyLjQ5ODVWMy4wOTRIMjguODc5NVY2LjAwNlpNMzUuMDk3MyA3TDM2LjgwNTMgMy4wOTRIMzUuOTM3M1YyLjFINDAuODAyM0w0Mi45MzAzIDdINDEuMDQwM0wzOS4zMzIzIDMuMDk0SDM4LjcwMjNMMzYuOTk0MyA3SDM1LjA5NzNaTTQzLjYyOTcgN1YyLjFINTAuOTAyN1Y3SDQzLjYyOTdaTTQ1LjQ1NjcgNi4wMDZINDkuMDc1N1YzLjA5NEg0NS40NTY3VjYuMDA2Wk01MS42MDQ1IDMuMDk0VjIuMUg1OS45MjA1VjQuMDI1TDU4LjMxNzUgNC41NUw1OS45MjA1IDUuMDc1VjdINTIuNjQ3NVYzLjA5NEg1MS42MDQ1Wk01NC40NzQ1IDYuMDA2SDU4LjA5MzVWNS42NDlMNTYuNzE0NSA1LjA0N0g1NC40NzQ1VjYuMDA2Wk01NC40NzQ1IDQuMDUzSDU2LjcxNDVMNTguMDkzNSAzLjQ1MVYzLjA5NEg1NC40NzQ1VjQuMDUzWk02NC4xMjI3IDdMNjUuODMwNyAzLjA5NEg2NC45NjI3VjIuMUg2OS44Mjc3TDcxLjk1NTcgN0g3MC4wNjU3TDY5LjUzMzcgNS43NzVINjYuNTUxN0w2Ni4wMTk3IDdINjQuMTIyN1pNNjYuOTg1NyA0Ljc4MUg2OS4wOTk3TDY4LjM1NzcgMy4wOTRINjcuNzI3N0w2Ni45ODU3IDQuNzgxWk03Mi4wMjUxIDdMNzMuNzMzMSAzLjA5NEg3Mi44NjUxVjIuMUg3Ny43MzAxTDc5Ljg1ODEgN0g3Ny45NjgxTDc2LjI2MDEgMy4wOTRINzUuNjMwMUw3My45MjIxIDdINzIuMDI1MVpNNzkuMjgzMiAzLjA5NFYyLjFIODcuNjA2MlYzLjkwNkw4NS43NzkyIDMuNjU0VjMuMDk0SDgyLjE2MDJWNC4wNTNIODUuMTM1MlY1LjA0N0g4Mi4xNjAyVjYuMDA2SDg1Ljc3OTJWNS40NDZMODcuNjA2MiA1LjE5NFY3SDgwLjMzMzJWMy4wOTRINzkuMjgzMlpNODguMTYzMSA2LjA1NVY0LjgwMkw4OS4yMDYxIDQuNTIyVjIuMUg5MS4wMzMxVjQuMDI1TDk0LjYxMDEgMy4wNTlWMi4xSDk2LjQzNzFWMy44MjJMOTMuNjE2MSA0LjU4NUw5NS4yNjgxIDUuOTVIOTYuNDc5MVY3SDk0LjE4MzFMOTEuODgwMSA1LjA0N0w5MS4wMzMxIDUuMjc4VjdIODkuMjA2MVY1Ljc3NUw4OC4xNjMxIDYuMDU1Wk05Ni45Njc4IDMuMDk0VjIuMUgxMDUuMjg0VjMuOTA2TDEwMy40NTcgMy42NTRWMy4wOTRIOTkuODM3OFY2LjAwNkgxMDMuNDU3VjUuNDQ2TDEwNS4yODQgNS4xOTRWN0g5OC4wMTA4VjMuMDk0SDk2Ljk2NzhaTTEwNS44NDEgMy4wOTRWMi4xSDExNC4xNjRWMy45MDZMMTEyLjMzNyAzLjY1NFYzLjA5NEgxMDguNzE4VjQuMDUzSDExMS42OTNWNS4wNDdIMTA4LjcxOFY2LjAwNkgxMTIuMzM3VjUuNDQ2TDExNC4xNjQgNS4xOTRWN0gxMDYuODkxVjMuMDk0SDEwNS44NDFaTTExNS40MjEgN1YyLjFIMTE3LjI0OFY0Ljk5OEwxMjAuODY3IDMuNDA5VjIuMUgxMjIuNjk0VjIuNjA0TDEyMy43MzcgMi4xNDlWMy40NThMMTIyLjY5NCAzLjkxM1Y3SDEyMC44NjdWNC43MThMMTE3LjI0OCA2LjMwN1Y3SDExNS40MjFaTTExNy45NDEgMi4yMDVWMS4yOTVMMTE4LjgxNiAwLjkxVjBIMTIwLjYzNlYwLjk4TDExNy45NDEgMi4yMDVaIiBmaWxsPSIjRkYwMDAwIi8+CjxwYXRoIGQ9Ik0xMC41IDEzLjA5NFYxMi4xSDE4LjIzNVYxMy44NzFMMTYuNDA4IDEzLjYxOVYxMy4wOTRIMTMuMzdWMTQuMzk2SDE2LjQwOFYxNS4zOUgxMy4zN1YxN0gxMS41NDNWMTMuMDk0SDEwLjVaTTE4LjQ0MzQgMTUuOTA4VjE0LjgyM0wxOS40ODY0IDE0LjY0OFYxMi4xSDI2Ljc1OTRWMTQuNTA4TDI0LjY0NTQgMTQuODY1TDI3LjA0NjQgMTdIMjQuNTE5NEwyMi41MjQ0IDE1LjIyMkwyMS4zMTM0IDE1LjQyNVYxN0gxOS40ODY0VjE1LjczM0wxOC40NDM0IDE1LjkwOFpNMjEuMzEzNCAxNC4zMjZMMjQuOTMyNCAxMy43MTdWMTMuMDk0SDIxLjMxMzRWMTQuMzI2Wk0yOC4wMjMyIDE3VjEyLjFIMzUuMjk2MlYxN0gyOC4wMjMyWk0yOS44NTAyIDE2LjAwNkgzMy40NjkyVjEzLjA5NEgyOS44NTAyVjE2LjAwNlpNMzYuNjk4IDE3VjExLjkwNEw0Mi4xNDQgMTQuOTQ5VjEzLjA5NEg0MS41NDlWMTIuMUg0My45NzFWMTdINDIuNDI0TDM4LjUyNSAxNC43NlYxNi4wMDZIMzkuMTJWMTdIMzYuNjk4Wk00NC44ODI5IDE0LjA2VjEyLjFINTIuNzE1OVYxNC4wNkw1MC44ODg5IDEzLjgwOFYxMy4wOTRINDkuNzEyOVYxN0g0Ny44ODU5VjEzLjA5NEg0Ni43MDk5VjEzLjgwOEw0NC44ODI5IDE0LjA2Wk01My4yNzM4IDE1LjA0N1YxNC4wNTNINTguMDg5OFYxNS4wNDdINTMuMjczOFpNNTguNDQwNCAxMy4wOTRWMTIuMUg2Ni43NjM0VjEzLjkwNkw2NC45MzY0IDEzLjY1NFYxMy4wOTRINjEuMzE3NFYxNC4wNTNINjQuMjkyNFYxNS4wNDdINjEuMzE3NFYxNi4wMDZINjQuOTM2NFYxNS40NDZMNjYuNzYzNCAxNS4xOTRWMTdINTkuNDkwNFYxMy4wOTRINTguNDQwNFpNNjguMDIwMyAxN1YxMS45MDRMNzMuNDY2MyAxNC45NDlWMTMuMDk0SDcyLjg3MTNWMTIuMUg3NS4yOTMzVjE3SDczLjc0NjNMNjkuODQ3MyAxNC43NlYxNi4wMDZINzAuNDQyM1YxN0g2OC4wMjAzWk03NS45OTUxIDEzLjA5NFYxMi4xSDgyLjA3MTFMODQuMzA0MSAxMy4yOVYxN0g3Ny4wMzgxVjEzLjA5NEg3NS45OTUxWk03OC44NzIxIDE2LjAwNkg4Mi40ODQxVjEzLjU3TDgxLjU4ODEgMTMuMDk0SDc4Ljg3MjFWMTYuMDA2Wk04OC40MzY1IDEzLjA5NFYxMi4xSDk0LjUxMjVMOTYuNzQ1NSAxMy4yOVYxN0g4OS40Nzk1VjEzLjA5NEg4OC40MzY1Wk05MS4zMTM1IDE2LjAwNkg5NC45MjU1VjEzLjU3TDk0LjAyOTUgMTMuMDk0SDkxLjMxMzVWMTYuMDA2Wk05Ny4zNzc5IDEzLjA5NFYxMi4xSDEwNS43MDFWMTMuOTA2TDEwMy44NzQgMTMuNjU0VjEzLjA5NEgxMDAuMjU1VjE0LjA1M0gxMDMuMjNWMTUuMDQ3SDEwMC4yNTVWMTYuMDA2SDEwMy44NzRWMTUuNDQ2TDEwNS43MDEgMTUuMTk0VjE3SDk4LjQyNzlWMTMuMDk0SDk3LjM3NzlaTTEwNi4xODggMTMuMDk0VjEyLjFIMTA4LjU2OEwxMTAuNTU2IDE1LjM0MUwxMTIuNTMgMTIuMUgxMTQuNDU1TDExMS40MzEgMTdIMTA5LjY1M0wxMDcuMjMxIDEzLjA5NEgxMDYuMTg4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==';
} else {
    png.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzQiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCA3NCAzNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcgMS4wOTRWMC4wOTk5OTk3SDE1LjMxNlYxLjkwNkwxMy40ODkgMS42NTRWMS4wOTRIOS44N1Y0LjAwNkgxMy40ODlWMy40NDZMMTUuMzE2IDMuMTk0VjVIOC4wNDNWMS4wOTRIN1pNMTYuNTczIDVWMC4wOTk5OTk3SDIzLjg0NlY1SDE2LjU3M1pNMTguNCA0LjAwNkgyMi4wMTlWMS4wOTRIMTguNFY0LjAwNlpNMjQuNTQ3OSA0LjA1NVYyLjgwMkwyNS41OTA5IDIuNTIyVjAuMDk5OTk5N0gyNy40MTc5VjIuMDI1TDMwLjk5NDkgMS4wNTlWMC4wOTk5OTk3SDMyLjgyMTlWMS44MjJMMzAuMDAwOSAyLjU4NUwzMS42NTI5IDMuOTVIMzIuODYzOVY1SDMwLjU2NzlMMjguMjY0OSAzLjA0N0wyNy40MTc5IDMuMjc4VjVIMjUuNTkwOVYzLjc3NUwyNC41NDc5IDQuMDU1Wk0zNC4wNTI1IDVWMC4wOTk5OTk3SDQxLjMyNTVWNUgzNC4wNTI1Wk0zNS44Nzk1IDQuMDA2SDM5LjQ5ODVWMS4wOTRIMzUuODc5NVY0LjAwNlpNNDIuMDk3MyA1TDQzLjgwNTMgMS4wOTRINDIuOTM3M1YwLjA5OTk5OTdINDcuODAyM0w0OS45MzAzIDVINDguMDQwM0w0Ni4zMzIzIDEuMDk0SDQ1LjcwMjNMNDMuOTk0MyA1SDQyLjA5NzNaTTUwLjYyOTcgNVYwLjA5OTk5OTdINTcuOTAyN1Y1SDUwLjYyOTdaTTUyLjQ1NjcgNC4wMDZINTYuMDc1N1YxLjA5NEg1Mi40NTY3VjQuMDA2Wk01OC42MDQ1IDEuMDk0VjAuMDk5OTk5N0g2Ni45MjA1VjIuMDI1TDY1LjMxNzUgMi41NUw2Ni45MjA1IDMuMDc1VjVINTkuNjQ3NVYxLjA5NEg1OC42MDQ1Wk02MS40NzQ1IDQuMDA2SDY1LjA5MzVWMy42NDlMNjMuNzE0NSAzLjA0N0g2MS40NzQ1VjQuMDA2Wk02MS40NzQ1IDIuMDUzSDYzLjcxNDVMNjUuMDkzNSAxLjQ1MVYxLjA5NEg2MS40NzQ1VjIuMDUzWk03LjA3IDE1TDguNzc4IDExLjA5NEg3LjkxVjEwLjFIMTIuNzc1TDE0LjkwMyAxNUgxMy4wMTNMMTIuNDgxIDEzLjc3NUg5LjQ5OUw4Ljk2NyAxNUg3LjA3Wk05LjkzMyAxMi43ODFIMTIuMDQ3TDExLjMwNSAxMS4wOTRIMTAuNjc1TDkuOTMzIDEyLjc4MVpNMTQuOTcyMyAxNUwxNi42ODAzIDExLjA5NEgxNS44MTIzVjEwLjFIMjAuNjc3M0wyMi44MDUzIDE1SDIwLjkxNTNMMTkuMjA3MyAxMS4wOTRIMTguNTc3M0wxNi44NjkzIDE1SDE0Ljk3MjNaTTIyLjIzMDUgMTEuMDk0VjEwLjFIMzAuNTUzNVYxMS45MDZMMjguNzI2NSAxMS42NTRWMTEuMDk0SDI1LjEwNzVWMTIuMDUzSDI4LjA4MjVWMTMuMDQ3SDI1LjEwNzVWMTQuMDA2SDI4LjcyNjVWMTMuNDQ2TDMwLjU1MzUgMTMuMTk0VjE1SDIzLjI4MDVWMTEuMDk0SDIyLjIzMDVaTTMxLjExMDQgMTQuMDU1VjEyLjgwMkwzMi4xNTM0IDEyLjUyMlYxMC4xSDMzLjk4MDRWMTIuMDI1TDM3LjU1NzQgMTEuMDU5VjEwLjFIMzkuMzg0NFYxMS44MjJMMzYuNTYzNCAxMi41ODVMMzguMjE1NCAxMy45NUgzOS40MjY0VjE1SDM3LjEzMDRMMzQuODI3NCAxMy4wNDdMMzMuOTgwNCAxMy4yNzhWMTVIMzIuMTUzNFYxMy43NzVMMzEuMTEwNCAxNC4wNTVaTTM5LjkxNSAxMS4wOTRWMTAuMUg0OC4yMzFWMTEuOTA2TDQ2LjQwNCAxMS42NTRWMTEuMDk0SDQyLjc4NVYxNC4wMDZINDYuNDA0VjEzLjQ0Nkw0OC4yMzEgMTMuMTk0VjE1SDQwLjk1OFYxMS4wOTRIMzkuOTE1Wk00OC43ODgxIDExLjA5NFYxMC4xSDU3LjExMTFWMTEuOTA2TDU1LjI4NDEgMTEuNjU0VjExLjA5NEg1MS42NjUxVjEyLjA1M0g1NC42NDAxVjEzLjA0N0g1MS42NjUxVjE0LjAwNkg1NS4yODQxVjEzLjQ0Nkw1Ny4xMTExIDEzLjE5NFYxNUg0OS44MzgxVjExLjA5NEg0OC43ODgxWk01OC4zNjggMTVWMTAuMUg2MC4xOTVWMTIuOTk4TDYzLjgxNCAxMS40MDlWMTAuMUg2NS42NDFWMTAuNjA0TDY2LjY4NCAxMC4xNDlWMTEuNDU4TDY1LjY0MSAxMS45MTNWMTVINjMuODE0VjEyLjcxOEw2MC4xOTUgMTQuMzA3VjE1SDU4LjM2OFpNNjAuODg4IDEwLjIwNVY5LjI5NUw2MS43NjMgOC45MVY4SDYzLjU4M1Y4Ljk4TDYwLjg4OCAxMC4yMDVaIiBmaWxsPSIjRkYwMDAwIi8+CjxwYXRoIGQ9Ik0wIDIxLjA5NFYyMC4xSDcuNzM1VjIxLjg3MUw1LjkwOCAyMS42MTlWMjEuMDk0SDIuODdWMjIuMzk2SDUuOTA4VjIzLjM5SDIuODdWMjVIMS4wNDNWMjEuMDk0SDBaTTcuOTQzMzYgMjMuOTA4VjIyLjgyM0w4Ljk4NjM2IDIyLjY0OFYyMC4xSDE2LjI1OTRWMjIuNTA4TDE0LjE0NTQgMjIuODY1TDE2LjU0NjQgMjVIMTQuMDE5NEwxMi4wMjQ0IDIzLjIyMkwxMC44MTM0IDIzLjQyNVYyNUg4Ljk4NjM2VjIzLjczM0w3Ljk0MzM2IDIzLjkwOFpNMTAuODEzNCAyMi4zMjZMMTQuNDMyNCAyMS43MTdWMjEuMDk0SDEwLjgxMzRWMjIuMzI2Wk0xNy41MjMyIDI1VjIwLjFIMjQuNzk2MlYyNUgxNy41MjMyWk0xOS4zNTAyIDI0LjAwNkgyMi45NjkyVjIxLjA5NEgxOS4zNTAyVjI0LjAwNlpNMjYuMTk4IDI1VjE5LjkwNEwzMS42NDQgMjIuOTQ5VjIxLjA5NEgzMS4wNDlWMjAuMUgzMy40NzFWMjVIMzEuOTI0TDI4LjAyNSAyMi43NlYyNC4wMDZIMjguNjJWMjVIMjYuMTk4Wk0zNC4zODI5IDIyLjA2VjIwLjFINDIuMjE1OVYyMi4wNkw0MC4zODg5IDIxLjgwOFYyMS4wOTRIMzkuMjEyOVYyNUgzNy4zODU5VjIxLjA5NEgzNi4yMDk5VjIxLjgwOEwzNC4zODI5IDIyLjA2Wk00Mi43NzM4IDIzLjA0N1YyMi4wNTNINDcuNTg5OFYyMy4wNDdINDIuNzczOFpNNDcuOTQwNCAyMS4wOTRWMjAuMUg1Ni4yNjM0VjIxLjkwNkw1NC40MzY0IDIxLjY1NFYyMS4wOTRINTAuODE3NFYyMi4wNTNINTMuNzkyNFYyMy4wNDdINTAuODE3NFYyNC4wMDZINTQuNDM2NFYyMy40NDZMNTYuMjYzNCAyMy4xOTRWMjVINDguOTkwNFYyMS4wOTRINDcuOTQwNFpNNTcuNTIwMyAyNVYxOS45MDRMNjIuOTY2MyAyMi45NDlWMjEuMDk0SDYyLjM3MTNWMjAuMUg2NC43OTMzVjI1SDYzLjI0NjNMNTkuMzQ3MyAyMi43NlYyNC4wMDZINTkuOTQyM1YyNUg1Ny41MjAzWk02NS40OTUxIDIxLjA5NFYyMC4xSDcxLjU3MTFMNzMuODA0MSAyMS4yOVYyNUg2Ni41MzgxVjIxLjA5NEg2NS40OTUxWk02OC4zNzIxIDI0LjAwNkg3MS45ODQxVjIxLjU3TDcxLjA4ODEgMjEuMDk0SDY4LjM3MjFWMjQuMDA2Wk0yNC41IDMxLjA5NFYzMC4xSDMwLjU3NkwzMi44MDkgMzEuMjlWMzVIMjUuNTQzVjMxLjA5NEgyNC41Wk0yNy4zNzcgMzQuMDA2SDMwLjk4OVYzMS41N0wzMC4wOTMgMzEuMDk0SDI3LjM3N1YzNC4wMDZaTTMzLjQ0MTQgMzEuMDk0VjMwLjFINDEuNzY0NFYzMS45MDZMMzkuOTM3NCAzMS42NTRWMzEuMDk0SDM2LjMxODRWMzIuMDUzSDM5LjI5MzRWMzMuMDQ3SDM2LjMxODRWMzQuMDA2SDM5LjkzNzRWMzMuNDQ2TDQxLjc2NDQgMzMuMTk0VjM1SDM0LjQ5MTRWMzEuMDk0SDMzLjQ0MTRaTTQyLjI1MTMgMzEuMDk0VjMwLjFINDQuNjMxM0w0Ni42MTkzIDMzLjM0MUw0OC41OTMzIDMwLjFINTAuNTE4M0w0Ny40OTQzIDM1SDQ1LjcxNjNMNDMuMjk0MyAzMS4wOTRINDIuMjUxM1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=';
}



window.addEventListener('load', event => {
    console.log('page has loaded');

    ctx.drawImage(png, 0, 0);
    drawImage();
})