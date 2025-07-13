import BusinessException from '../../exceptions/BusinessException'
import { Request, Response } from 'express'
import { auth } from 'firebase-admin'
import EMailController from '../../email/email.controller'
import {
    getAuth,
    signInWithEmailAndPassword,
    UserCredential,
} from 'firebase/auth'
import { decodePassAuthorization } from '../../util/Utils'
import Patient, { IPatient, IPatientBase, IPatientComplement } from './patient'
import jwt from 'jsonwebtoken'
import { jwt as TwillioJwt } from 'twilio'
import { Client } from '@twilio/conversations'
import Configurations from '../../core/configurations'
// import AWSConnections from '../../core/AWSConnections';

export default class UsesrController {
    private mailController: EMailController
    private configurations: Configurations

    constructor() {
        this.configurations = new Configurations()
        this.mailController = new EMailController()
    }

    /**
     * Get one patient by id
     * @param res
     * @returns
     */
    public async getPatient(res: Response): Promise<IPatient> {
        const { userId } = res.locals
        try {
            const patient = await Patient.findById(userId)
            if (!patient)
                throw new BusinessException(
                    'Dados incompletos',
                    'PATIENT_NOT_FOUND'
                )
            return patient
        } catch (error) {
            throw new BusinessException(
                'Dados incompletos',
                'PATIENT_FIND_ERRO'
            )
        }
    }

    /**
     * Create patient
     * @param req
     */
    public async createPatient(req: Request): Promise<any> {
        const { email, password } = decodePassAuthorization(req.headers)

        const { name, phone, zipCode, gender, birthDate } = req.body
        if (
            !name ||
            !phone ||
            !zipCode ||
            !email ||
            !password ||
            !gender ||
            !birthDate
        )
            throw new BusinessException('Dados incompletos', 'PATIENT001')

        // create new paciente on bd
        let patient: IPatient | null = null

        try {
            patient = await Patient.create({
                email,
                name,
                phone,
                zipCode,
                gender,
                birthDate,
            })
        } catch (err: any) {
            if (err.code === 11000) {
                try {
                    const user = await auth().getUserByEmail(email)
                    if (user)
                        throw new BusinessException(
                            'Você já esta cadastrado na nossa base',
                            'PATIENT_ALREADY_EXISTS_BD1_BD2',
                            err
                        )
                } catch (error) {
                    if (!patient) {
                        patient = await Patient.find({ email }).lean()
                        if (!patient)
                            throw new BusinessException(
                                'Você já esta cadastrado na nossa base',
                                'PATIENT_ALREADY_EXISTS_BD1_BD2',
                                err
                            )
                        await this.createFirebasePatient({
                            uid: patient._id,
                            email,
                            password,
                        })
                    }

                    throw new BusinessException(
                        'Você já esta cadastrado na nossa base',
                        'PATIENT_ALREADY_EXISTS_BD1_BD2',
                        err
                    )
                }
            }
            throw new BusinessException(
                'Não foi possível realizar o cadastro',
                'PATIENT_CREATE_ERROR',
                err
            )
        }
        if (!patient)
            throw new BusinessException(
                'Cliente não cadastrado',
                'PATIENT_EERO_BD1'
            )

        await this.createFirebasePatient({ uid: patient.id, email, password })

        await this.createTwilioPatient({
            uid: patient.id,
            email,
            name,
        })

        try {
            await this.sendVerificationEmail(req)
        } catch (error) {
            throw new BusinessException(
                'Não foi possível enviar o email de confirmação',
                'PATIENT_EMAIL_ERROR_BD2',
                error
            )
        }
    }

    private async createFirebasePatient({ uid, email, password }: any) {
        try {
            await auth().createUser({
                uid,
                email,
                password,
                emailVerified: false,
            })
        } catch (err: any) {
            if (err?.errorInfo?.code === 'auth/email-already-exists') {
                throw new BusinessException(
                    'O cadastro já existe na base',
                    'PATIENT_ALREADY_EXISTS_BD2',
                    err
                )
            }
            throw new BusinessException(
                'Não foi possível criar o cadastro de segurança',
                'PATIENT_REGISTER_ERROR_BD2',
                err
            )
        }
    }

    private async createTwilioPatient({ uid, email, name }: any) {
        const { accountSid, keySid, secret, serviceId } =
            this.configurations.TWILLIO
        if (!accountSid || !keySid || !secret)
            throw new BusinessException(
                'Dados de vídeo incorreto',
                'TWILLIO_VIDEO_TOKEN_ERRO'
            )

        const token = new TwillioJwt.AccessToken(accountSid, keySid, secret, {
            identity: uid,
        })

        const chatGrant = new TwillioJwt.AccessToken.ChatGrant({
            serviceSid: serviceId,
        })
        token.addGrant(chatGrant)

        const client = new Client(token.toJwt())
        client.user.updateFriendlyName(name)
        client.user.updateAttributes({
            email: email,
        })
    }

