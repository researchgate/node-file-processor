# file-processor

Node.js utility for mass-processing files in parallel.

## Usage

Files are handled in parallel running workers. In order to use the library you
need 2 modules.

### Worker module

Must export single function, accepting `fileName` and `callback`. This function
must process the file and call the `callback` when it is done. Function can be
asynchronous.


```js
module.exports = function (fileName, callback) {
    const result = doExpensiveProcessing(fileName);
    callback(null, result); 
}
```

### Main module

Must use `FileProcessor` class and provide a it a glob pattern and path to
worker module. Each file, matching the pattern will be processed by worker
module.

```js
const FileProcessor = require('@researchgate/file-processor');
const processor = new FileProcessor(
    'path/to/some/files/*.txt',
    require.resolve('./worker')
);

processor.on('processed', (fileName, result) => {
    console.log(`result for ${fileName}: ${result}`);
});
```

`FileProcessor` instace emits following events:

* `queued` - file is queued for processing.
  
  Arguments:

    * `fileName`


* `processed` - file is successfully processed by worker.

  Arguments:

    * `fileName`
    * `result` - the result, returned by worker module 

* `error` - worker failed to process the file

  Arguments:

    * `error`

* `allQueued` - all files, matching the pattern are queued for processing.

  Arguments:

    * `stats` - object with the following field
      
      * `queuedCount` - total number of queued files
      * `processedCount` - total number of files which are already processed

* `end` - all files are processed.
