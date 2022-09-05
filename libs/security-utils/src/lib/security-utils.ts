import {
  generateKey,
  readKey,
  decryptKey,
  readPrivateKey,
  createMessage,
  encrypt,
  decrypt,
} from 'openpgp/lightweight';
import { Key, PrivateKey, Message } from 'openpgp/lightweight';

export interface GeneratedKey {
  privateKey: string;
  publicKey: string;
  revocationCertificate: string;
}
export interface GenerationParameters {
  name: string;
  email: string;
  password?: string;
}

export function generatePassword(length: number) {
  return Math.random().toString(36).slice(-Math.abs(length));
}

export function generateKeyPair({
  name,
  email,
  password,
}: GenerationParameters): Promise<GeneratedKey> {
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
    } as GeneratedKey;
  });
}

export function decryptMessage() {
  // TODO: add logic for decrypting
}

export function encryptMessage(
  message: string,
  encryptionKey: string,
  signingKey: string,
  password: string
): Promise<string> {
  return Promise.all([
    readKey({ armoredKey: encryptionKey }),
    readPrivateKey({ armoredKey: signingKey }).then((privKey) =>
      decryptKey({ privateKey: privKey, passphrase: password })
    ),
    createMessage({ text: message }),
  ]).then(([encryptionKey, signingKey, message]) => {
    return encrypt({
      message: message,
      encryptionKeys: encryptionKey,
      signingKeys: signingKey,
    }).then((message) => <string>message);
  });
}