    /**
     * Send verification Mail to patient
     * @param req
     * @returns
     */
    public async sendVerificationEmail(req: Request): Promise<string> {
        const { email, password } = decodePassAuthorization(req.headers)
        try {
            await signInWithEmailAndPassword(getAuth(), email, password)
            const patient: IPatient = await Patient.findOne({ email }).lean()
            const link: string = await auth().generateEmailVerificationLink(
                email,
                {
                    url: req.get('origin') || 'http://localhost:3000',
                }
            )

            await this.mailController.sendMail({
                to: email,
                subject: 'Bem Vindo!',
                context: {
                    userName: patient.name,
                    link,
                    userMessage: 'bem vindo a chronos!',
                    primaryMessage:
                        'A partir de agora você poderá contar com nosso time de especialistas para te acompanhar durante a jornada oncológica',
                },
            })

            return 'deu certo'
        } catch (error) {
            throw new BusinessException(
                'Não foi possível enviar o email de confirmação',
                'PATIENT002',
                error
            )
        }
    }

    /**
     * Update complement patient data register
     * @param reqi
     * @param res
     * @returns
     */

    public async updateComplementRegistration(
        req: Request,
        res: Response
    ): Promise<IPatientComplement> {
        const { userId } = res.locals
        const {
            cancerType,
            cancerStage,
            religion,
            maritalStatus,
            occupation,
            treatmentSite,
            allergy,
            ocologistName,
        }: IPatientComplement = req.body
        try {
            const user: IPatientComplement | null =
                await Patient.findByIdAndUpdate(userId, {
                    cancerType,
                    cancerStage,
                    religion,
                    maritalStatus,
                    occupation,
                    treatmentSite,
                    allergy,
                    ocologistName,
                })
            if (!user)
                throw new BusinessException(
                    'Não foi possivel realizar a identificação',
                    'PATIENT_INVALID_ON_COMPLEMENT'
                )
            return user
        } catch (error) {
            throw new BusinessException(
                'Não foi possível atualizar os dados de cadastro',
                'PATIENT_COMPLEMENT_ERROR',
                error
            )
        }
    }

    /**
     *Update basic patient data register
     * @param req
     * @param res
     * @returns
     */
    public async updateBaseRegistration(
        req: Request,
        res: Response
    ): Promise<IPatientBase> {
        const { userId } = res.locals
        const {
            name,
            email,
            birthDate,
            gender,
            image,
            phone,
            zipCode,
        }: IPatientBase = req.body
        try {
            const user: IPatientBase | null = await Patient.findByIdAndUpdate(
                userId,
                {
                    name,
                    email,
                    birthDate,
                    gender,
                    image,
                    phone,
                    zipCode,
                }
            )
            if (!user)
                throw new BusinessException(
                    'Não foi possivel realizar a identificação',
                    'PATIENT_INVALID_ON_BASE_UPDATE'
                )
            return user
        } catch (error) {
            throw new BusinessException(
                'Não foi possível atualizar os dados de cadastro',
                'PATIENT_BASE_ERROR_ON_UPDATE',
                error
            )
        }
    }

    public async updateImage(req: Request, res: Response): Promise<any> {
        const { userId } = res.locals
        const { image }: IPatient = req.body

        // return AWSConnections.upload();
    }

    /**
     * Request email confirmation and send mail with link
     * @param req
     * @param res
     */
    public async requestChangeEmail(req: Request, res: Response): Promise<any> {
        const { userId } = res.locals
        const { newEmail }: any = req.body

        if (!newEmail) {
            throw new BusinessException(
                'O Novo email não foi enviado',
                'PATIENT_ERROR_EMAIL_UPDATE'
            )
        }
        const patient = await Patient.findById(userId)
        if (!patient) {
            throw new BusinessException(
                'Não foi possivel localizar o cadastro',
                'PATIENT_ERROR_EMAIL_UPDATE'
            )
        }

        if (patient.email === newEmail) {
            throw new BusinessException(
                'O email enviado é igual ao que está sendo utilizado',
                'PATIENT_ERROR_EMAIL_UPDATE_NOT_NEW'
            )
        }

        const token = this.generateToken({
            userId,
            newEmail,
        })

        const domain = req.get('origin') || 'http://localhost:3000'

        return this.mailController.sendMail({
            to: newEmail,
            subject: 'Troca de email!',
            context: {
                userName: patient.name,
                link: `${domain}/email-change-confirmation?t=${token}`,
                userMessage: 'você solicitou a troca de seu email',
                primaryMessage:
                    'Se você solicitou a troca do seu email de acesso da chronos aperte o botão abaixo para confirmar',
            },
        })
    }

