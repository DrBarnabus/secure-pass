import { bufferFromSafeBase64, bufferToSafeBase64 } from '..';

describe('base64', () => {
  describe('bufferFromSafeBase64', () => {
    test('Should convert a valid url-safe base64 string into a buffer.', () => {
      const expected = Buffer.from('TestString');
      const buffer = bufferFromSafeBase64('VGVzdFN0cmluZw');
      expect(buffer.compare(expected)).toEqual(0);
    });
  });

  describe('bufferToSafeBase64', () => {
    test('Should convert a buffer into a valid url-safe base64 string.', () => {
      const expected = 'VGVzdFN0cmluZw';
      const base64 = bufferToSafeBase64(Buffer.from('TestString'));
      expect(base64).toEqual(expected);
    });
  });
});
