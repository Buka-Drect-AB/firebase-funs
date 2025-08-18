"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FireStorageUtil = void 0;
const storage_1 = require("firebase-admin/storage");
class FireStorageUtil {
    constructor(storage) {
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
    uploadLocalFileToStorage(path, filePath, fileName, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const destination = `${path}${fileName}`;
            try {
                // Uploads a local file to the bucket
                yield this.storage.bucket().upload(filePath, {
                    destination: destination,
                    gzip: true,
                    metadata: metadata,
                    // cacheControl: 'public, max-age=315360000',
                });
                // console.log(`${fileName} uploaded to /${path}/${fileName}.`);
                return destination;
            }
            catch (e) {
                throw new Error("uploadLocalFileToStorage failed: " + e);
            }
        });
    }
    /**
     * Get cloud storage file
     * @param {string} location file storage location path
     * @return {Promise<string>} download url
     */
    getStorageLink(location) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileRef = this.storage.bucket().file(location);
            const downloadURL = yield (0, storage_1.getDownloadURL)(fileRef);
            return downloadURL;
        });
    }
}
exports.FireStorageUtil = FireStorageUtil;
//# sourceMappingURL=index.js.map