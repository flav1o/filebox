import * as streamifier from 'streamifier';

export const createReadStream = (buffer: Buffer) => {
  return streamifier.createReadStream(buffer);
};
