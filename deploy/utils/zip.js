const archiver = require('archiver');
const fs = require('fs');

/**
 * @param {{ path: string, name: string, type: 'file' | 'directory' }[]} sources A lista de arquivos e pastas a ser comprimido
 * @param {string} outputPath O arquivo final a ser salvo
 * @returns {Promise}
 */
module.exports = function zipDirectory(sources, outputPath) {
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(outputPath);

  return new Promise((resolve, reject) => {
    for(const source of sources) {
      if (source.type === 'file')
        archive.file(source.path,  { name: source.name });

      if (source.type === 'directory')
        archive.directory(source.path, source.name, { name: source.name });
    }

    archive
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}


