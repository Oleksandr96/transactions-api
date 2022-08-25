import { Injectable } from '@nestjs/common';
import { FileResponseDto } from '@app/modules/files/dto/fileResponse.dto';
//import { path } from 'app-root-path';
import * as path from 'node:path';
import { ensureDir, writeFile } from 'fs-extra';
import * as fs from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class FilesService {
  async saveFiles(
    file: Express.Multer.File,
    currentUserId: number,
  ): Promise<FileResponseDto> {
    const uploadFolder = path.resolve(
      __dirname,
      'uploads',
      String(currentUserId),
    );

    await ensureDir(uploadFolder);
    const uniqName = `${Date.now()}-${file.originalname}`;
    await writeFile(path.resolve(uploadFolder, uniqName), file.buffer);

    return {
      url: path.resolve(uploadFolder, uniqName),
      name: uniqName,
    };
  }

  readCSV(path: string) {
    return fs.createReadStream(path).pipe(csv());
  }
}
