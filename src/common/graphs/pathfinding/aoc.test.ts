import { Dijkstra } from './dijkstra';
import { konigsberg } from './konigsberg';

describe('Common Tests: Graphs: Dijkstra', () => {

    let pathfinder = null;

    it('Construct Königsberg', async () => {
        pathfinder = new Dijkstra(konigsberg);
        expect(pathfinder).toBeDefined();
    });

    it('Find Paths', async () => {
        const paths = pathfinder.findMinPaths();
        expect(paths.length).toBe(2);
        const pathStrings = paths.map(path => path.map(p => p.id).join('-'));
        expect(pathStrings[0]).toBe('A-C-B');
        expect(pathStrings[1]).toBe('A-C-D-B');
    });

    // TODO: Weights
});
