const path = require('path');
const workerPath = require.resolve('./workers/error-worker');
const FileProcessor = require('..');

const examplePath = (fileName) => path.join(__dirname, 'example', fileName);
const pattern = examplePath('*.txt');

describe('fails', () => {
  let fileProcessor = null;
  beforeEach(() => {
    fileProcessor = new FileProcessor(pattern, workerPath);
  });

  test('reports error in worker', () => {
    expect.assertions(1);
    return new Promise((resolve) => {
      fileProcessor.on('error', (err) => {
        expect(err).toEqual(new Error('Not today'));
        resolve();
      });
    });
  });
});
