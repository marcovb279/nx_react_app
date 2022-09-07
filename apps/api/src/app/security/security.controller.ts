import { Body, Controller, Get, Post } from '@nestjs/common';
import { SecurityService } from './security.service';
import { EncryptedMessageDTO } from './security.models';

import { environment } from '../../environments/environment';
import * as fs from 'fs';
import * as path from 'path';

const PGPPublicKey = fs
  .readFileSync(path.join(__dirname, environment.PGP_PUBLIC_KEY as string))
  .toString();
const PGPPrivateKey = fs
  .readFileSync(path.join(__dirname, environment.PGP_SECRET_KEY as string))
  .toString();
const PGPPrivateKeyPassword = fs
  .readFileSync(
    path.join(__dirname, environment.PGP_SECRET_KEY_PASSWORD as string)
  )
  .toString();

@Controller({ path: 'security' })
export class SecurityController {
  constructor(private securityService: SecurityService) {}

  @Get()
  getPublicKey() {
    return { key: PGPPublicKey };
  }

  @Post()
  decryptMessage(@Body() encryptedMessage: EncryptedMessageDTO) {
    console.log(encryptedMessage);
    return this.securityService.decryptMessage(
      encryptedMessage.message,
      encryptedMessage.signingKey,
      PGPPrivateKey,
      PGPPrivateKeyPassword
    );
  }
}
