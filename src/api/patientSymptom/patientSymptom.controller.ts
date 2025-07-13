import BusinessException from '../../exceptions/BusinessException';
import { Request, Response } from 'express';
import PatientSymptom, { IPatientSymptom } from './patientSymptom';
import { IPatientLogged } from '../patient/patient';

export default class PatientSymptomController {
  /**
   * Get one patientSymptom by id
   * @param res
   * @returns
   */
  public async getPatientSymptoms(res: Response): Promise<IPatientSymptom> {
    const { userId } = res.locals;
    try {
      const patientSymptom = await PatientSymptom.findOne({ patient: userId });
      if (!patientSymptom)
        throw new BusinessException(
          'Sintomas não encontrados',
          'PATIENTSYMPTOMS_NOT_FOUND',
        );
      return patientSymptom;
    } catch (error) {
      throw new BusinessException(
        'Dados incompletos',
        'PATIENTSYMPTOM_FIND_ERRO',
        error,
      );
    }
  }

  /**
   * Create patientSymptom
   * @param req
   */
  public async createPatientSymptom(
    req: Request,
    res: Response,
  ): Promise<IPatientSymptom> {
    const patient: IPatientLogged = res.locals as IPatientLogged;
    const { level, dateTime, note } = req.body;
    if (!level || !dateTime)
      throw new BusinessException(
        'Dados incompletos',
        'PATIENTSYMPTOM_INCOMPLET_DATA',
      );

    // create new paciente on bd
    let patientSymptom: IPatientSymptom;

    try {
      patientSymptom = await PatientSymptom.create({
        level,
        dateTime,
        note,
        patient: patient.userId,
      });
    } catch (err: any) {
      throw new BusinessException(
        'Não foi possível realizar o cadastro',
        'PATIENTSYMPTOM_CREATE_ERROR',
        err,
      );
    }

    return patientSymptom;
  }
}
