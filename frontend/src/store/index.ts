import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark';
  language: string;
}

// Helper: get the theme for a specific user from localStorage
export const getUserTheme = (userId: string): 'light' | 'dark' => {
  const stored = localStorage.getItem(`theme_${userId}`);
  if (stored === 'dark' || stored === 'light') return stored;
  return 'light'; // default
};

// Helper: save theme for a specific user to localStorage
export const saveUserTheme = (userId: string, theme: 'light' | 'dark') => {
  localStorage.setItem(`theme_${userId}`, theme);
};

// Helper: get the language for a specific user from localStorage
export const getUserLanguage = (userId: string): string => {
  const stored = localStorage.getItem(`language_${userId}`);
  return stored || 'en'; // default
};

// Helper: save language for a specific user to localStorage
export const saveUserLanguage = (userId: string, language: string) => {
  localStorage.setItem(`language_${userId}`, language);
};

const initialState: SettingsState = {
  theme: 'light', // Always start with light (login page default)
  language: localStorage.getItem('language') || 'en',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
  },
});

export const { setTheme, setLanguage } = settingsSlice.actions;

export const store = configureStore({
  reducer: {
    settings: settingsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
