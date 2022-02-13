/// @ts-check
/// <reference path="./node_modules/@types/p5/global.d.ts" />

declare type Color = import("p5").Color

declare interface Positionable {
  x: number
  y: number
}

declare interface Resizable {
  width: number
  height: number
}

declare type FillOptions =
  | Color
  | {
      color: Color
    }

declare interface StrokeOptions {
  color: Color
  weight: number
}
