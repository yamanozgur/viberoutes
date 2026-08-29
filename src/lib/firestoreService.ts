import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth as getSecondaryAuth, signOut as secondarySignOut } from 'firebase/auth';
import { db, auth } from './firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import { Article } from '../types';

export const SUPER_ADMIN_EMAIL = 'yamanozgur@gmail.com';

export interface EditorialLog {
  id: string;
  time: string;
  type: 'upload' | 'edit' | 'publish' | 'delete' | 'photo' | 'auth';
  message: string;
  editorEmail?: string;
  timestamp?: number;
}

export interface EditorUser {
  uid: string;
  email: string;
  username?: string;
  displayName: string;
  role: 'admin' | 'editor' | 'author';
  status?: 'active' | 'inactive';
  createdAt?: string;
  createdBy?: string;
}

// Convert Firestore document data to Article object
const sanitizeArticleData = (data: any): Article => {
  return {
    id: data.id,
    slug: data.slug || data.id,
    title: data.title || '',
    subtitle: data.subtitle || '',
    category: data.category || 'destinations',
    subCategory: data.subCategory || 'Europe',
    region: data.region || 'Global',
    coverImage: data.coverImage || '',
    author: data.author || { name: 'Editorial Staff', role: 'Vibe Routes Contributor' },
    publishedDate: data.publishedDate || new Date().toISOString().split('T')[0],
    readTime: data.readTime || '5 min read',
    excerpt: data.excerpt || '',
    introParagraph: data.introParagraph || '',
    sections: Array.isArray(data.sections) ? data.sections : [],
    hotelData: Array.isArray(data.hotelData) ? data.hotelData : undefined,
    homeSection: data.homeSection || 'latest',
    tags: Array.isArray(data.tags) ? data.tags : [],
    featured: Boolean(data.featured),
    isPopular: Boolean(data.isPopular),
    isEditorPick: Boolean(data.isEditorPick),
    affiliateDisclaimer: data.affiliateDisclaimer !== false,
  };
};

/**
 * Real-time subscription to Articles in the 'viberoutes' Firestore database
 */
export const subscribeToArticles = (
  callback: (articles: Article[]) => void,
  onError?: (err: Error) => void
) => {
  const articlesCol = collection(db, 'articles');
  return onSnapshot(
    articlesCol,
    (snapshot) => {
      const items: Article[] = [];
      snapshot.forEach((docSnap) => {
        if (docSnap.exists()) {
          items.push(sanitizeArticleData(docSnap.data()));
        }
      });
      callback(items);
    },
    (error) => {
      console.error('Firestore articles subscription error:', error);
      if (onError) onError(error);
    }
  );
};

/**
 * Save or update an article in Firestore
 */
export const saveArticleToFirestore = async (article: Article): Promise<void> => {
  if (!article.id) {
    article.id = `art-${Date.now()}`;
  }
  const cleanArticle: Record<string, any> = {
    ...article,
    updatedAt: new Date().toISOString(),
  };

  // Remove undefined fields for clean Firestore storage
  Object.keys(cleanArticle).forEach((key) => {
    if (cleanArticle[key] === undefined) {
      delete cleanArticle[key];
    }
  });

  const articleDoc = doc(db, 'articles', article.id);
  await setDoc(articleDoc, cleanArticle, { merge: true });
};

/**
 * Delete an article from Firestore and mark in deleted registry
 */
export const deleteArticleFromFirestore = async (articleId: string): Promise<void> => {
  try {
    const articleDoc = doc(db, 'articles', articleId);
    await deleteDoc(articleDoc);
  } catch (err) {
    console.warn('Firestore delete doc warning:', err);
  }

  try {
    const deletedDoc = doc(db, 'deleted_articles', articleId);
    await setDoc(deletedDoc, {
      id: articleId,
      deletedAt: new Date().toISOString(),
      deletedBy: auth.currentUser?.email || SUPER_ADMIN_EMAIL,
    });
  } catch (err) {
    console.warn('Firestore mark deleted warning:', err);
  }
};

/**
 * Clear all articles from Firestore
 */
