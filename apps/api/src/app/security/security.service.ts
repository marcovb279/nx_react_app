import { Injectable } from '@nestjs/common';
import {
  generateKey,
  readKey,
  decryptKey,
  readPrivateKey,
  createMessage,
  readMessage,
  encrypt,
  decrypt,
} from 'openpgp';

@Injectable()
export class SecurityService {
  generateKeyPair(name: string, email: string, password: string) {
    return generateKey({
      type: 'ecc', // Type of the key, defaults to ECC
      curve: 'p521', // ECC curve name, defaults to curve25519
      userIDs: [{ name: name, email: email }], // you can pass multiple user IDs
      passphrase:
        password !== undefined && password.length > 0 ? password : undefined, // protects the private key
      format: 'armored', // output key format, defaults to 'armored' (other options: 'binary' or 'object')
    }).then(({ privateKey, publicKey, revocationCertificate }) => {
      // console.log({ privateKey, publicKey, revocationCertificate });
      return {
        privateKey: privateKey,
        publicKey: publicKey,
        revocationCertificate: revocationCertificate,
      };
    });
  }

  decryptMessage(
    message: string,
    signingKey: string,
    decryptionKey: string,
    password?: string
  ) {
    return Promise.all([
      readKey({ armoredKey: signingKey }),
      readPrivateKey({ armoredKey: decryptionKey }).then((privKey) => {
        if (password !== undefined && password.length > 0)
          return decryptKey({ privateKey: privKey, passphrase: password });
        return privKey;
      }),
      readMessage({ armoredMessage: message }),
    ])
      .then(([signingKey, decryptionKey, message]) =>
        decrypt({
          message,
          verificationKeys: signingKey,
          decryptionKeys: decryptionKey,
        })
      )
      .then(({ data: decrypted, signatures }) => {
        return { message: decrypted, signatures: signatures };
      });
  }

  encryptMessage(
    message: string,
    encryptionKey: string,
    signingKey: string,
    password?: string
  ): Promise<string> {
    return Promise.all([
      readKey({ armoredKey: encryptionKey }),
      readPrivateKey({ armoredKey: signingKey }).then((privKey) => {
        if (password !== undefined && password.length > 0)
          return decryptKey({ privateKey: privKey, passphrase: password });
        return privKey;
      }),
      createMessage({ text: message }),
    ]).then(([encryptionKey, signingKey, message]) => {
      return encrypt({
        message: message,
        encryptionKeys: encryptionKey,
        signingKeys: signingKey,
      }).then((message) => <string>message);
    });
  }
}
