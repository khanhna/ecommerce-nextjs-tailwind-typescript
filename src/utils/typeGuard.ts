import { Decoder, guard } from 'decoders';

export const validateWithFallbackValue = (
  data: any,
  decoder: Decoder<unknown, unknown>,
  fallbackValue: any = undefined,
) => {
  try {
    const result = guard(decoder)(data);
    return typeof result === 'undefined' ? fallbackValue : result;
  } catch {
    return fallbackValue;
  }
};