    /**
     * Email update confirmation
     * @param req
     * @returns
     */
    public async confirmChangeEmail(req: Request): Promise<any> {
        const { email, password } = decodePassAuthorization(req.headers)

        const userLogged: UserCredential = await signInWithEmailAndPassword(
            getAuth(),
            email,
            password
        )

        if (!userLogged.user.emailVerified) {
            throw new BusinessException(
                'Não foi possivel realizar a identificação',
                'PATIENT_ERROR_EMAIL_UPDATE_NOT_VERIFIED'
            )
        }

        const { token, newEmail }: any = req.body

        const decodedToken = this.decodeToken(token)

        if (newEmail !== decodedToken.newEmail) {
            throw new BusinessException(
                'Os emails enviados estão divergentes',
                'PATIENT_ERROR_EMAIL_UPDATE_NOT_EQUALS_EMAILS'
            )
        }

        if (userLogged.user.uid !== decodedToken.userId) {
            throw new BusinessException(
                'Os emails enviados estão divergentes',
                'PATIENT_ERROR_EMAIL_UPDATE_NOT_EQUALS_ID'
            )
        }

        if (userLogged.user.email === decodedToken.newEmail) {
            throw new BusinessException(
                'Os emails enviados sçao iguais',
                'PATIENT_ERROR_EMAIL_UPDATE_EQUALS_EMAILS'
            )
        }

        try {
            const user: IPatientBase | null = await Patient.findByIdAndUpdate(
                userLogged.user.uid,
                { email: newEmail }
            )
            if (!user)
                throw new BusinessException(
                    'Não foi possivel realizar a identificação',
                    'PATIENT_INVALID_ON_BASE_UPDATE'
                )
        } catch (error) {
            throw new BusinessException(
                'Não foi possível atualizar os dados de cadastro',
                'PATIENT_BASE_ERROR_ON_UPDATE',
                error
            )
        }

        try {
            await auth().updateUser(userLogged.user.uid, {
                email: newEmail,
            })
        } catch (error) {
            // in case of error roolback on mongo
            await Patient.findByIdAndUpdate(userLogged.user.uid, {
                email: userLogged.user.email,
            })
            throw new BusinessException(
                'Não foi possivel realizar a identificação',
                'PATIENT_ERROR_EMAIL_UPDATE_NOT_POSSIBLE',
                error
            )
        }
    }

    private generateToken(
        data: any,
        expires: string | number = 30000,
        dataMode = 'DATA_MODE'
    ): string {
        const passphrase: string | undefined = process.env[dataMode]
        if (passphrase)
            return jwt.sign(data, passphrase, { expiresIn: expires })
        throw new BusinessException(
            'Não foi possível atualizar os dados de cadastro',
            'PATIENT_BASE_ERROR_ON_UPDATE'
        )
    }

    private decodeToken(token: string, dataMode = 'DATA_MODE'): any {
        const passphrase: string | undefined = process.env[dataMode]
        if (!passphrase)
            throw new BusinessException(
                'Os emails enviados estão divergentes',
                'PATIENT_ERROR_EMAIL_UPDATE_NOT_EQUALS_EMAILS'
            )
        return jwt.verify(token, passphrase)
    }

    /**
     * Send verification Mail to patient
     * @param req
     * @returns
     */
    public async sendResetPassEmail(req: Request): Promise<string> {
        const { userEmail } = req.body
        try {
            const patient: IPatient = await Patient.findOne({
                userEmail,
            }).lean()

            const link: string = await auth().generatePasswordResetLink(
                userEmail,
                {
                    url: req.get('origin') || 'http://localhost:3000',
                }
            )

            return this.mailController.sendMail({
                to: userEmail,
                subject: 'Troca de senha!',
                context: {
                    userName: patient.name,
                    link,
                    userMessage: 'você solicitou a troca de sua senha',
                    primaryMessage:
                        'Se você solicitou a troca de sua senha de acesso da chronos aperte o botão abaixo para confirmar',
                },
            })
        } catch (error) {
            throw new BusinessException(
                'Não foi possível enviar o email para reset de senha',
                'PATIENT_RESET_PASS_ERROR',
                error
            )
        }
    }
}
