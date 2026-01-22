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

  // Lottie files must have:
  // - v: version (string or number)
  // - layers: array of layers (required)
  // 
  // Optional but common:
  // - fr: frame rate (number)
  // - ip: in point (number, defaults to 0)
  // - op: out point (number)
  // - w/h: width/height

  const hasVersion = obj.v !== undefined;
  const hasLayers = Array.isArray(obj.layers);
  const hasOutPoint = typeof obj.op === "number";

  // Minimal check: must have layers and either version or animation timing
  return hasLayers && (hasVersion || hasOutPoint);
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
