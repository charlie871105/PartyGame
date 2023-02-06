import DoneIcon from '@mui/icons-material/Done';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRighttIcon from '@mui/icons-material/ArrowRight';
import { ReactNode } from 'react';
import { Icon, SvgIcon } from '@mui/material';
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

export const playerColor = [
  '#f44336',
  '#9c27b0',
  '#3f50b5',
  '#00a8f4',
  '#2e9085',
  '#8bc24a',
  '#ffeb3a',
  '#ff9800',
  '#795548',
  '#607d8a',
];

export const GameButtonIcon: { [key in KeyName]: ReactNode } = {
  confirm: <DoneIcon sx={{ width: '100%', height: '100%' }} />,
  up: <ArrowDropUpIcon sx={{ width: '100%', height: '100%' }} />,
  down: <ArrowDropDownIcon sx={{ width: '100%', height: '100%' }} />,
  right: <ArrowRighttIcon sx={{ width: '100%', height: '100%' }} />,
  left: <ArrowLeftIcon sx={{ width: '100%', height: '100%' }} />,
  attack: (
    <Icon sx={{ width: '80%', height: '80%' }}>
      <img
        style={{ width: '100%', height: '100%' }}
        src="/icons/sword.svg"
        alt=""
      />
    </Icon>
  ),
  'x-axis': null,
  'y-axis': null,
};
