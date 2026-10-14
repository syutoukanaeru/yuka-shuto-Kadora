interface Circle {
  kind: "circle";
  radius: number;
}

interface Rectangle {
  kind: "rect";
  width: number;
  height: number;
}

interface Triangle {
  kind: "triangle";
  base: number;
  height: number;
}

type Shape = Circle | Rectangle | Triangle;

function assertNever(value: never): number {
  throw new Error(`未対応の図形: ${JSON.stringify(value)}\
  `);
}
function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius * shape.radius;
    case "rect":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      return assertNever(shape);
  }
}

console.log("円の面積:", getArea({ kind: "circle", radius: 5 }));
console.log("短形の面積:", getArea({ kind: "rect", width: 4, height: 6 }));
console.log("三角形の面積:", getArea({ kind: "triangle", base: 8, height: 3 }));
