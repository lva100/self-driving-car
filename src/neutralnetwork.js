import { Level } from "./level";

export class NeutralNetwork {
    constructor(neuronCounts) {
        this.levels=[];
        for(let i=0;i<neuronCounts.length-1;i++) {
            this.levels.push(new Level(neuronCounts[i],neuronCounts[i+1]));
        }
    }

    static feedForward(givenInputs,network) {
        let outputs=Level.feedForward(givenInputs,network.levels[0]);
        for(let i=1;i<network.levels.length;i++) {
            outputs=Level.feedForward(outputs,network.levels[i]);
        }
        return outputs;
    }
}