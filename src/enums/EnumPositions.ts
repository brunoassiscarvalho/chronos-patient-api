const lit = <V extends keyof any>(v: V) => v;

export const Positions = {
  NURSE: { text: 'Enfermeira', value: lit('nurse') },
  PSYCHOLOGIST: { text: 'Psicologa', value: lit('psychologist') },
  NUTRITIONIST: { text: 'Nutricionista', value: lit('nutritionist') },
  CONCIERGE: { text: 'Concierge', value: lit('concierge') },
  ADMIN: { text: 'Administrador', value: lit('admin') },
};

export type Positions = typeof Positions[keyof typeof Positions]['value'];

export function literalPosition(value: Positions): string {
  return Positions[value.toUpperCase() as keyof typeof Positions]?.text;
}

export const enumPositions = Object.entries(Positions).map(
  ([, params]) => params.value,
);
