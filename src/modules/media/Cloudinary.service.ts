import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import toStream = require('buffer-to-stream');
import { UploadApiResponse, UploadApiErrorResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  #logger = new Logger(CloudinaryService.name);
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      return new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream(
          { folder: 'CandyCakes' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        toStream(file.buffer).pipe(upload);
      });
    } catch (error) {
      this.#logger.error({ errorCloud: { ...error } });
      throw new InternalServerErrorException();
    }
  }

  removeImage(public_id: string) {
    return new Promise((resolve, reject) => {
      v2.uploader
        .destroy(public_id)
        .then(result => {
          resolve(result);
        })
        .catch(e => {
          this.#logger.error({ e });
          reject(e.message);
        });
    });
  }
}
