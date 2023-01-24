export enum ShapeType {
  ROUND = 'round',
  TRIANGLE = 'triangle',
  SQUARE = 'square',
  PENTAGON = 'pentagon',
}

export enum FillType {
  SOLID = 'solid',
  FENCE = 'fence',
  SPOT = 'spot',
}

type LoadingPolygon = {
  id: string;
  shape: `${ShapeType}`;
  color: string;
};

export const loadingPolygons: LoadingPolygon[] = [
  {
    id: '1',
    shape: 'square',
    color: `#FA9500`,
  },
  {
    id: '2',
    shape: 'round',
    color: `#EB6424`,
  },
  {
    id: '3',
    shape: 'triangle',
    color: `#F07167`,
  },
];

export const playerColorNames = [
  'red',
  'purple',
  'indigo',
  'light-blue',
  'teal',
  'light-green',
  'yellow',
  'orange',
  'brown',
  'blue-grey',
];
