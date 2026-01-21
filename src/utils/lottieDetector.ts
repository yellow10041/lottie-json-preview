/**
 * Checks if the given content is a valid Lottie JSON
 */
export function isLottieJSON(content: string): boolean {
  try {
    const json = JSON.parse(content);
    return isLottieObject(json);
  } catch {
    return false;
  }
}

/**
 * Checks if the given object has Lottie animation structure
 */
export function isLottieObject(json: unknown): boolean {
  if (typeof json !== "object" || json === null) {
    return false;
  }

  const obj = json as Record<string, unknown>;

  // Required Lottie properties:
  // v - version string
  // fr - frame rate
  // ip - in point (start frame)
  // op - out point (end frame)
  // layers - array of layers
  return (
    typeof obj.v === "string" &&
    typeof obj.fr === "number" &&
    typeof obj.ip === "number" &&
    typeof obj.op === "number" &&
    Array.isArray(obj.layers)
  );
}

/**
 * Get Lottie animation metadata
 */
export function getLottieMetadata(content: string): {
  version: string;
  frameRate: number;
  duration: number;
  width: number;
  height: number;
} | null {
  try {
    const json = JSON.parse(content);
    if (!isLottieObject(json)) {
      return null;
    }

    const obj = json as Record<string, unknown>;
    const frameRate = obj.fr as number;
    const inPoint = obj.ip as number;
    const outPoint = obj.op as number;

    return {
      version: obj.v as string,
      frameRate,
      duration: (outPoint - inPoint) / frameRate,
      width: (obj.w as number) || 0,
      height: (obj.h as number) || 0,
    };
  } catch {
    return null;
  }
}
