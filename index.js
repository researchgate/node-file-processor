const { EventEmitter } = require('events');
const { Glob } = require('glob');
const workerFarm = require('worker-farm');

class FileProcessor extends EventEmitter {
    constructor(globPattern, worker) {
        super();
        const glob = (this.glob = new Glob(globPattern));
        const workers = (this.workers = workerFarm(worker));

        let allQueued = false;
        let queuedCount = 0;
        let processedCount = 0;

        const checkForEnd = () => {
            if (allQueued && queuedCount === processedCount) {
                workerFarm.end(workers);
                this.emit('end');
            }
        };

        glob.on('match', fileName => {
            queuedCount++;
            this.emit('queued', fileName);
            workers(fileName, (err, result) => {
                processedCount++;
                if (err) {
                    this.emit('error', err);
                } else {
                    this.emit('processed', fileName, result);
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
        this.glob.abort();
        workerFarm.end(this.workers, callback);
    }
}

module.exports = FileProcessor;
