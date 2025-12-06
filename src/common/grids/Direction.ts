import * as Points from '../base/points';

export namespace Direction {
    // https://en.wikipedia.org/wiki/Cardinal_direction
    export enum Cardinal {
        North = 1 << 0,// 1
        South = 1 << 1,// 2
        West = 1 << 2,// 4
        East = 1 << 3,// 8
        NorthWest = 1 << 4,
        NorthEast = 1 << 5,
        SouthWest = 1 << 6,
        SouthEast = 1 << 7
    };

    // These are in this order for a reason! Turning right will increment by 1. Look at Y2024D06
    export const Cardinals: Cardinal[] = [
        Cardinal.North,
        Cardinal.East,
        Cardinal.South,
        Cardinal.West
    ];

    export const toCardinalName = (card: Cardinal): string => {
        switch (card) {
            case Cardinal.North:
                return 'North';
            case Cardinal.South:
                return 'South';
            case Cardinal.West:
                return 'West';
            case Cardinal.East:
                return 'East';
            default:
                return 'UNKNOWN';
        }
    };

    export const Ordinals: Cardinal[] = [
        Cardinal.NorthWest,
        Cardinal.NorthEast,
        Cardinal.SouthWest,
        Cardinal.SouthEast
    ];

    export const CardinalToXY: Map<Cardinal, Points.XY> = new Map<Cardinal, Points.XY>();
    // Y Down
    CardinalToXY.set(Cardinal.North, new Points.XY(0, -1));
    CardinalToXY.set(Cardinal.South, new Points.XY(0, 1));
    CardinalToXY.set(Cardinal.West, new Points.XY(-1, 0));
    CardinalToXY.set(Cardinal.East, new Points.XY(1, 0));
    CardinalToXY.set(Cardinal.NorthWest, new Points.XY(-1, -1));
    CardinalToXY.set(Cardinal.NorthEast, new Points.XY(1, -1));
    CardinalToXY.set(Cardinal.SouthWest, new Points.XY(-1, 1));
    CardinalToXY.set(Cardinal.SouthEast, new Points.XY(1, 1));

    export const XYToCardinal = (unit: Points.XY): Cardinal => {
        for (const c of Cardinals) {
            if (Points.XY.AreEqual(CardinalToXY.get(c), unit)) return c;
        }
        throw new Error('Bad Input');
    };

    export enum Turn {
        Left = 1 << 0,// 1
        Right = 1 << 1,// 2
        Ahead = 1 << 2,// 4
        Back = 1 << 3
    }

    export const Turns: Turn[] = [
        Turn.Left, Turn.Right, Turn.Ahead, Turn.Back
    ];

    export class CardinalClass {
        public Left: CardinalClass;
        public Right: CardinalClass;
        public Back: CardinalClass;
        public Straight: CardinalClass;
        public XY: Points.XY;
        constructor(public Cardinal: Cardinal) {
            this.XY = CardinalToXY.get(this.Cardinal);
        }
    }

    /**
     * @returns A Map of Cardinal Direction Objects
     */
    export const ObjectMap = () => {
        const North = new CardinalClass(Cardinal.North);
        const East = new CardinalClass(Cardinal.East);
        const South = new CardinalClass(Cardinal.South);
        const West = new CardinalClass(Cardinal.West);
        North.Left = West; North.Right = East; North.Back = South; North.Straight = North;
        East.Left = North; East.Right = South; East.Back = West; East.Straight = East;
        South.Left = East; South.Right = West; South.Back = North; South.Straight = South;
        West.Left = South; West.Right = North; West.Back = East; West.Straight = West;
        // return {
        //     North,
        //     East,
        //     South,
        //     West
        // };
        const map = new Map<Cardinal, CardinalClass>();
        map.set(Cardinal.North, North);
        map.set(Cardinal.East, East);
        map.set(Cardinal.South, South);
        map.set(Cardinal.West, West);
        return map;
    };

    // Used in Day 17. Maybe this isn't the best
    export const Back = (c: Cardinal): Cardinal => {
        if (c === Cardinal.North) return Cardinal.South;
        if (c === Cardinal.East) return Cardinal.West;
        if (c === Cardinal.South) return Cardinal.North;
        if (c === Cardinal.West) return Cardinal.East;
        console.error('Bad Input');
    };
}
