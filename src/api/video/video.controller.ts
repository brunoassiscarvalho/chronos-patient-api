import { Response, Request } from 'express'
import { jwt as TwillioJwt } from 'twilio'
import { Client } from '@twilio/conversations'
import Configurations from '../../core/configurations'
import BusinessException from '../../exceptions/BusinessException'
import Appointment, { IAppointment } from '../appointment/appointment'
import { sub, add } from 'date-fns'

export default class VideoController {
    private configurations: Configurations

    private anticipationTimeMinutes = 0
    private lateTimeMinutes = 0

    constructor() {
        this.configurations = new Configurations()
        this.anticipationTimeMinutes =
            this.configurations.VIDEO.antecipationTime
        this.lateTimeMinutes = this.configurations.VIDEO.lateTime
    }

    public async getVideos(): Promise<string> {
        return 'Servidor Funcionado!'
    }

    public async getVideoToken(req: Request, res: Response): Promise<any> {
        const { appointmentId } = req.params
        const { userId } = res.locals

        const appointment = await this.validateAppointment({
            appointmentId,
            userId,
        })

        if (!appointment)
            throw new BusinessException(
                'Dados de vídeo incorreto',
                'CHECK_APPOINTMENT_VIDEO_ERRO_APPOINTMENT'
            )

        if (!appointment.patient)
            throw new BusinessException(
                'Dados de vídeo incorreto',
                'CHECK_APPOINTMENT_VIDEO_ERRO_APPOINTMENT_PATIENT'
            )

        const { accountSid, keySid, secret, serviceId } =
            this.configurations.TWILLIO
        if (!accountSid || !keySid || !secret)
            throw new BusinessException(
                'Dados de vídeo incorreto',
                'TWILLIO_VIDEO_TOKEN_ERRO'
            )

        const token = new TwillioJwt.AccessToken(accountSid, keySid, secret, {
            identity: userId,
        })

        const videoGrant = new TwillioJwt.AccessToken.VideoGrant({
            room: appointmentId,
        })
        token.addGrant(videoGrant)

        const chatGrant = new TwillioJwt.AccessToken.ChatGrant({
            serviceSid: serviceId,
        })
        token.addGrant(chatGrant)

        const client = new Client(token.toJwt())
        client
            .createConversation({
                uniqueName: appointment._id.toString(),
                friendlyName: `Atendimento do ${
                    appointment.patient.name.split(' ')[0]
                } com chronos`,
            })
            .then((newConversation) => {
                appointment.patient &&
                    newConversation.add(appointment.patient._id.toString())
                newConversation.add(appointment.professional._id.toString())
            })
            .catch((error) => {
                if (error.description === 'Conflict')
                    client
                        .getConversationByUniqueName(appointment._id.toString())
                        .then((conversation) => {
                            if (appointment.patient) {
                                conversation.add(
                                    appointment.patient._id.toString()
                                )
                                conversation.updateFriendlyName(
                                    `Atendimento do ${
                                        appointment.patient.name.split(' ')[0]
                                    } com chronos`
                                )
                            }
                        })
                        .catch((e) => {
                            throw new BusinessException(
                                'Dados de vídeo incorreto',
                                'CHECK_APPOINTMENT_VIDEO_CONVERSATION_ADDING_PROFESSIONAL'
                            )
                        })
            })

        return { token: token.toJwt() }
    }

    private async validateAppointment({
        appointmentId,
        userId,
    }: any): Promise<IAppointment> {
        const appointment: IAppointment | null = await Appointment.findOne({
            _id: appointmentId,
            'patient._id': userId,
        }).lean()
        if (!appointment) {
            throw new BusinessException(
                'Dados de vídeo incorreto',
                'CHECK_APPOINTMENT_VIDEO_NO_APPOINTMENT'
            )
        }

        if (
            new Date() <
            sub(appointment.start, { minutes: this.anticipationTimeMinutes })
        ) {
            throw new BusinessException(
                'Dados de vídeo incorreto',
                'CHECK_APPOINTMENT_VIDEO_ANTECIPATION'
            )
        }

        if (
            new Date() >
            add(appointment.start, { minutes: this.lateTimeMinutes })
        ) {
            throw new BusinessException(
                'Dados de vídeo incorreto',
                'CHECK_APPOINTMENT_VIDEO_LATE'
            )
        }

        return appointment
    }
}
