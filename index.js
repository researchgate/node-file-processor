'use strict';

const { EventEmitter } = require('events');
const globStream = require('glob-stream');
const workerFarm = require('worker-farm');

class FileProcessor extends EventEmitter {
  constructor(globPattern, worker, options) {
    super();
    options = options || {};
    const glob = (this.glob = globStream(globPattern));
    this.invokeWorker = options.invokeWorker || defaultInvokeWorker;
    const workers = (this.workers = workerFarm(options.worker || {}, worker));

    let allQueued = false;
    let errorHappened = false;
    let queuedCount = 0;
    let processedCount = 0;

    const checkForEnd = () => {
      if (errorHappened || (allQueued && queuedCount === processedCount)) {
        if (!options.keepAlive) {
          workerFarm.end(workers);
        }
        if (!errorHappened) this.emit('end');
      }
    };

    glob.on('data', ({ path }) => {
      queuedCount++;
      this.emit('queued', path);
      this.process(path, (err, result) => {
        processedCount++;
        if (err) {
          errorHappened = true;
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

  process(path, callback) {
    this.invokeWorker(this.workers, path, callback);
  }

  destroy(callback) {
    this.glob.destroy();
    workerFarm.end(this.workers, callback);
  }
}

function defaultInvokeWorker(workers, path, callback) {
  workers(path, callback);
}

module.exports = FileProcessor;
