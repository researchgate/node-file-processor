const path = require('path');
const workerPath = require.resolve('./workers/error-worker');
const FileProcessor = require('..');

const examplePath = (fileName) => path.join(__dirname, 'example', fileName);
const pattern = examplePath('*.txt');

describe('fails', () => {
  test('reports error in worker', (done) => {
    const fileProcessor = new FileProcessor(pattern, workerPath);
    fileProcessor.on('error', (err) => {
      expect(err).toEqual(new Error('Not today'));
      done();
    });
  });
});
