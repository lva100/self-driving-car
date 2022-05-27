import './style.scss'
import { Car } from "./src/car"
import { Road } from "./src/road"
import { Visualizer } from './src/visualizer';
import { NeutralNetwork } from './src/neutralnetwork';

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);

const N=1;
const cars = generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeutralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}

const traffic = [
    new Car(road.getLineCenter(1),-100,30,50,"DUMMY",2,"red"),
    new Car(road.getLineCenter(0),-300,30,50,"DUMMY",2,"red"),
    new Car(road.getLineCenter(2),-300,30,50,"DUMMY",2,"red"),
    new Car(road.getLineCenter(0),-500,30,50,"DUMMY",2,"red"),
    new Car(road.getLineCenter(1),-500,30,50,"DUMMY",2,"red"),
    new Car(road.getLineCenter(1),-700,30,50,"DUMMY",2,"red"),
    new Car(road.getLineCenter(2),-700,30,50,"DUMMY",2,"red"),
    new Car(road.getLineCenter(1),-900,30,50,"DUMMY",2,"red"),
    new Car(road.getLineCenter(0),-1100,30,50,"DUMMY",2,"red"),
    new Car(road.getLineCenter(2),-1300,30,50,"DUMMY",2,"red"),
    new Car(road.getLineCenter(0),-1800,30,50,"DUMMY",2,"red"),
    new Car(road.getLineCenter(2),-1800,30,50,"DUMMY",2,"red"),
];

animate();

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    );
}

function discard() {
    localStorage.removeItem("bestBrain");
}

window.save = save;
window.discard = discard;

function generateCars(N) {
    const cars=[];
    for(let i=0;i<=N;i++) {
        cars.push(new Car(road.getLineCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(time) {
    for(let i=0;i<traffic.length; i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length; i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(...cars.map(c=>c.y))
    );

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length; i++){
        traffic[i].draw(carCtx, "red");
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length; i++){
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx, "blue",true);
    
    carCtx.restore();

    networkCtx.lineDashOffset=time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}