import * as admin from "firebase-admin";
import { getDownloadURL } from "firebase-admin/storage";


export class FireStorageUtil {
  readonly storage: admin.storage.Storage;

  constructor(storage: admin.storage.Storage) {
    this.storage = storage;
  }

  /**
   * Upload the file in firestore storage
   * @param {string} path storage path to be used
   * @param {string} filePath path locally
   * @param {string} fileName name of file with extension
   * @param {Record<string, unknown>} metadata optional
   * @return {string} destination path
   */
  public async uploadLocalFileToStorage(path: string,
    filePath: string, fileName: string,
    metadata?: Record<string, unknown>): Promise<string> {
    const destination = `${path}${fileName}`;

    try {
      // Uploads a local file to the bucket
      await this.storage.bucket().upload(filePath, {
        destination: destination,
        gzip: true,
        metadata: metadata,
        // cacheControl: 'public, max-age=315360000',
      });
      // console.log(`${fileName} uploaded to /${path}/${fileName}.`);
      return destination;
    } catch (e) {
      throw new Error("uploadLocalFileToStorage failed: " + e);
    }
  }

  /**
   * Get cloud storage file
   * @param {string} location file storage location path
   * @return {Promise<string>} download url
   */
  public async getStorageLink(location: string): Promise<string> {
    const fileRef = this.storage.bucket().file(location);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  }

}