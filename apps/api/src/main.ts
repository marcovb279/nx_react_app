/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { environment } from './environments/environment';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // const readFiles = (root: string, tab: string) => {
  //   fs.readdir(root, { withFileTypes: true }, (err, files) => {
  //     if (err) throw err;
  //     files.forEach((dirent) => {
  //       console.log(tab + path.join(root, dirent.name));
  //       if (dirent.isDirectory())
  //         readFiles(path.join(root, dirent.name), tab + tab);
  //     });
  //   });
  // };
  // console.log(__dirname);
  // readFiles(__dirname, '     ');

  console.log(path.join(__dirname, environment.SSL_SELFSIGNED_KEY as string))
  console.log(path.join(__dirname, environment.SSL_SELFSIGNED_CERT as string))

  const httpsOptions = {
    key: fs.readFileSync(
      path.join(__dirname, environment.SSL_SELFSIGNED_KEY as string)
    ),
    cert: fs.readFileSync(
      path.join(__dirname, environment.SSL_SELFSIGNED_CERT as string)
    ),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = environment.SERVER_PORT;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
