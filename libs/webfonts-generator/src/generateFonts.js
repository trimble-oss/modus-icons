var fs = require('fs');
var _ = require('underscore');
var Q = require('q');

var svgicons2svgfont = require('svgicons2svgfont');
var svg2ttf = require('svg2ttf');
var ttf2woff = require('ttf2woff');
var ttf2woff2 = require('ttf2woff2');
var ttf2eot = require('ttf2eot');

/**
 * Generators for files of different font types.
 *
 * Generators have following properties:
 * [deps] {array.<string>} Names of font types that will be generated before current
 *		and passed to generator function.
 * fn {function(options, ...depsFonts, done)} Generator function with following arguments:
 *	 options {object} Options passed to 'generateFonts' function.
 *	 ...depsFonts Fonts listed in deps.
 *	 done {function(err, font)} Callback that takes error or null and generated font.
 */
var generators = {
  svg: {
    fn: function (options, done) {
      var font = new Buffer.alloc(0);
      var svgOptions = _.pick(
        options,
        'fontName',
        'fontHeight',
        'descent',
        'normalize',
        'round'
      );

      if (options.formatOptions['svg']) {
        svgOptions = _.extend(svgOptions, options.formatOptions['svg']);
      }

      svgOptions.log = function () {};

      var fontStream = svgicons2svgfont(svgOptions)
        .on('data', function (data) {
          font = Buffer.concat([font, data]);
        })
        .on('end', function () {
          done(null, font.toString());
        })
        .on('error', function (error) {
          console.error('[FONT DEBUG] FontStream error:', error);
          done(error);
        });

      _.each(options.files, function (file, idx) {
        console.log(`[FONT DEBUG] Processing file ${idx + 1}/${options.files.length}: ${file}`);

        try {
          // Read the SVG file content to check for issues
          var svgContent = fs.readFileSync(file, 'utf8');
          console.log(`[FONT DEBUG] SVG content length: ${svgContent.length}`);

          // Check if the SVG content contains any unusual characters
          var pathMatch = svgContent.match(/d="([^"]*)"/);
          if (pathMatch) {
            var pathData = pathMatch[1];
            console.log(`[FONT DEBUG] Path data length: ${pathData.length}`);
            console.log(`[FONT DEBUG] Path data first 50 chars: ${pathData.substring(0, 50)}`);

            // Check for invalid characters in path data
            var invalidChars = pathData.match(/[^MmLlHhVvCcSsQqTtZzAa0-9\s\-\.\,\(\)]/g);
            if (invalidChars) {
              console.error(`[FONT DEBUG] FOUND INVALID CHARACTERS in ${file}: ${invalidChars.join(', ')}`);
            }
          }

          var glyph = fs.createReadStream(file);
          var name = options.names[idx];
          var unicode;

          if (options.ligature) {
            unicode = options.ligatureName(name);
            console.log(`[FONT DEBUG] Ligature mode - Name: ${name}, Unicode: ${unicode}, Length: ${unicode.length}`);
          } else {
            unicode = String.fromCharCode(options.codepoints[name]);
            console.log(`[FONT DEBUG] Codepoint mode - Name: ${name}, Unicode: ${unicode}`);
          }

          console.log(`[FONT DEBUG] File: ${file}, Name: ${name}, Unicode: ${unicode}`);
          glyph.metadata = {
            name: name,
            unicode: [unicode],
          };

          fontStream.write(glyph);
          console.log(`[FONT DEBUG] Successfully processed: ${file}`);
        } catch (error) {
          console.error(`[FONT DEBUG] ERROR processing file ${file}:`, error);
          throw error;
        }
      });

      console.log('[FONT DEBUG] All files processed, ending font stream...');
      fontStream.end();
      console.log('[FONT DEBUG] Font stream ended.');
    },
  },

  ttf: {
    deps: ['svg'],
    fn: function (options, svgFont, done) {
      var font = svg2ttf(svgFont, options.formatOptions['ttf']);
      font = new Buffer.from(font.buffer);
      done(null, font);
    },
  },

  woff: {
    deps: ['ttf'],
    fn: function (options, ttfFont, done) {
      var font = ttf2woff(
        new Uint8Array(ttfFont),
        options.formatOptions['woff']
      );
      font = new Buffer.from(font.buffer);
      done(null, font);
    },
  },

  woff2: {
    deps: ['ttf'],
    fn: function (options, ttfFont, done) {
      var font = ttf2woff2(
        new Uint8Array(ttfFont),
        options.formatOptions['woff2']
      );
      font = new Buffer.from(font.buffer);
      done(null, font);
    },
  },

  eot: {
    deps: ['ttf'],
    fn: function (options, ttfFont, done) {
      var font = ttf2eot(new Uint8Array(ttfFont), options.formatOptions['eot']);
      font = new Buffer.from(font.buffer);
      done(null, font);
    },
  },
};

/**
 * @returns Promise
 */
var generateFonts = function (options) {
  var genTasks = {};

  /**
   * First, creates tasks for dependent font types.
   * Then creates task for specified font type and chains it to dependencies promises.
   * If some task already exists, it reuses it.
   */
  var makeGenTask = function (type) {
    if (genTasks[type]) return genTasks[type];

    var gen = generators[type];
    var depsTasks = _.map(gen.deps, makeGenTask);
    var task = Q.all(depsTasks).then(function (depsFonts) {
      var args = [options].concat(depsFonts);
      return Q.nfapply(gen.fn, args);
    });
    genTasks[type] = task;
    return task;
  };

  // Create all needed generate and write tasks.
  for (var i in options.types) {
    var type = options.types[i];
    makeGenTask(type);
  }

  return Q.all(_.values(genTasks)).then(function (results) {
    return _.object(_.keys(genTasks), results);
  });
};

module.exports = generateFonts;
