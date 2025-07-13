const lit = <V extends keyof any>(v: V) => v;

export const AnamneseStatus = {
  OPEN: { text: 'Em Aberto', value: lit('open') },
  COMPLETED: { text: 'Concluida', value: lit('completed') },
};

export type AnamneseStatus =
  typeof AnamneseStatus[keyof typeof AnamneseStatus]['value'];

export function literalAnamneseStatus(value: AnamneseStatus): string {
  return AnamneseStatus[value.toUpperCase() as keyof typeof AnamneseStatus]
    ?.text;
}

export const enumAnamneseStatus = Object.entries(AnamneseStatus).map(
  ([, params]) => params.value,
);
