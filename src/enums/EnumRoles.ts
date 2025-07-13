const lit = <V extends keyof any>(v: V) => v

export const Roles = {
    NURSE: { text: 'Enfermeira', value: lit('nurse') },
    PSYCHOLOGIST: { text: 'Psicologa', value: lit('psychologist') },
    CONCIERGE: { text: 'Concierge', value: lit('concierge') },
    ADMIN: { text: 'Administrador', value: lit('admin') },
}

export type Roles = (typeof Roles)[keyof typeof Roles]['value']

export function literalRole(value: Roles): string {
    return Roles[value?.toUpperCase() as keyof typeof Roles]?.text
}

export const enumRoles = Object.entries(Roles).map(([, params]) => params.value)
