import * as admin from "firebase-admin";
export declare class FireStorageUtil {
    readonly storage: admin.storage.Storage;
    constructor(storage: admin.storage.Storage);
    /**
     * Upload the file in firestore storage
     * @param {string} path storage path to be used
     * @param {string} filePath path locally
     * @param {string} fileName name of file with extension
     * @param {Record<string, unknown>} metadata optional
     * @return {string} destination path
     */
    uploadLocalFileToStorage(path: string, filePath: string, fileName: string, metadata?: Record<string, unknown>): Promise<string>;
    /**
     * Get cloud storage file
     * @param {string} location file storage location path
     * @return {Promise<string>} download url
     */
    getStorageLink(location: string): Promise<string>;
}
