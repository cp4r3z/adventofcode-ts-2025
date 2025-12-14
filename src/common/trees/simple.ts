import { IGraph, INode } from "../types";

export interface ITreeMember extends INode  {
    addChild(child:ITreeMember): ITreeMember // return this
}

export default class Tree implements IGraph{

    // Thoughts:
    // Do we even need a data structure? Maybe just the start node is enough?
    // Find method?
    // Add node?
    // Set weight?

    start: ITreeMember;

    constructor(start: ITreeMember){

    }

    isEnd(node: INode): boolean {
        throw new Error("Method not implemented.");
    }
    getNeighbors(node: INode): INode[] {
        throw new Error("Method not implemented.");
    }
    getWeight(from: INode, to: INode): number {
        throw new Error("Method not implemented.");
    }
    forEach(callbackfn: (value: INode) => void, thisArg?: any): void {
        throw new Error("Method not implemented.");
    }
    print() {
        throw new Error("Method not implemented.");
    }

}