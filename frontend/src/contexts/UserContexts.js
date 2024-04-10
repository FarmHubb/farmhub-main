import { createContext } from 'react';

const UserProfileContext = createContext(null);
const UserAvatarContext = createContext(null);
const UserAddressContext = createContext(null);
const UserCartContext = createContext(null);

export { UserProfileContext, UserAvatarContext, UserAddressContext, UserCartContext};