"use client";

import LoginModal from "./LoginModal";
import { useAuthStore } from "../../store/authStore";

export default function AuthModalProvider() {
    const isLoginModalOpen = useAuthStore(
        (state) => state.isLoginModalOpen,
    );

    const closeLoginModal = useAuthStore(
        (state) => state.closeLoginModal,
    );

    return (
        <LoginModal
            open={isLoginModalOpen}
            onClose={closeLoginModal}
        />
    );
}