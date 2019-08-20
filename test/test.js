const path = require('path');
const workerPath = require.resolve('./workers/worker');
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

    test('destroy', () => {
        return new Promise(resolve => {
            fileProcessor.destroy(resolve);
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

    describe('keepAlive', () => {
        let processor;

        beforeEach(() => {
            processor = new FileProcessor(examplePath('1.txt'), workerPath, { keepAlive: true });
        });

        test('allows to process more files after initial pass', () => {
            expect.assertions(2);
            return new Promise(resolve => {
                processor.on('end', () => {
                    processor.process(examplePath('2.txt'), (error, result) => {
                        expect(error).toBe(null);
                        expect(result).toEqual('b');
                        resolve();
                    });
                });
            });
        });

        afterEach(() => {
            return new Promise(resolve => {
                processor.destroy(resolve);
            });
        });
    });
});
