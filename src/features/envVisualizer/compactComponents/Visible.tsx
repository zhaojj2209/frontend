import React, { RefObject } from 'react';

import { IVisible } from '../EnvVisualizerTypes';

export abstract class Visible implements IVisible {
  protected _x: number = 0;
  protected _y: number = 0;
  protected _width: number = 0;
  protected _height: number = 0;
  protected _isDrawn: boolean = false;
  x(): number {
    return this._x;
  }
  y(): number {
    return this._y;
  }
  width(): number {
    return this._width;
  }
  height(): number {
    return this._height;
  }
  isDrawn(): boolean {
    return this._isDrawn;
  }
  reset(): void {
    this._isDrawn = false;
  }
  ref: RefObject<any> = React.createRef();
  abstract draw(key?: number): React.ReactNode;
}
