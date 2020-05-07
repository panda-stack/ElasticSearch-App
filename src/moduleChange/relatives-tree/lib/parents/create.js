import byChildren from './byChildren';
import arrange from './arrange';
import { prop, withType } from '../utils';
export default (store) => {
    const createFamily = byChildren(store);
    const arrangeFamily = arrange(store);
    const root = store.familiesArray.filter(withType('root'));
    for (const rootFamily of root) {
        if (!rootFamily.main)
            continue;
        let stack = rootFamily.pUnitsWithParents.reverse();
        while (stack.length) {
            const familyUnit = stack.pop();
            const family = createFamily(familyUnit.nodes.map(prop('id')));
            const childFamily = store.getFamily(familyUnit.familyId);
            family.cID = childFamily.id;
            family.top = childFamily.top - 2;
            family.left = childFamily.left + familyUnit.shift;
            arrangeFamily(family);
            store.families.set(family.id, family);
            const nextUnits = family.pUnitsWithParents;
            if (nextUnits.length)
                stack = [...stack, ...nextUnits.reverse()];
        }
    }
    return store;
};
//# sourceMappingURL=create.js.map