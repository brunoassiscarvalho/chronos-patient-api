// import {
//   CloudWatchLogs,
//   PutLogEventsCommand,
//   PutLogEventsCommandInput,
//   PutLogEventsCommandOutput,
// } from '@aws-sdk/client-cloudwatch-logs';

// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import Configurations from './configurations';

// class AWSConnections {
//   private cloudWatch: CloudWatchLogs;
//   private S3Client: S3Client;
//   private configurations: Configurations;

//   private nextToken: any;
//   constructor() {
//     this.configurations = new Configurations();
//     this.S3Client = new S3Client({ region: 'sa-east-1' });
//     this.cloudWatch = new CloudWatchLogs({ region: 'sa-east-1' });
//     this.nextToken = undefined;
//   }

//   public async info(
//     message: string,
//     timestamp: number,
//   ): Promise<PutLogEventsCommandOutput> {
//     let response: any;

//     try {
//       const command = this.createEventsCommand(
//         message,
//         timestamp,
//         this.nextToken,
//       );
//       response = await this.cloudWatch.send(command);
//       this.nextToken = response.nextSequenceToken;
//     } catch (error) {
//       const errorObject = error as any;
//       this.nextToken = errorObject.expectedSequenceToken;

//       const command = this.createEventsCommand(
//         message,
//         timestamp,
//         this.nextToken,
//       );
//       response = await this.cloudWatch.send(command);
//     }
//     return response;
//   }

//   private createEventsCommand(
//     message: string,
//     timestamp: number,
//     sequenceToken: string | undefined,
//   ): PutLogEventsCommand {
//     const input: PutLogEventsCommandInput = {
//       logGroupName: 'hm-patient-api',
//       logStreamName: 'hm-patient-api',
//       logEvents: [
//         {
//           timestamp,
//           message,
//         },
//       ],
//       sequenceToken: sequenceToken,
//     };
//     return new PutLogEventsCommand(input);
//   }

//   public upload(): Promise<any> {
//     return this.S3Client.send(
//       new PutObjectCommand({
//         Bucket: 'chronos-patient',
//         Key: 'teste.jpeg',
//         ContentType: 'image/jpeg',
//         Body: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAAwICAgICAwICAgMDAwMEBgQEBAQECAYGBQYJCAoKCQgJCQoMDwwKCw4LCQkNEQ0ODxAQERAKDBITEhATDxAQEP/bAEMBAwMDBAMECAQECBALCQsQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEP/AABEIAMgAyAMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAACP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAWAQEBAQAAAAAAAAAAAAAAAAAABAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCPAGgiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//Z',
//       }),
//     );
//   }
// }

// export default new AWSConnections();
