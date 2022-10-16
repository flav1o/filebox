import { IFile } from 'src/types';
import { v4 as uuidv4 } from 'uuid';
import * as oneDriveAPI from 'onedrive-api';
import { createReadStream } from './uploads.utils';
import { FILE_SIZES_CATEGORY } from 'src/constants';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

interface IUploadFile {
  filename: string;
  readableStream: Buffer;
  accessToken: string;
  fileSize?: number;
}

@Injectable()
export class UploadsService {
  async uploadFiles(mFile: Express.Multer.File, token: string): Promise<IFile> {
    const { buffer, originalname, size } = mFile;

    const generatedName = originalname + '-' + uuidv4();
    const mimetype = mFile.mimetype.split('/')[1];

    const file = {
      fileSize: size,
      accessToken: token,
      readableStream: createReadStream(buffer),
      filename: `${generatedName}.${mimetype}`,
    };

    const data =
      size < FILE_SIZES_CATEGORY.SMALL_FILE
        ? await this.uploadSmallFiles(file)
        : await this.uploadLargeFiles(file);

    //TODO: create uploads model
    //TODO: create file document

    return {
      _id: data.id,
      name: data.name,
      size: data.size,
      createdAt: data.createdDateTime,
      uri: data['@microsoft.graph.downloadUrl'],
    };
  }

  async uploadSmallFiles(file: IUploadFile) {
    const { readableStream, filename, accessToken } = file;

    return oneDriveAPI.items
      .uploadSimple({
        path: '',
        content: '',
        filename,
        readableStream,
        accessToken,
      })
      .catch((err) => new HttpException(err.message, HttpStatus.BAD_REQUEST));
  }

  async uploadLargeFiles(file: IUploadFile) {
    const { readableStream, filename, accessToken, fileSize } = file;

    return oneDriveAPI.items
      .uploadSession({
        accessToken,
        filename,
        fileSize,
        readableStream,
      })
      .catch((err) => new HttpException(err.message, HttpStatus.BAD_REQUEST));
  }
}
