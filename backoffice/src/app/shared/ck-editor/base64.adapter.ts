interface CKWindow extends Window {
  FileReader: any;
}

declare const window: CKWindow;

/**
 * The upload adapter that converts images inserted into the editor into Base64 strings.
 *
 * @private
 * @implements module:upload/filerepository~UploadAdapter
 */
export class Base64Adapter {
  loader: any;
  reader: any;
	/**
	 * Creates a new adapter instance.
	 *
	 * @param {module:upload/filerepository~FileLoader} loader
	 */
  constructor(loader: any) {
		/**
		 * `FileLoader` instance to use during the upload.
		 *
		 * @member {module:upload/filerepository~FileLoader} #loader
		 */
    this.loader = loader;
  }

	/**
	 * Starts the upload process.
	 *
	 * @see module:upload/filerepository~UploadAdapter#upload
	 * @returns {Promise}
	 */
  upload() {
    return new Promise((resolve, reject) => {
      const reader = this.reader = new window.FileReader();

      reader.addEventListener('load', () => {
        resolve({ default: reader.result });
      });

      reader.addEventListener('error', (err: any) => {
        reject(err);
      });

      reader.addEventListener('abort', () => {
        reject();
      });

      this.loader.file.then((file: any) => {
        reader.readAsDataURL(file);
      });
    });
  }

	/**
	 * Aborts the upload process.
	 *
	 * @see module:upload/filerepository~UploadAdapter#abort
	 * @returns {Promise}
	 */
  abort() {
    this.reader.abort();
  }
}
