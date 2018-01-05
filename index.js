const { EventEmitter } = require('events');
const globStream = require('glob-stream');
const workerFarm = require('worker-farm');

class FileProcessor extends EventEmitter {
    constructor(globPattern, worker, options) {
        super();
        const glob = (this.glob = globStream(globPattern));
        const workers = (this.workers = workerFarm(options || {}, worker));

        let allQueued = false;
        let queuedCount = 0;
        let processedCount = 0;

        const checkForEnd = () => {
            if (allQueued && queuedCount === processedCount) {
                workerFarm.end(workers);
                this.emit('end');
            }
        };

        glob.on('data', ({ path }) => {
            queuedCount++;
            this.emit('queued', path);
            workers(path, (err, result) => {
                processedCount++;
                if (err) {
                    this.emit('error', err);
                } else {
                    this.emit('processed', path, result);
                }

                checkForEnd();
            });
        });

        glob.on('end', () => {
            allQueued = true;
            this.emit('allQueued', { queuedCount, processedCount });
            checkForEnd();
        });
    }

    abort(callback) {
        this.glob.destroy();
        workerFarm.end(this.workers, callback);
    }
}

module.exports = FileProcessor;