export const clearAllArticlesFromFirestore = async (allCurrentIds: string[]): Promise<void> => {
  try {
    const articlesCol = collection(db, 'articles');
    const snapshot = await getDocs(articlesCol);
    const deletePromises = snapshot.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);

    // Also mark all current IDs as deleted so defaults never resurrect
    for (const id of allCurrentIds) {
      const deletedDoc = doc(db, 'deleted_articles', id);
      await setDoc(deletedDoc, {
        id,
        deletedAt: new Date().toISOString(),
        deletedBy: auth.currentUser?.email || SUPER_ADMIN_EMAIL,
      });
    }
  } catch (err) {
    console.warn('Firestore clear all error:', err);
  }
};

/**
 * Subscribe to deleted article IDs from Firestore
 */
export const subscribeToDeletedArticleIds = (callback: (deletedIds: Set<string>) => void) => {
  const deletedCol = collection(db, 'deleted_articles');
  return onSnapshot(deletedCol, (snapshot) => {
    const ids = new Set<string>();
    snapshot.forEach((d) => ids.add(d.id));
    callback(ids);
  }, (err) => {
    console.warn('Deleted articles subscription warning:', err);
  });
};

/**
 * Seed initial articles into Firestore if the collection is empty
 */
export const seedArticlesIfEmpty = async (initialData: Article[]): Promise<boolean> => {
  try {
    const articlesCol = collection(db, 'articles');
    const snapshot = await getDocs(articlesCol);
    if (snapshot.empty && initialData.length > 0) {
      console.log('Seeding initial articles into Firestore viberoutes database...');
      for (const art of initialData) {
        await saveArticleToFirestore(art);
      }
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Seeding check failed:', err);
    return false;
  }
};

/**
 * Real-time subscription to editorial audit logs
 */
export const subscribeToEditorialLogs = (
  callback: (logs: EditorialLog[]) => void
) => {
  const logsCol = collection(db, 'editorial_logs');
  return onSnapshot(
    logsCol,
    (snapshot) => {
      const logs: EditorialLog[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        logs.push({
          id: docSnap.id,
          time: data.time || new Date().toLocaleTimeString('tr-TR'),
          type: data.type || 'edit',
          message: data.message || '',
          editorEmail: data.editorEmail,
          timestamp: data.timestamp || Date.now(),
        });
      });
      // Sort newest first
      logs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      callback(logs);
    },
    (err) => {
      console.warn('Editorial logs sync error:', err);
    }
  );
};

/**
 * Add an entry to editorial audit logs in Firestore
 */
