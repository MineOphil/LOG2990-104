export const defaultErrorMessages = (): Dictionary<string> => {
  return {
    pattern: 'La valeur doit être conforme au patron',
    required: 'La valeur est requise',
  };
};

export interface Dictionary<T> {
  [key: string]: T;
}
