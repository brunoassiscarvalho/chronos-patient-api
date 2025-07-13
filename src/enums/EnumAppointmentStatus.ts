const lit = <V extends keyof any>(v: V) => v

export const AppointmentStatus = {
    OPEN: { text: 'Em Aberto', value: lit('open') },
    COMPLETED: { text: 'Concluida', value: lit('completed') },
}

export type AppointmentStatus =
    (typeof AppointmentStatus)[keyof typeof AppointmentStatus]['value']

export function literalAppointmentStatus(value: AppointmentStatus): string {
    return AppointmentStatus[
        value?.toUpperCase() as keyof typeof AppointmentStatus
    ]?.text
}

export const enumAppointmentStatus = Object.entries(AppointmentStatus).map(
    ([, params]) => params.value
)
