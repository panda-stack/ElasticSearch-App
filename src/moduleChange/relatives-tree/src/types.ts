import Family from './models/family';
import Unit from './models/unit';

export type Gender = 'male' | 'female';
export type RelationType = 'blood' | 'married' | 'divorced' | 'adopted' | 'half';
export type FamilyType = 'root' | 'child' | 'parent';

export { Family, Unit }

export interface ICanvasSize {
  width: number;
  height: number;
}

export interface IRelation {
  id: string;
  type: RelationType;
}

export interface IFamilyNode {
  id: string;
  images: string;
  fname: string;
  lname: string;
  death: string;
  birth: string;
  gender: Gender;
  parents: IRelation[];
  children: IRelation[];
  siblings: IRelation[];
  spouses: IRelation[];
  placeholder?: boolean;
}

export interface IFamilyExtNode extends IFamilyNode {
  top: number;
  left: number;
  hasSubTree: boolean;
}

export interface IConnector {
  points: [number, number, number, number];
}

export interface IFamilyData {
  canvas: ICanvasSize;
  families: Family[];
  nodes: IFamilyExtNode[];
  connectors: IConnector[];
}
