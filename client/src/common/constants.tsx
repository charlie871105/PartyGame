import DoneIcon from '@mui/icons-material/Done';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRighttIcon from '@mui/icons-material/ArrowRight';
import { ReactNode } from 'react';
import { KeyName } from '../types/game.type';

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

export const GameButtonIcon: { [key in KeyName]: ReactNode } = {
  confirm: <DoneIcon sx={{ width: '100%', height: '100%' }} />,
  up: <ArrowDropUpIcon sx={{ width: '100%', height: '100%' }} />,
  down: <ArrowDropDownIcon sx={{ width: '100%', height: '100%' }} />,
  right: <ArrowRighttIcon sx={{ width: '100%', height: '100%' }} />,
  left: <ArrowLeftIcon sx={{ width: '100%', height: '100%' }} />,
};