export const logEditorialAction = async (
  type: EditorialLog['type'],
  message: string,
  editorEmail?: string
): Promise<void> => {
  try {
    const logId = `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const logDoc = doc(db, 'editorial_logs', logId);
    await setDoc(logDoc, {
      id: logId,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type,
      message,
      editorEmail: editorEmail || auth.currentUser?.email || 'Editorial Staff',
      timestamp: Date.now(),
    });
  } catch (err) {
    console.warn('Could not write editorial log to Firestore:', err);
  }
};

/**
 * Auth Helper: Normalize username or email
 */
export const formatEditorEmail = (input: string): string => {
  const trimmed = input.trim();
  if (trimmed.toLowerCase() === 'yamanozgur' || trimmed.toLowerCase() === 'yamanozgur@gmail.com') {
    return SUPER_ADMIN_EMAIL;
  }
  if (trimmed.includes('@')) return trimmed;
  return `${trimmed.toLowerCase().replace(/\s+/g, '')}@viberoutes.com`;
};

/**
 * Auth: Sign in editor or admin with Email / Username + Password
 */
export const loginEditor = async (identifier: string, password: string): Promise<User> => {
  const email = formatEditorEmail(identifier);
  const isSuperAdminAttempt = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() || identifier.trim().toLowerCase() === 'yamanozgur';

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Ensure Firestore profile exists and role is correct
    const isSuperAdmin = userCredential.user.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
    const userDoc = doc(db, 'users', userCredential.user.uid);
    await setDoc(userDoc, {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName || (isSuperAdmin ? 'Özgür Yaman (Yönetici)' : identifier),
      role: isSuperAdmin ? 'admin' : 'editor',
      status: 'active',
      lastLogin: new Date().toISOString(),
    }, { merge: true });

    await logEditorialAction('auth', `${isSuperAdmin ? 'Ana Yönetici' : 'Editör'} giriş yaptı: ${userCredential.user.email}`);
    return userCredential.user;
  } catch (err: any) {
    // If super admin first time login and user account hasn't been created yet in Firebase Auth
    if (isSuperAdminAttempt && (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential')) {
      if (password === '52_Tel82') {
        const cred = await createUserWithEmailAndPassword(auth, SUPER_ADMIN_EMAIL, '52_Tel82');
        await updateProfile(cred.user, { displayName: 'Özgür Yaman' });
        const userDoc = doc(db, 'users', cred.user.uid);
        await setDoc(userDoc, {
          uid: cred.user.uid,
          email: SUPER_ADMIN_EMAIL,
          username: 'yamanozgur',
          displayName: 'Özgür Yaman',
          role: 'admin',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        });
        await logEditorialAction('auth', `Ana Yönetici hesabı tanımlandı ve giriş yapıldı: ${SUPER_ADMIN_EMAIL}`);
        return cred.user;
      }
    }
    throw err;
  }
};

/**
 * Admin Action: Create new editor account without logging out current admin
 */
export const createEditorByAdmin = async (
  identifier: string,
  password: string,
  displayName: string,
  role: 'editor' | 'author' = 'editor'
): Promise<{ uid: string; email: string; displayName: string }> => {
  const email = formatEditorEmail(identifier);
  
  // Use a secondary app instance so current admin's session is untouched
  const secondaryAppName = `adminEditorCreator_${Date.now()}`;
  const secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
  const secondaryAuth = getSecondaryAuth(secondaryApp);
  
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const uid = cred.user.uid;
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    await secondarySignOut(secondaryAuth);
    await deleteApp(secondaryApp);

    // Save to Firestore 'users' in main DB
    const userDoc = doc(db, 'users', uid);
    await setDoc(userDoc, {
      uid,
      email,
      username: identifier.replace(/@.*$/, ''),
      displayName: displayName || identifier,
      role,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: auth.currentUser?.email || SUPER_ADMIN_EMAIL,
    });

    await logEditorialAction('auth', `Yönetici yeni editör ekledi: ${email} (${displayName || identifier})`);

    return { uid, email, displayName };
  } catch (error) {
    try {
      await deleteApp(secondaryApp);
    } catch {
      // ignore
    }
    throw error;
  }
};

/**
 * Real-time subscription to registered editors
 */
export const subscribeToEditors = (callback: (editors: EditorUser[]) => void) => {
  const usersCol = collection(db, 'users');
  return onSnapshot(usersCol, (snapshot) => {
    const list: EditorUser[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      list.push({
        uid: d.id,
        email: data.email || '',
        username: data.username || data.email?.split('@')[0],
        displayName: data.displayName || data.email || 'İsimsiz Editör',
        role: data.role || 'editor',
        status: data.status || 'active',
        createdAt: data.createdAt || '',
        createdBy: data.createdBy || '',
      });
    });
    // Sort admin first, then newest
    list.sort((a, b) => (a.role === 'admin' ? -1 : b.role === 'admin' ? 1 : 0));
    callback(list);
  }, (err) => {
    console.warn('Editors sync error:', err);
  });
};

/**
 * Admin Action: Delete editor
 */
export const deleteEditorUser = async (uid: string, editorEmail: string) => {
  if (editorEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
    throw new Error('Ana yönetici hesabı silinemez.');
  }
  const userDoc = doc(db, 'users', uid);
  await deleteDoc(userDoc);
  await logEditorialAction('auth', `Yönetici editör yetkisini kaldırdı: ${editorEmail}`);
};

/**
 * Get current user role from Firestore
 */
export const getCurrentUserRole = async (user: User): Promise<'admin' | 'editor' | 'author'> => {
  if (user.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return 'admin';
  }
  try {
    const userDoc = doc(db, 'users', user.uid);
    const snap = await getDoc(userDoc);
    if (snap.exists()) {
      return snap.data().role || 'editor';
    }
  } catch (e) {
    console.warn('Could not fetch user role:', e);
  }
  return 'editor';
};

/**
 * Auth: Logout editor
 */
export const logoutEditor = async (): Promise<void> => {
  const currentEmail = auth.currentUser?.email;
  await signOut(auth);
  if (currentEmail) {
    await logEditorialAction('auth', `Editör oturumu kapattı: ${currentEmail}`);
  }
};

/**
 * Auth: Subscribe to Auth State
 */
export const onAuthStatusChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
