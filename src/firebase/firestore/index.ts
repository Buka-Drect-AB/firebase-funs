import * as admin from "firebase-admin";
import {
  DocumentData, DocumentReference,
  OrderByDirection, WhereFilterOp
} from "firebase-admin/firestore";

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
  startAfter?: any; // For pagination
  startAt?: any; // For cursor-based queries
  endAt?: any; // For range queries
};

/**
 * Recursively removes undefined values from an object
 * This is a safety measure in addition to Firestore's ignoreUndefinedProperties setting
 */
function removeUndefinedValues<T extends Record<string, any>>(obj: T): T {
  const cleaned: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (value !== undefined) {
        // Check if it's a plain object (not Date, Array, etc.) for recursion
        if (
          value !== null &&
          typeof value === 'object' &&
          !Array.isArray(value) &&
          Object.prototype.toString.call(value) === '[object Object]'
        ) {
          // Recursively clean nested objects
          cleaned[key] = removeUndefinedValues(value as Record<string, any>);
        } else {
          cleaned[key] = value;
        }
      }
    }
  }
  return cleaned as T;
}

export class FirestoreUtil {
  readonly db: admin.firestore.Firestore;
  constructor(admin: admin.firestore.Firestore) {
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
  async setCompoundedDocument<T extends Record<string, any>>(
    path: string,
    docId: string | null,
    data: T,
    merge = false
  ): Promise<{ docRef: admin.firestore.DocumentReference; docId: string }> {
    try {


      // Clean undefined values before saving (safety measure)
      const cleanedData = removeUndefinedValues(data);

      // Add timestamps
      const timestampedData = {
        ...cleanedData,
      };

      let docRef: admin.firestore.DocumentReference;
      let finalDocId: string;

      if (docId) {
        // Handle compound path (e.g., 'collection/doc/subcollection' + docId)
        const fullPath = path.split("/");
        if (fullPath.length % 2 === 0) {
          // Even number of segments means we're at collection level
          docRef = this.db.collection(path).doc(docId);
        } else {
          // Odd number means we're at document level, so we need to add collection
          docRef = this.db.doc(`${path}/${docId}`);
        }
        finalDocId = docId;

        await docRef.set(timestampedData, merge ? {merge: true} : {merge: false});
      } else {
        // Auto-generate document ID - can only be done at top-level collections
        if (path.includes("/")) {
          throw new Error("Auto-generated document IDs are only supported for top-level collections");
        }

        docRef = this.db.collection(path).doc();
        finalDocId = docRef.id;

        await docRef.set(timestampedData);
      }

      return {docRef, docId: finalDocId};
    } catch (error) {
      console.error(`Error setting document at path ${path}:`, error);
      throw new Error(`Failed to set document at path ${path}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generic function to get a document from Firestore
   * @param path - Collection/document path (e.g., 'collection' or 'collection/doc/subcollection')
   * @param docId - Document ID to retrieve (optional if path includes full document path)
   * @return Promise with document data (including id) or null if not found
   */
  async getDocument<T = any>(
    path: string,
    docId?: string
  ): Promise<(T & { id: string }) | null> {
    try {
      let docRef: admin.firestore.DocumentReference;

      if (docId) {
        // Handle compound path with explicit docId
        const segments = path.split("/");
        if (segments.length % 2 === 0) {
          // Even segments means we're at collection level
          docRef = this.db.collection(path).doc(docId);
        } else {
          // Odd segments means we're at document level, need to add collection
          docRef = this.db.doc(`${path}/${docId}`);
        }
      } else {
        // Assume path contains full document path
        if (path.split("/").length % 2 !== 1) {
          throw new Error("Invalid document path - must contain odd number of segments when docId is omitted");
        }
        docRef = this.db.doc(path);
      }

      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        return null;
      }

      return {id: docSnapshot.id, ...docSnapshot.data()} as T & { id: string };
    } catch (error) {
      console.error(`Error getting document from path ${path}${docId ? ` with ID ${docId}` : ""}:`, error);
      throw new Error(`Failed to get document: ${error instanceof Error ? error.message : String(error)}`);
    }
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
  async upsertDocument(
    docRef: DocumentReference,
    data: { [key: string]: any }
  ): Promise<void> {
    try {
      // Check if document exists
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        // Document exists - use update to properly handle nested paths
        await docRef.update(data);
      } else {
        // Document doesn't exist - use set to create it
        await docRef.set(data);
      }
    } catch (error) {
      throw new Error(`Failed to upsert document: ${error}`);
    }
  }

  /**
   * Alternative version that allows you to specify different data for create vs update scenarios
   *
   * @param docRef - Firebase DocumentReference
   * @param updateData - Data to use when updating existing document
   * @param createData - Data to use when creating new document (optional, defaults to updateData)
   * @return Promise<void>
   */
  async upsertDocumentWithDifferentData(
    docRef: DocumentReference,
    updateData: { [key: string]: any },
    createData?: { [key: string]: any }
  ): Promise<void> {
    try {
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        await docRef.update(updateData);
      } else if (createData) {
        await docRef.set(createData);
      } else {
        // do no operations
        return;
      }
    } catch (error) {
      throw new Error(`Failed to upsert document: ${error}`);
    }
  }

  /**
   * Generic function to get document(s) from Firestore
   * @param path - Collection/document path (e.g., 'collection' or 'collection/doc/subcollection')
   * @param docId - Document ID to retrieve (optional - if provided returns single doc, if omitted returns list)
   * @return Promise with either:
   *   - Single document data (including id) or null if not found (when docId provided)
   *   - Array of documents (when docId omitted)
   */
  async getDocuments<T = any>(
    path: string,
    docId?: string
  ): Promise<[(T & { id: string }) | null] | (T & { id: string })[]> {
    try {
      if (docId) {
        // Single document retrieval
        const segments = path.split("/");
        const docRef = segments.length % 2 === 0 ?
          this.db.collection(path).doc(docId) :
          this.db.doc(`${path}/${docId}`);

        const docSnapshot = await docRef.get();
        return [docSnapshot.exists ? {id: docSnapshot.id, ...docSnapshot.data()} as T & { id: string } : null];
      } else {
        // Collection query (get all documents)
        const segments = path.split("/");
        let collectionRef: admin.firestore.CollectionReference;

        if (segments.length % 2 === 1) {
          // Odd segments = collection path (e.g., 'collection/doc/subcollection')
          collectionRef = this.db.collection(path);
        } else {
          // Even segments = document path, so parent must be collection
          collectionRef = this.db.doc(path).parent;
        }

        const querySnapshot = await collectionRef.get();
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as (T & { id: string })[];
      }
    } catch (error) {
      console.error(`Error getting documents from ${path}${docId ? ` with ID ${docId}` : ""}:`, error);
      throw new Error(`Failed to get documents: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generic function to update a document in Firestore
   * @param path - Collection/document path (e.g., 'collection' or 'collection/doc/subcollection')
   * @param docId - Document ID (optional if path includes full document path)
   * @param data - Partial data to update in the document
   * @return Promise with document reference
   */
  async editDocument<T extends Record<string, any>>(
    path: string,
    docId: string | undefined,
    data: Partial<T>
  ): Promise<admin.firestore.DocumentReference> {
    try {
      let docRef: admin.firestore.DocumentReference;

      if (docId) {
        // Handle compound path with explicit docId
        const segments = path.split("/");
        docRef = segments.length % 2 === 0 ?
          this.db.collection(path).doc(docId) :
          this.db.doc(`${path}/${docId}`);
      } else {
        // Assume path contains full document path
        if (path.split("/").length % 2 !== 1) {
          throw new Error("Invalid document path - must contain odd number of segments when docId is omitted");
        }
        docRef = this.db.doc(path);
      }

      // Add updatedAt timestamp
      const updateData = {
        ...data,
        lut: Date.now(), // Using Date.now() instead of unixTimeStampNow() since that function wasn't defined
      };

      await docRef.update(updateData);
      return docRef;
    } catch (error) {
      console.error(`Error updating document at path ${path}${docId ? ` with ID ${docId}` : ""}:`, error);
      throw new Error(`Failed to update document: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generic function to delete a document from Firestore
   * @param path - Collection/document path (e.g., 'collection' or 'collection/doc/subcollection')
   * @param docId - Document ID (optional if path includes full document path)
   * @return Promise that resolves when deletion is complete
   */
  async deleteDocument(
    path: string,
    docId?: string
  ): Promise<void> {
    try {
      let docRef: admin.firestore.DocumentReference;

      if (docId) {
        // Handle compound path with explicit docId
        const segments = path.split("/");
        docRef = segments.length % 2 === 0 ?
          this.db.collection(path).doc(docId) :
          this.db.doc(`${path}/${docId}`);
      } else {
        // Assume path contains full document path
        if (path.split("/").length % 2 !== 1) {
          throw new Error("Invalid document path - must contain odd number of segments when docId is omitted");
        }
        docRef = this.db.doc(path);
      }

      await docRef.delete();
    } catch (error) {
      console.error(`Error deleting document at path ${path}${docId ? ` with ID ${docId}` : ""}:`, error);
      throw new Error(`Failed to delete document: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create a DocumentReference without writing to the database
   * @param path - Collection/document path (e.g., 'collection' or 'collection/doc/subcollection')
   * @param docId - Document ID (optional, will auto-generate if not provided)
   * @return DocumentReference
   */
  createDocumentRef(
    path: string,
    docId?: string
  ): admin.firestore.DocumentReference {
    try {
      if (docId) {
        // Handle compound path with explicit docId
        const segments = path.split("/");
        if (segments.length % 2 === 0) {
          // Even number of segments means we're at collection level
          return this.db.collection(path).doc(docId);
        } else {
          // Odd number means we're at document level, so we need to add collection
          return this.db.doc(`${path}/${docId}`);
        }
      } else {
        // Auto-generate document ID - can only be done at top-level collections
        if (path.includes("/")) {
          throw new Error("Auto-generated document IDs are only supported for top-level collections");
        }
        return this.db.collection(path).doc();
      }
    } catch (error) {
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
  async queryDocuments<T = any>(
    path: string,
    options: QueryOptions = {}
  ): Promise<{
    data: (T & { id: string })[];
    lastVisible?: admin.firestore.DocumentSnapshot;
    firstVisible?: admin.firestore.DocumentSnapshot;
  }> {
    try {
      // Determine if path points to collection or document
      const segments = path.split("/");
      let query: admin.firestore.Query<DocumentData>;

      if (segments.length % 2 === 1) {
        // Collection path (odd number of segments)
        query = this.db.collection(path);
      } else {
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
        query = query.orderBy(
          options.orderBy.field,
          options.orderBy.direction
        );
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

      const snapshot = await query.get();

      if (snapshot.empty) {
        return {data: []};
      }

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (T & { id: string })[];

      return {
        data,
        lastVisible: snapshot.docs[snapshot.docs.length - 1],
        firstVisible: snapshot.docs[0],
      };
    } catch (error) {
      console.error(`Error querying documents at path ${path}:`, error);
      throw new Error(`Failed to query documents: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}