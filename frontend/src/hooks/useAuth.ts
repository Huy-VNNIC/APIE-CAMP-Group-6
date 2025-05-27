import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Export cả named export và default export
export const useAuth = () => useContext(AuthContext);

export default useAuth;