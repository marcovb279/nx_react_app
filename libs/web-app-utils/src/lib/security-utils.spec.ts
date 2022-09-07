import * as uuid from 'uuid';
import {
  generatePassword,
  generateKeyPair,
  GeneratedKey,
  GenerationParameters,
} from './security-utils';

describe('Security Utils', () => {
  it('should generate a password', () => {
    const length = Math.floor(Math.random() * 10) + 5;
    const pass = generatePassword(length);
    expect(pass).toBeTruthy();
    expect(pass.length).toEqual(length);
    console.log('Generated password: ' + pass);
  });

  it('should generate a key pair', async () => {
    const id = uuid.v4();
    const name = id.slice(0, 8);
    const email = id.slice(0, 8) + '@email.com';
    const password = generatePassword(10);
    const genParams = {
      name: name,
      email: email,
      password: password,
    } as GenerationParameters;
    await expect(
      generateKeyPair(genParams).then(
        ({ privateKey, publicKey, revocationCertificate }: GeneratedKey) => {
          expect(publicKey).toBeTruthy();
          expect(privateKey).toBeTruthy();
          expect(revocationCertificate).toBeTruthy();
          console.log('Public key: ' + publicKey);
          console.log('Private key: ' + privateKey);
          console.log('RevocationCertificate key: ' + revocationCertificate);
        }
      )
    ).resolves.not.toThrow;
  });
});
