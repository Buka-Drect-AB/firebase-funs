import * as admin from "firebase-admin";
import { DocumentReference, OrderByDirection, WhereFilterOp } from "firebase-admin/firestore";
type QueryCondition = {
    field: string;
    operator: WhereFilterOp;
    value: any;
};
type QueryOptions = {
    where?: QueryCondition[];
    orderBy?: {
        field: string;
        direction?: OrderByDirection;
    };
    limit?: number;
    startAfter?: any;
    startAt?: any;
    endAt?: any;
};
/**
 * Recursively removes undefined values from an object
 * This is a safety measure in addition to Firestore's ignoreUndefinedProperties setting
 */
export declare function removeUndefinedValues<T extends Record<string, any>>(obj: T): T;
export declare class FirestoreUtil {
    readonly db: admin.firestore.Firestore;
    constructor(admin: admin.firestore.Firestore);
    /**
     * Generic function to create/set a document in Firestore
     * @param path - Collection path (e.g., 'collection' or 'collection/doc/subcollection')
     * @param docId - Document ID (optional, will auto-generate if not provided)
     * @param data - Data to set in the document
     * @param merge - Whether to merge with existing document (default: false)
     * @return Promise with document reference and ID
     */
    setCompoundedDocument<T extends Record<string, any>>(path: string, docId: string | null, data: T, merge?: boolean): Promise<{
        docRef: admin.firestore.DocumentReference;
        docId: string;
    }>;
    /**
     * Generic function to get a document from Firestore
     * @param path - Collection/document path (e.g., 'collection' or 'collection/doc/subcollection')
     * @param docId - Document ID to retrieve (optional if path includes full document path)
     * @return Promise with document data (including id) or null if not found
     */
    getDocument<T = any>(path: string, docId?: string): Promise<(T & {
        id: string;
    }) | null>;
    /**
     * Upsert function that properly handles nested object updates
     * If document exists, it updates using the update method (which properly handles nested paths)
     * If document doesn't exist, it creates it using set
     *
     * @param docRef - Firebase DocumentReference
     * @param data - Data to upsert (can contain nested objects with dot notation keys)
     * @return Promise<void>
     */
    upsertDocument(docRef: DocumentReference, data: {
        [key: string]: any;
    }): Promise<void>;
    /**
     * Alternative version that allows you to specify different data for create vs update scenarios
     *
     * @param docRef - Firebase DocumentReference
     * @param updateData - Data to use when updating existing document
     * @param createData - Data to use when creating new document (optional, defaults to updateData)
     * @return Promise<void>
     */
    upsertDocumentWithDifferentData(docRef: DocumentReference, updateData: {
        [key: string]: any;
    }, createData?: {
        [key: string]: any;
    }): Promise<void>;
    /**
     * Generic function to get document(s) from Firestore
     * @param path - Collection/document path (e.g., 'collection' or 'collection/doc/subcollection')
     * @param docId - Document ID to retrieve (optional - if provided returns single doc, if omitted returns list)
     * @return Promise with either:
     *   - Single document data (including id) or null if not found (when docId provided)
     *   - Array of documents (when docId omitted)
     */
    getDocuments<T = any>(path: string, docId?: string): Promise<[(T & {
        id: string;
    }) | null] | (T & {
        id: string;
    })[]>;
    /**
     * Generic function to update a document in Firestore
     * @param path - Collection/document path (e.g., 'collection' or 'collection/doc/subcollection')
     * @param docId - Document ID (optional if path includes full document path)
     * @param data - Partial data to update in the document
     * @return Promise with document reference
     */
    editDocument<T extends Record<string, any>>(path: string, docId: string | undefined, data: Partial<T>): Promise<admin.firestore.DocumentReference>;
    /**
     * Generic function to delete a document from Firestore
     * @param path - Collection/document path (e.g., 'collection' or 'collection/doc/subcollection')
     * @param docId - Document ID (optional if path includes full document path)
     * @return Promise that resolves when deletion is complete
     */
    deleteDocument(path: string, docId?: string): Promise<void>;
    /**
     * Create a DocumentReference without writing to the database
     * @param path - Collection/document path (e.g., 'collection' or 'collection/doc/subcollection')
     * @param docId - Document ID (optional, will auto-generate if not provided)
     * @return DocumentReference
     */
    createDocumentRef(path: string, docId?: string): admin.firestore.DocumentReference;
    /**
     * Generic function to query documents from Firestore with dynamic conditions
     * @param path - Collection/document path (e.g., 'collection' or 'collection/doc/subcollection')
     * @param options - Query configuration options
     * @return Promise with array of documents and optional last visible document for pagination
     */
    queryDocuments<T = any>(path: string, options?: QueryOptions): Promise<{
        data: (T & {
            id: string;
        })[];
        lastVisible?: admin.firestore.DocumentSnapshot;
        firstVisible?: admin.firestore.DocumentSnapshot;
    }>;
}
export {};
