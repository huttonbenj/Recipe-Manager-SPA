import { createContext } from 'react';
import type { AuthContextType } from '@recipe-manager/shared';

export const AuthContext = createContext<AuthContextType | undefined>(undefined); 