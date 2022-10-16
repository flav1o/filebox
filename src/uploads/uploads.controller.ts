import { IFile } from 'src/types';
import { Args } from '@nestjs/graphql';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Args('key') token: string,
  ): Promise<IFile> {
    return await this.uploadsService.uploadFiles(file, token);
  }
}
