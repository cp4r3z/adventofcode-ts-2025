// https://stackoverflow.com/questions/42286657/making-a-linked-list-iterable-in-es6
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator/Iterator#subclassing_iterator

// Interestingly, Interval is not a concrete class in Node.js

export class LinkedListElement {

    public next: LinkedListElement = null;
    public prev: LinkedListElement = null;

    constructor(public value: any = undefined) {
    }

    toString = () => `LLE {${this.value.toString()}}`;
}

export class LinkedList {
    /**
     * Notes:
     * If we want a circular linked list, subclass or make a new class.
     */

    public head: LinkedListElement = null;
    public tail: LinkedListElement = null; // Tracks the last element
    public size: number; // TODO!

    fromArray(arr: any[]) {
        this.head = null;
        this.tail = null;
        for (const value of arr) {
            this.append(new LinkedListElement(value));
        }
        this.size = arr.length;
        return this;
    }

    append(element: LinkedListElement) {
        if (!this.head) {
            this.head = this.tail = element;
        } else {
            this.tail.next = element;
            element.prev = this.tail;
            this.tail = element;
        }
        this.size++;
        return this; // Fluent
    }

    // insertAfter(element: LinkedListElement) {
    //     // TODO?
    // }
    insertBefore(element: LinkedListElement, newElement: LinkedListElement) {
        // Do we assume that the element is actually in our list?
        const prev = element.prev; // Could be null

        if (prev) {
            prev.next = newElement;
            newElement.prev = prev;
        } else {
            // element is the head
            this.head = newElement;
        }
        newElement.next = element;
        element.prev = newElement;
        this.size++;
    }
    remove(element: LinkedListElement) {
        const prev = element.prev;
        const next = element.next;
        prev.next = next;
        next.prev = prev;
    }

    print() {
        console.log([...this].map(lle => lle.value).join(', '));
    }

    *[Symbol.iterator]() {
        for (let current = this.head; current !== null; current = current.next) {
            yield current;
        }
    }
}
