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
import { Article, FeaturedDestination } from '../types';

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
  const isSuperAdminAttempt =
    email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() ||
    identifier.trim().toLowerCase() === 'yamanozgur';

  // If super admin attempt with master password or any valid trigger, attempt login first, fallback to createUser
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
    console.warn('Sign-in failed, checking account recovery:', err);
    // If account doesn't exist yet in Firebase Auth for yamanozgur, automatically create it with the provided password
    if (isSuperAdminAttempt) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, SUPER_ADMIN_EMAIL, password);
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
        await logEditorialAction('auth', `Ana Yönetici hesabı oluşturuldu ve giriş yapıldı: ${SUPER_ADMIN_EMAIL}`);
        return cred.user;
      } catch (createErr: any) {
        if (createErr.code === 'auth/email-already-in-use') {
          // Account already exists in Firebase Auth, but password might have been different or mis-typed
          throw new Error('Şifre hatalı. Lütfen belirlediğiniz şifreyi kontrol edin.');
        }
        throw createErr;
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

export const DEFAULT_FEATURED_DESTINATIONS: FeaturedDestination[] = [
  {
    id: 'dest-1',
    name: 'Dubai & Desert',
    country: 'United Arab Emirates',
    tagline: 'Desert Sanctuaries & Avant-Garde',
    tag: 'Middle East',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
    order: 1,
  },
  {
    id: 'dest-2',
    name: 'Dublin & Ireland',
    country: 'Ireland',
    tagline: 'Literary Ghosts & Amber Pubs',
    tag: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?q=80&w=800&auto=format&fit=crop',
    order: 2,
  },
  {
    id: 'dest-3',
    name: 'Oaxaca & CDMX',
    country: 'Mexico',
    tagline: 'Culinary Soul & Green Stone',
    tag: 'Americas',
    imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?q=80&w=800&auto=format&fit=crop',
    order: 3,
  },
  {
    id: 'dest-4',
    name: 'Kyoto & Gion',
    country: 'Japan',
    tagline: 'Machiyas & Zen Solitude',
    tag: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    order: 4,
  },
  {
    id: 'dest-5',
    name: 'Amalfi Coast',
    country: 'Italy',
    tagline: 'Cliffside Terraces & Cobalt Sea',
    tag: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop',
    order: 5,
  },
  {
    id: 'dest-6',
    name: 'Julian Alps',
    country: 'Slovenia',
    tagline: 'Emerald Rivers & Secret Lakes',
    tag: 'Hidden Gems',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    order: 6,
  },
];

/**
 * Real-time subscription to Featured Destinations in Firestore
 */
export const subscribeToFeaturedDestinations = (
  callback: (destinations: FeaturedDestination[]) => void
) => {
  const col = collection(db, 'featured_destinations');
  return onSnapshot(
    col,
    (snapshot) => {
      if (snapshot.empty) {
        callback(DEFAULT_FEATURED_DESTINATIONS);
        return;
      }
      const items: FeaturedDestination[] = [];
      snapshot.forEach((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            name: data.name || '',
            country: data.country || '',
            tagline: data.tagline || '',
            tag: data.tag || 'Destinations',
            imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
            accentColor: data.accentColor,
            badgeBg: data.badgeBg,
            order: typeof data.order === 'number' ? data.order : 99,
            linkedArticleId: data.linkedArticleId,
            targetRegion: data.targetRegion,
          });
        }
      });
      items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      callback(items.length > 0 ? items : DEFAULT_FEATURED_DESTINATIONS);
    },
    (err) => {
      console.warn('Firestore featured_destinations sync error, using defaults:', err);
      callback(DEFAULT_FEATURED_DESTINATIONS);
    }
  );
};

/**
 * Save or update a single featured destination
 */
export const saveFeaturedDestination = async (dest: FeaturedDestination): Promise<void> => {
  const destId = dest.id || `dest-${Date.now()}`;
  const cleanDest: Record<string, any> = {
    ...dest,
    id: destId,
    updatedAt: new Date().toISOString(),
  };
  Object.keys(cleanDest).forEach((k) => {
    if (cleanDest[k] === undefined) delete cleanDest[k];
  });
  const docRef = doc(db, 'featured_destinations', destId);
  await setDoc(docRef, cleanDest, { merge: true });
  await logEditorialAction('edit', `Öne çıkan bölge güncellendi: ${dest.name} (${dest.country})`);
};

/**
 * Delete a featured destination
 */
export const deleteFeaturedDestination = async (id: string, name?: string): Promise<void> => {
  const docRef = doc(db, 'featured_destinations', id);
  await deleteDoc(docRef);
  await logEditorialAction('delete', `Öne çıkan bölge silindi: ${name || id}`);
};

/**
 * Save all destinations (e.g. re-ordered list)
 */
export const saveAllFeaturedDestinations = async (destinations: FeaturedDestination[]): Promise<void> => {
  for (let i = 0; i < destinations.length; i++) {
    const d = { ...destinations[i], order: i + 1 };
    await saveFeaturedDestination(d);
  }
};

/**
 * Reset destinations to defaults
 */
export const resetFeaturedDestinationsToDefault = async (): Promise<void> => {
  for (const item of DEFAULT_FEATURED_DESTINATIONS) {
    await saveFeaturedDestination(item);
  }
  await logEditorialAction('edit', 'Öne çıkan bölgeler varsayılan şablona sıfırlandı.');
};

