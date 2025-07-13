const lit = <V extends keyof any>(v: V) => v

export const ProfessionalStatus = {
    ACTIVE: { text: 'Ativo', value: lit('active') },
    DEACTIVE: { text: 'Inativo', value: lit('deactive') },
}

export type ProfessionalStatus =
    (typeof ProfessionalStatus)[keyof typeof ProfessionalStatus]['value']

export function literalPosition(value: ProfessionalStatus): string {
    return ProfessionalStatus[
        value?.toUpperCase() as keyof typeof ProfessionalStatus
    ]?.text
}

export const enumProfessionalStatus = Object.entries(ProfessionalStatus).map(
    ([, params]) => params.value
)
