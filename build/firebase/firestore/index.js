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
exports.FirestoreUtil = void 0;
exports.removeUndefinedValues = removeUndefinedValues;
/**
 * Recursively removes undefined values from an object
 * This is a safety measure in addition to Firestore's ignoreUndefinedProperties setting
 */
function removeUndefinedValues(obj) {
    const cleaned = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (value !== undefined) {
                // Check if it's a plain object (not Date, Array, etc.) for recursion
                if (value !== null &&
                    typeof value === 'object' &&
                    !Array.isArray(value) &&
                    Object.prototype.toString.call(value) === '[object Object]') {
                    // Recursively clean nested objects
                    cleaned[key] = removeUndefinedValues(value);
                }
                else {
                    cleaned[key] = value;
                }
            }
        }
    }
    return cleaned;
}
class FirestoreUtil {
    constructor(admin) {
        this.db = admin;
    }
    /**
     * Generic function to create/set a document in Firestore
     * @param path - Collection path (e.g., 'collection' or 'collection/doc/subcollection')
     * @param docId - Document ID (optional, will auto-generate if not provided)
     * @param data - Data to set in the document
     * @param merge - Whether to merge with existing document (default: false)
     * @return Promise with document reference and ID
     */
    setCompoundedDocument(path_1, docId_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (path, docId, data, merge = false) {
            try {
                // Clean undefined values before saving (safety measure)
                const cleanedData = removeUndefinedValues(data);
                // Add timestamps
                const timestampedData = Object.assign({}, cleanedData);
                let docRef;
                let finalDocId;
                if (docId) {
                    // Handle compound path (e.g., 'collection/doc/subcollection' + docId)
                    const fullPath = path.split("/");
                    if (fullPath.length % 2 === 0) {
                        // Even number of segments means we're at collection level
                        docRef = this.db.collection(path).doc(docId);
                    }
                    else {
                        // Odd number means we're at document level, so we need to add collection
                        docRef = this.db.doc(`${path}/${docId}`);
                    }
                    finalDocId = docId;
                    yield docRef.set(timestampedData, merge ? { merge: true } : { merge: false });
                }
                else {
                    // Auto-generate document ID - can only be done at top-level collections
                    if (path.includes("/")) {
                        throw new Error("Auto-generated document IDs are only supported for top-level collections");
                    }
                    docRef = this.db.collection(path).doc();
                    finalDocId = docRef.id;
                    yield docRef.set(timestampedData);
                }
                return { docRef, docId: finalDocId };
            }
            catch (error) {
                console.error(`Error setting document at path ${path}:`, error);
                throw new Error(`Failed to set document at path ${path}: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    /**
     * Generic function to get a document from Firestore
     * @param path - Collection/document path (e.g., 'collection' or 'collection/doc/subcollection')
     * @param docId - Document ID to retrieve (optional if path includes full document path)
     * @return Promise with document data (including id) or null if not found
     */
    getDocument(path, docId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let docRef;
                if (docId) {
                    // Handle compound path with explicit docId
                    const segments = path.split("/");
                    if (segments.length % 2 === 0) {
                        // Even segments means we're at collection level
                        docRef = this.db.collection(path).doc(docId);
                    }
                    else {
                        // Odd segments means we're at document level, need to add collection
                        docRef = this.db.doc(`${path}/${docId}`);
                    }
                }
                else {
                    // Assume path contains full document path
                    if (path.split("/").length % 2 !== 1) {
                        throw new Error("Invalid document path - must contain odd number of segments when docId is omitted");
                    }
                    docRef = this.db.doc(path);
                }
                const docSnapshot = yield docRef.get();
                if (!docSnapshot.exists) {
                    return null;
                }
                return Object.assign({ id: docSnapshot.id }, docSnapshot.data());
            }
            catch (error) {
                console.error(`Error getting document from path ${path}${docId ? ` with ID ${docId}` : ""}:`, error);
                throw new Error(`Failed to get document: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    /**
     * Upsert function that properly handles nested object updates
     * If document exists, it updates using the update method (which properly handles nested paths)
     * If document doesn't exist, it creates it using set
     *
     * @param docRef - Firebase DocumentReference
     * @param data - Data to upsert (can contain nested objects with dot notation keys)
     * @return Promise<void>
     */
    upsertDocument(docRef, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if document exists
                const docSnap = yield docRef.get();
                if (docSnap.exists) {
                    // Document exists - use update to properly handle nested paths
                    yield docRef.update(data);
                }
                else {
                    // Document doesn't exist - use set to create it
                    yield docRef.set(data);
                }
            }
            catch (error) {
                throw new Error(`Failed to upsert document: ${error}`);
            }
        });
    }
    /**
     * Alternative version that allows you to specify different data for create vs update scenarios
     *
     * @param docRef - Firebase DocumentReference
     * @param updateData - Data to use when updating existing document
     * @param createData - Data to use when creating new document (optional, defaults to updateData)
     * @return Promise<void>
     */
    upsertDocumentWithDifferentData(docRef, updateData, createData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docSnap = yield docRef.get();
                if (docSnap.exists) {
                    yield docRef.update(updateData);
                }
                else if (createData) {
                    yield docRef.set(createData);
                }
                else {
                    // do no operations
                    return;
                }
            }
            catch (error) {
                throw new Error(`Failed to upsert document: ${error}`);
            }
        });
    }
    /**
     * Generic function to get document(s) from Firestore
     * @param path - Collection/document path (e.g., 'collection' or 'collection/doc/subcollection')
     * @param docId - Document ID to retrieve (optional - if provided returns single doc, if omitted returns list)
     * @return Promise with either:
     *   - Single document data (including id) or null if not found (when docId provided)
     *   - Array of documents (when docId omitted)
     */
    getDocuments(path, docId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (docId) {
                    // Single document retrieval
                    const segments = path.split("/");
                    const docRef = segments.length % 2 === 0 ?
                        this.db.collection(path).doc(docId) :
                        this.db.doc(`${path}/${docId}`);
                    const docSnapshot = yield docRef.get();
                    return [docSnapshot.exists ? Object.assign({ id: docSnapshot.id }, docSnapshot.data()) : null];
                }
                else {
                    // Collection query (get all documents)
                    const segments = path.split("/");
                    let collectionRef;
                    if (segments.length % 2 === 1) {
                        // Odd segments = collection path (e.g., 'collection/doc/subcollection')
                        collectionRef = this.db.collection(path);
                    }
                    else {
                        // Even segments = document path, so parent must be collection
                        collectionRef = this.db.doc(path).parent;
                    }
                    const querySnapshot = yield collectionRef.get();
                    return querySnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
                }
            }
            catch (error) {
                console.error(`Error getting documents from ${path}${docId ? ` with ID ${docId}` : ""}:`, error);
                throw new Error(`Failed to get documents: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    /**
     * Generic function to update a document in Firestore
     * @param path - Collection/document path (e.g., 'collection' or 'collection/doc/subcollection')
     * @param docId - Document ID (optional if path includes full document path)
     * @param data - Partial data to update in the document
     * @return Promise with document reference
     */
    editDocument(path, docId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let docRef;
                if (docId) {
                    // Handle compound path with explicit docId
                    const segments = path.split("/");
                    docRef = segments.length % 2 === 0 ?
                        this.db.collection(path).doc(docId) :
                        this.db.doc(`${path}/${docId}`);
                }
                else {
                    // Assume path contains full document path
                    if (path.split("/").length % 2 !== 1) {
                        throw new Error("Invalid document path - must contain odd number of segments when docId is omitted");
                    }
                    docRef = this.db.doc(path);
                }
                // Clean undefined values before saving (safety measure)
                const cleanedData = removeUndefinedValues(data);
                // Add updatedAt timestamp
                const updateData = Object.assign(Object.assign({}, cleanedData), { lut: Date.now() });
                yield docRef.update(updateData);
                return docRef;
            }
            catch (error) {
                console.error(`Error updating document at path ${path}${docId ? ` with ID ${docId}` : ""}:`, error);
                throw new Error(`Failed to update document: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    /**
     * Generic function to delete a document from Firestore
     * @param path - Collection/document path (e.g., 'collection' or 'collection/doc/subcollection')
     * @param docId - Document ID (optional if path includes full document path)
     * @return Promise that resolves when deletion is complete
     */
    deleteDocument(path, docId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let docRef;
                if (docId) {
                    // Handle compound path with explicit docId
                    const segments = path.split("/");
                    docRef = segments.length % 2 === 0 ?
                        this.db.collection(path).doc(docId) :
                        this.db.doc(`${path}/${docId}`);
                }
                else {
                    // Assume path contains full document path
                    if (path.split("/").length % 2 !== 1) {
                        throw new Error("Invalid document path - must contain odd number of segments when docId is omitted");
                    }
                    docRef = this.db.doc(path);
                }
                yield docRef.delete();
            }
            catch (error) {
                console.error(`Error deleting document at path ${path}${docId ? ` with ID ${docId}` : ""}:`, error);
                throw new Error(`Failed to delete document: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    /**
     * Create a DocumentReference without writing to the database
     * @param path - Collection/document path (e.g., 'collection' or 'collection/doc/subcollection')
     * @param docId - Document ID (optional, will auto-generate if not provided)
     * @return DocumentReference
     */
    createDocumentRef(path, docId) {
        try {
            if (docId) {
                // Handle compound path with explicit docId
                const segments = path.split("/");
                if (segments.length % 2 === 0) {
                    // Even number of segments means we're at collection level
                    return this.db.collection(path).doc(docId);
                }
                else {
                    // Odd number means we're at document level, so we need to add collection
                    return this.db.doc(`${path}/${docId}`);
                }
            }
            else {
                // Auto-generate document ID - can only be done at top-level collections
                if (path.includes("/")) {
                    throw new Error("Auto-generated document IDs are only supported for top-level collections");
                }
                return this.db.collection(path).doc();
            }
        }
        catch (error) {
            console.error(`Error creating document reference at path ${path}:`, error);
            throw new Error(`Failed to create document reference: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Generic function to query documents from Firestore with dynamic conditions
     * @param path - Collection/document path (e.g., 'collection' or 'collection/doc/subcollection')
     * @param options - Query configuration options
     * @return Promise with array of documents and optional last visible document for pagination
     */
    queryDocuments(path_1) {
        return __awaiter(this, arguments, void 0, function* (path, options = {}) {
            try {
                // Determine if path points to collection or document
                const segments = path.split("/");
                let query;
                if (segments.length % 2 === 1) {
                    // Collection path (odd number of segments)
                    query = this.db.collection(path);
                }
                else {
                    // Document path, so we query its subcollection
                    query = this.db.doc(path).parent;
                }
                // Apply where conditions
                if (options.where) {
                    for (const condition of options.where) {
                        query = query.where(condition.field, condition.operator, condition.value);
                    }
                }
                // Apply sorting
                if (options.orderBy) {
                    query = query.orderBy(options.orderBy.field, options.orderBy.direction);
                }
                // Apply pagination cursor
                if (options.startAfter) {
                    query = query.startAfter(options.startAfter);
                }
                if (options.startAt) {
                    query = query.startAt(options.startAt);
                }
                if (options.endAt) {
                    query = query.endAt(options.endAt);
                }
                // Apply limit
                if (options.limit) {
                    query = query.limit(options.limit);
                }
                const snapshot = yield query.get();
                if (snapshot.empty) {
                    return { data: [] };
                }
                const data = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
                return {
                    data,
                    lastVisible: snapshot.docs[snapshot.docs.length - 1],
                    firstVisible: snapshot.docs[0],
                };
            }
            catch (error) {
                console.error(`Error querying documents at path ${path}:`, error);
                throw new Error(`Failed to query documents: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.FirestoreUtil = FirestoreUtil;
//# sourceMappingURL=index.js.map