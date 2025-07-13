import { Request } from 'express';
import BusinessException from '../../exceptions/BusinessException';
import Symptom, { ISymptom } from './symptom';

export default class SymptomController {
  /**
   * Get one symptom by id
   * @param res
   * @returns
   */
  public async getSymptoms(): Promise<ISymptom[]> {
    try {
      const symptom = await Symptom.find({ active: true });
      if (!symptom)
        throw new BusinessException(
          'Sintomas não encontrados',
          'SYMPTOMS_NOT_FOUND',
        );
      return symptom;
    } catch (error) {
      throw new BusinessException(
        'Dados incompletos',
        'SYMPTOMS_FIND_ERRO',
        error,
      );
    }
  }

  /**
   * Get one symptom by id
   * @returns
   */
  public async getSymptom(req: Request): Promise<ISymptom> {
    try {
      const { symptomId } = req.params;
      const symptom: ISymptom | null = await Symptom.findById(symptomId).lean();
      if (!symptom)
        throw new BusinessException(
          'Dados incompletos',
          'SYMPTOM_NOT_FIND_ERRO',
        );
      return symptom;
    } catch (error) {
      throw new BusinessException(
        'Dados incompletos',
        'SYMPTOM_FIND_ERRO',
        error,
      );
    }
  }
}
