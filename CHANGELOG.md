# [3.2.0](https://github.com/researchgate/node-file-processor/compare/v3.1.0...v3.2.0) (2020-12-22)


### Features

* Move to `fast-glob` and expose options for it. ([#48](https://github.com/researchgate/node-file-processor/issues/48)) ([3b5d2e5](https://github.com/researchgate/node-file-processor/commit/3b5d2e55d4ccb940ec3f7d812c0bf32256d7df09))

# [3.1.0](https://github.com/researchgate/node-file-processor/compare/v3.0.1...v3.1.0) (2020-06-03)


### Features

* Support configuring how workers are invoked ([cea4464](https://github.com/researchgate/node-file-processor/commit/cea4464ca9a22ccb01e4bd4c31aa55e8cea7c4e2))

## [3.0.1](https://github.com/researchgate/node-file-processor/compare/v3.0.0...v3.0.1) (2020-05-07)


# [3.0.0](https://github.com/researchgate/node-file-processor/compare/v2.0.0...v3.0.0) (2020-05-07)


### Features

* Drop support for node 8 ([fdee983](https://github.com/researchgate/node-file-processor/commit/fdee983b1299dc89dd7719db67a667233e60efc6))


### BREAKING CHANGES

* Only node 10.18.1 or newer is now supported

# [2.0.0](https://github.com/researchgate/node-file-processor/compare/v1.2.0...v2.0.0) (2018-03-21)


### Features

* Add keepAlive option ([f9fb05a](https://github.com/researchgate/node-file-processor/commit/f9fb05af299a411f517a848279820c5c8140315b))


### BREAKING CHANGES

* worker-farm options are moved to `options.worker` key.
* abort method renamed to destory.



# [1.2.0](https://github.com/researchgate/node-file-processor/compare/v1.1.0...v1.2.0) (2018-01-05)


### Bug Fixes

* Exit immediately if an error happened ([#7](https://github.com/researchgate/node-file-processor/issues/7)) ([b41e656](https://github.com/researchgate/node-file-processor/commit/b41e65616e3ed7d328d8fc9061f45ea792fc5a3e))


### Features

* **worker-farm:** Allow to pass-through options to worker-farm ([#6](https://github.com/researchgate/node-file-processor/issues/6)) ([64fb20d](https://github.com/researchgate/node-file-processor/commit/64fb20d9de420c601681c795d6ccdceddf799d6a))



# [1.1.0](https://github.com/researchgate/node-file-processor/compare/v1.0.0...v1.1.0) (2017-08-11)


### Features

* Support multiple paths ([3bc826e](https://github.com/researchgate/node-file-processor/commit/3bc826e8f729ab60bd9254f5b27dec39251362b8))



# [1.0.0](https://github.com/researchgate/node-file-processor/compare/815824ebe07c1bd6afe3e4508cc4d4ada79e4b82...v1.0.0) (2017-08-09)


### Features

* Implement library ([815824e](https://github.com/researchgate/node-file-processor/commit/815824ebe07c1bd6afe3e4508cc4d4ada79e4b82))
