export type User = {
  id: string;
  email: string;
  name?: string;
} | null;

let currentUser: User = null;

export const auth = {
  // Mock login
  signIn: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    currentUser = { id: '1', email, name: 'Test User' };
    return { user: currentUser, error: null };
  },

  // Mock signup
  signUp: async (email: string, password: string, name: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    currentUser = { id: '2', email, name };
    return { user: currentUser, error: null };
  },

  // Mock logout
  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    currentUser = null;
  },

  // Check current session
  getSession: async () => {
    return { 
      data: { 
        session: currentUser ? { user: currentUser } : null 
      }, 
      error: null 
    };
  },

  // Auth state listener
  onAuthStateChange: (callback: (event: string, session: { user: User } | null) => void) => {
    // Simple mock implementation
    const handleUserChange = () => {
      callback('SIGNED_IN', currentUser ? { user: currentUser } : null);
    };
    
    // Simulate checking auth state periodically
    const interval = setInterval(handleUserChange, 1000);
    
    return {
      data: {
        subscription: {
          unsubscribe: () => clearInterval(interval)
        }
      }
    };
  }
};