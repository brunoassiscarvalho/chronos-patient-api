// import { Request, Response, NextFunction, Application } from 'express';
// import InfoController from './info.controller';
// import packageJson from '../../../package.json';

// export class InfoApi {
//   private defaultPath = '/info';

//   public infoController: InfoController = new InfoController();

//   public routes(app: Application): void {
//     app.get('/', (_req: Request, res: Response) => {
//       const { name, version, description } = packageJson;
//       res.json({ name, version, description });
//     });

//     app.get(
//       this.defaultPath,
//       async (_req: Request, res: Response, next: NextFunction) => {
//         this.infoController
//           .getInfos()
//           .then((result) => {
//             res.json(result);
//             next();
//           })
//           .catch((e) => next(e));
//       },
//     );
//   }
// }
