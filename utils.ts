import { UserProfile } from './types';

export const getAvatarUrl = (user: UserProfile | null | undefined): string => {
    if (!user) return `https://ui-avatars.com/api/?name=Guest&background=random&color=fff&size=128`;

    if (user.avatarUrl && user.avatarUrl.trim() !== '') {
        return user.avatarUrl;
    }

    const name = user.name || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&bold=true`;
};
