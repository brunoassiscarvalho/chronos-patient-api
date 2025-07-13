const lit = <V extends keyof any>(v: V) => v

export const Roles = {
    NURSE: { text: 'Enfermeira', value: lit('nurse') },
    PSYCHOLOGIST: { text: 'Psicologa', value: lit('psicologyst') },
    CONCIERGE: { text: 'Concierge', value: lit('concierge') },
}

export type Roles = (typeof Roles)[keyof typeof Roles]['value']

export function LiteralRole(value: Roles) {
    return Roles[value?.toUpperCase() as keyof typeof Roles].text
}
