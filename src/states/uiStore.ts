import { create } from 'zustand';

interface UIState {
    isMenuOpen: boolean;
    selectedTab: string;
    setIsMenuOpen: (isOpen: boolean) => void;
    setSelectedTab: (tab: string) => void;
}

const useUIStore = create<UIState>()((set) => ({
    isMenuOpen: false,
    selectedTab: 'playlist',
    setIsMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
    setSelectedTab: (tab) => set({ selectedTab: tab }),
}));

export default useUIStore;
