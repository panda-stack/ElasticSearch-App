import { prop, withId, withType, flat, inAscOrder, min, max } from '../utils';
export default (families) => {
    const connectors = [];
    families.filter(withType('root', 'child')).forEach(family => {
        if (family.pUnits.length !== 1) {
            throw new Error(`[relatives-tree]: a child family should have only one parent's unit`);
        }
        const mY = family.top + 2;
        const pUnit = family.pUnits[0];
        const pX = family.left + pUnit.shift + (pUnit.size);
        const pY = family.top + 1;
        connectors.push({
            points: [pX, pY, pX, mY],
        });
        const parentIds = family.pUnits
            .map(prop('ids'))
            .reduce(flat);
        const cXs = [];
        family.cUnits.forEach(cUnit => {
            const cX = family.left + cUnit.shift + 1;
            cUnit.nodes.forEach((node, index) => {
                if (node.parents.find(rel => parentIds.indexOf(rel.id) !== -1)) {
                    const nX = cX + (index * 2);
                    cXs.push(nX);
                    connectors.push({
                        points: [nX, mY, nX, mY + 1],
                    });
                }
            });
            if (cUnit.size === 2) {
                connectors.push({
                    points: [cX, mY + 1, cX + 2, mY + 1],
                });
            }
            else if (cUnit.size === 1 && cUnit.nodes[0].spouses.length) {
                family.cUnits.forEach(nUnit => {
                    if (nUnit.nodes.findIndex(withId(cUnit.nodes[0].spouses[0].id)) !== -1) {
                        const xX = [cX, family.left + nUnit.shift + 1].sort(inAscOrder);
                        connectors.push({
                            points: [xX[0], mY + 1, xX[1], mY + 1],
                        });
                    }
                });
            }
        });
        if (cXs.length > 1) {
            connectors.push({
                points: [min(cXs), mY, max(cXs), mY],
            });
        }
        else if (cXs.length === 1 && pX !== cXs[0]) {
            connectors.push({
                points: [Math.min(pX, cXs[0]), mY, Math.max(pX, cXs[0]), mY],
            });
        }
    });
    return connectors;
};
//# sourceMappingURL=children.js.map