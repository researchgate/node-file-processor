const path = require('path');
const workerPath = require.resolve('./worker');
const FileProcessor = require('..');

const examplePath = fileName => path.join(__dirname, 'example', fileName);
const pattern = examplePath('*.txt');

describe('success', () => {
    let fileProcessor = null;
    beforeEach(() => {
        fileProcessor = new FileProcessor(pattern, workerPath);
    });

    test('queued', () => {
        expect.assertions(3);
        const handler = jest.fn();
        fileProcessor.on('queued', handler);
        return new Promise(resolve => {
            fileProcessor.on('end', () => {
                expect(handler).toHaveBeenCalledWith(examplePath('1.txt'));
                expect(handler).toHaveBeenCalledWith(examplePath('2.txt'));
                expect(handler).toHaveBeenCalledWith(examplePath('3.txt'));
                resolve();
            });
        });
    });

    test('processed', () => {
        expect.assertions(3);
        const handler = jest.fn();
        fileProcessor.on('processed', handler);
        return new Promise(resolve => {
            fileProcessor.on('end', () => {
                expect(handler).toHaveBeenCalledWith(examplePath('1.txt'), 'a');
                expect(handler).toHaveBeenCalledWith(examplePath('2.txt'), 'b');
                expect(handler).toHaveBeenCalledWith(examplePath('3.txt'), 'c');
                resolve();
            });
        });
    });

    test('allQueued', () => {
        expect.assertions(1);
        const handler = jest.fn();
        fileProcessor.on('allQueued', handler);
        return new Promise(resolve => {
            fileProcessor.on('end', () => {
                expect(handler).toHaveBeenCalledWith(
                    expect.objectContaining({
                        queuedCount: 3,
                        processedCount: expect.any(Number),
                    })
                );
                resolve();
            });
        });
    });

    test('abort', () => {
        return new Promise(resolve => {
            fileProcessor.abort(resolve);
        });
    });

    test('multiple paths', () => {
        const fileProcessor = new FileProcessor([examplePath('1.txt'), examplePath('3.txt')], workerPath);

        expect.assertions(3);
        const handler = jest.fn();
        fileProcessor.on('queued', handler);
        return new Promise(resolve => {
            fileProcessor.on('end', () => {
                expect(handler).toHaveBeenCalledWith(examplePath('1.txt'));
                expect(handler).not.toHaveBeenCalledWith(examplePath('2.txt'));
                expect(handler).toHaveBeenCalledWith(examplePath('3.txt'));
                resolve();
            });
        });
    });
});
