import gridConfig from "../config/gridConfig";

export const getActualPosFromGridPos = (x, y) => {
  const { size } = gridConfig;
  const xPos = size * x + size / 2;
  const yPos = size * y + size / 2;
  return { x: xPos, y: yPos };
};
