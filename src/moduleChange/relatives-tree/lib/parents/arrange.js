import { withSameIDs } from '../utils';
export default (store) => {
    return function (family) {
        if (family.cID === null)
            return;
        let right = 0;
        while (family) {
            const fUnit = family.cUnits[0];
            if (family.pUnits.length === 2 && family.pCount > 2) {
                fUnit.shift = Math.floor(family.pUnits[1].shift / 2);
            }
            const shift = fUnit.shift;
            right = Math.max(right, family.right);
            const cFamily = store.getFamily(family.cID);
            if (cFamily.cID === null) {
                fUnit.shift = (family.width - fUnit.size * 2) / 2;
                break;
            }
            const pUnit = cFamily.pUnits.find(withSameIDs(fUnit));
            const uIndex = cFamily.pUnits.findIndex(unit => (unit.nodes[0].id === fUnit.nodes[0].id));
            if (uIndex === 0 && pUnit.shift === 0) {
                const left = family.left + shift;
                cFamily.left = Math.max(cFamily.left, left);
            }
            else {
                pUnit.shift = family.left + fUnit.shift - cFamily.left;
            }
            const next = cFamily.pUnits[uIndex + 1];
            if (next) {
                const diff = right - (cFamily.left + next.shift);
                if (diff > 0) {
                    for (let i = uIndex + 1; i < cFamily.pUnits.length; i++) {
                        cFamily.pUnits[i].shift += diff;
                    }
                }
            }
            family = cFamily;
        }
    };
};
//# sourceMappingURL=arrange.js.map