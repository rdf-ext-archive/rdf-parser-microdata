/* global describe, it */

var fs = require('fs')
var rdf = require('rdf-ext')()
var testUtils = require('rdf-test-utils')(rdf)
var MicrodataParser = require('../')
var N3Parser = require('rdf-parser-n3')

var simpleHtml = '<!DOCTYPE html><html><head><title>Test 001</title></head>' +
  '<body>' +
  '<p itemscope itemtype="http://schema.org/Person">This test created by <span itemprop="name">Gregg Kellogg</span>.</p>' +
  '</body></html>'

describe('Microdata parser', function () {
  describe('instance API', function () {
    describe('process', function () {
      it('should be supported', function (done) {
        var parser = new MicrodataParser()
        var counter = 0

        parser.process(simpleHtml, function () {
          counter++
        }).then(function () {
          if (counter === 0) {
            done('no triple processed')
          } else {
            done()
          }
        }).catch(function (error) {
          done(error)
        })
      })

      /* it('should use base parameter', function (done) {
        var parser = new MicrodataParser()
        var counter = 0

        parser.process(simpleHtml, function (triple) {
          console.log(triple.subject.toString())
          if (triple.subject.toString() === 'http://example.org/') {
            counter++
          }
        }, 'http://example.org/').then(function () {
          if (counter === 0) {
            done('no triple processed')
          } else {
            done()
          }
        }).catch(function (error) {
          done(error)
        })
      }) */

      it('should use filter parameter', function (done) {
        var parser = new MicrodataParser()
        var processed = false
        var filtered = false

        parser.process(simpleHtml, function () {
          processed = true
        }, null, function () {
          filtered = true

          return false
        }).then(function () {
          if (processed || !filtered) {
            done('no triple processed')
          } else {
            done()
          }
        }).catch(function (error) {
          done(error)
        })
      })

      it('should use done parameter', function (done) {
        var parser = new MicrodataParser()
        var counter = 0

        Promise.resolve(new Promise(function (resolve) {
          parser.process(simpleHtml, function () {
            counter++
          }, null, null, function () {
            resolve()
          })
        })).then(function () {
          if (counter === 0) {
            done('no triple processed')
          } else {
            done()
          }
        }).catch(function (error) {
          done(error)
        })
      })
    })

    describe('callback', function () {
      it('should be supported', function (done) {
        var parser = new MicrodataParser()

        Promise.resolve(new Promise(function (resolve) {
          parser.parse(simpleHtml, function () {
            resolve()
          })
        })).then(function () {
          done()
        }).catch(function (error) {
          done(error)
        })
      })

      it('should forward errors', function (done) {
        var parser = new MicrodataParser()

        Promise.resolve(new Promise(function (resolve, reject) {
          parser.parse('', function (error) {
            if (error) {
              reject(error)
            } else {
              resolve()
            }
          })
        })).then(function () {
          done('no error thrown')
        }).catch(function () {
          done()
        })
      })
    })

    describe('Promise', function () {
      it('should be supported', function (done) {
        var parser = new MicrodataParser()

        parser.parse(simpleHtml).then(function () {
          done()
        }).catch(function (error) {
          done(error)
        })
      })

      it('should forward error to Promise API', function (done) {
        var parser = new MicrodataParser()

        parser.parse('').then(function () {
          done('no error thrown')
        }).catch(function () {
          done()
        })
      })
    })

    describe('Stream', function () {
      it('should be supported', function (done) {
        var parser = new MicrodataParser()
        var counter = 0

        parser.stream(simpleHtml).on('data', function () {
          counter++
        }).on('end', function () {
          if (counter === 0) {
            done('no triple streamed')
          } else {
            done()
          }
        }).on('error', function (error) {
          done(error)
        })
      })
    })
  })

  describe('static API', function () {
    describe('process', function () {
      it('should be supported', function (done) {
        var counter = 0

        MicrodataParser.process(simpleHtml, function () {
          counter++
        }).then(function () {
          if (counter === 0) {
            done('no triple processed')
          } else {
            done()
          }
        }).catch(function (error) {
          done(error)
        })
      })

      /* it('should use base parameter', function (done) {
        var counter = 0

        MicrodataParser.process(simpleHtml, function (triple) {
          if (triple.subject.toString() === 'http://example.org/subject') {
            counter++
          }
        }, 'http://example.org/').then(function () {
          if (counter !== 1) {
            done('no triple processed')
          } else {
            done()
          }
        }).catch(function (error) {
          done(error)
        })
      }) */

      it('should use filter parameter', function (done) {
        var processed = false
        var filtered = false

        MicrodataParser.process(simpleHtml, function () {
          processed = true
        }, null, function () {
          filtered = true

          return false
        }).then(function () {
          if (processed || !filtered) {
            done('no triple processed')
          } else {
            done()
          }
        }).catch(function (error) {
          done(error)
        })
      })

      it('should use done parameter', function (done) {
        var counter = 0

        Promise.resolve(new Promise(function (resolve) {
          MicrodataParser.process(simpleHtml, function () {
            counter++
          }, null, null, function () {
            resolve()
          })
        })).then(function () {
          if (counter === 0) {
            done('no triple processed')
          } else {
            done()
          }
        }).catch(function (error) {
          done(error)
        })
      })
    })

    describe('callback', function () {
      it('should be supported', function (done) {
        Promise.resolve(new Promise(function (resolve) {
          MicrodataParser.parse(simpleHtml, function () {
            resolve()
          })
        })).then(function () {
          done()
        }).catch(function (error) {
          done(error)
        })
      })

      it('should forward errors', function (done) {
        Promise.resolve(new Promise(function (resolve, reject) {
          MicrodataParser.parse('', function (error) {
            if (error) {
              reject(error)
            } else {
              resolve()
            }
          })
        })).then(function () {
          done('no error thrown')
        }).catch(function () {
          done()
        })
      })
    })

    describe('Promise', function () {
      it('should be supported', function (done) {
        MicrodataParser.parse(simpleHtml).then(function () {
          done()
        }).catch(function (error) {
          done(error)
        })
      })

      it('should forward error to Promise API', function (done) {
        MicrodataParser.parse('').then(function () {
          done('no error thrown')
        }).catch(function () {
          done()
        })
      })
    })

    describe('Stream', function () {
      it('should be supported', function (done) {
        var counter = 0

        MicrodataParser.stream(simpleHtml).on('data', function () {
          counter++
        }).on('end', function () {
          if (counter === 0) {
            done('no triple streamed')
          } else {
            done()
          }
        }).on('error', function (error) {
          done(error)
        })
      })
    })
  })

  describe('microdata-rdf test suite', function () {
    var tests = [
      '0001',
      '0002',
      '0003',
      '0004',
      '0005',
      '0006',
      '0007',
      '0008',
      '0009',
      '0010',
      '0011',
      '0012',
      '0013',
      '0014',
      '0015',
      '0046',
      '0047',
      '0048',
      '0049',
      '0050',
      '0051',
      '0052',
      '0053',
      '0054',
      '0055',
      '0056',
      '0057',
      '0058',
      '0059',
      '0060',
      '0061',
      '0062',
      '0063',
      '0064',
      // '0065',
      // '0066',
      // '0067',
      '0068',
      '0069',
      '0070',
      // '0073',
      // '0074',
      '0075',
      '0076',
      '0077',
      '0078',
      '0079',
      '0080',
      // '0081',
      // '0082',
      '0083'
      // '0084'
    ]

    var runTest = function (number) {
      it('should pass test ' + number, function (done) {
        var microdataContent = fs.readFileSync('./test/support/microdata-rdf/' + number + '.html').toString()
        var nTriplesContent = fs.readFileSync('./test/support/microdata-rdf/' + number + '.ttl').toString()

        Promise.all([
          MicrodataParser.parse(microdataContent, null, 'http://example.com/' + number + '.html'),
          N3Parser.parse(nTriplesContent, null, 'http://example.com/' + number + '.html')
        ]).then(function (graphs) {
          return testUtils.p.assertGraphEqual(graphs[0], graphs[1])
        }).then(function () {
          done()
        }).catch(function (error) {
          done(error)
        })
      })
    }

    tests.forEach(function (number) {
      runTest(number)
    })
  })
})
