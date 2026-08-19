export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  AUTH: {
    ME: "/auth/me",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    COMPLETE_REGISTRATION: "/auth/completeprofile",
  },

  USERS: {
    BASE: "/users",
    PROFILE: (id: string) => `/users/${id}`,
    UPDATE_STATUS: "/users/status",
  },

  ASTROLOGERS: {
    DIRECTORY: "/astrologers",
    DETAILS: (id: string) => `/astrologers/${id}`,
    REVIEWS: (id: string) => `/astrologers/${id}/reviews`,
  },

  ADMIN: {
    USERS: "/admin/users",
    USER_DETAILS: (id: string) => `/admin/users/${id}`,

    ASTROLOGERS: "/admin/astrologers",
    PENDING_ASTROLOGERS: "/admin/astrologers/pending",
    ASTROLOGER_DETAILS: (id: string) => `/admin/astrologers/${id}`,

    APPROVE_ASTROLOGER: (id: string) => `/admin/astrologers/${id}/approve`,

    REJECT_ASTROLOGER: (id: string) => `/admin/astrologers/${id}/reject`,

    CHAT_USERS: "/admin/chat-users",
    CHATS: "/admin/chats",
  },
  
  CONSULTATIONS: {
    HISTORY: "/consultations/history",
    SESSION: (id: string) => `/consultations/session/${id}`,
  },

  SHOP: {
    // Products
    PRODUCTS: "/product",

    PRODUCT_DETAILS: (id: string) => `/product/${id}`,

    SEARCH_PRODUCTS: (keyword: string) => `/product/search/${keyword}`,

    // Admin APIs
    CREATE_PRODUCT: "/product",
    UPDATE_PRODUCT: (id: string) => `/product/${id}`,
    DELETE_PRODUCT: (id: string) => `/product/${id}`,

    // Cart
    CART: "/cart",

    ADD_TO_CART: "/cart",

    UPDATE_CART_ITEM: (productId: string) => `/cart/${productId}`,

    REMOVE_CART_ITEM: (productId: string) => `/cart/${productId}`,

    CLEAR_CART: "/cart",

    // Orders
    ORDERS: "/api/orders",

    ORDER_DETAILS: (id: string) => `/api/orders/${id}`,

    // Payment
    CREATE_PAYMENT: "/api/payment/create",

    VERIFY_PAYMENT: "/api/payment/verify",
  },
};

export const SOCKET_EVENTS = {
  CONNECT: "connect",

  DISCONNECT: "disconnect",

  ROOM: {
    JOIN: "room:join",
    LEAVE: "room:leave",
  },

  MESSAGE: {
    SEND: "message:send",
    RECEIVED: "message:received",
    TYPING: "message:typing",
  },

  CALL: {
    INITIATE: "call:initiate",
    RINGING: "call:ringing",
    CONNECTED: "call:connected",
    ACCEPTED: "call:accepted",
    REJECTED: "call:rejected",
    HANGUP: "call:hangup",
    SIGNAL: "call:webrtc-signal",
  },
};
