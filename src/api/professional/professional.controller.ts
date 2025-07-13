import BusinessException from '../../exceptions/BusinessException';
import { Request } from 'express';

import Professional, { IProfessional } from './professional';

export default class UsesrController {
  public async getProfessionals(): Promise<IProfessional[]> {
    return Professional.find(
      {
        role: { $nin: ['admin', 'concierge'] },
        status: 'active',
      },
      { name: 1, position: 1, _id: 1, image: 1 },
    ).lean();
  }

  public async getProfessional(req: Request): Promise<any> {
    try {
      const professional = await Professional.findById(
        req.params.professionalId,
      );
      if (!professional)
        throw new BusinessException(
          'Não foi possível localizar o profissional',
          'GET_PROFFISIONAL_ERRO',
        );
      const { _id, name, position } = professional;

      return { _id, name, position };
    } catch (error) {
      throw new BusinessException(
        'Não foi possível localizar o profissional',
        'GET_PROFFISIONAL_ERRO',
        error,
      );
    }
  }
}
