export interface CartItem {
    id: number;
    bookId: number;
    title: string;
    author: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    subtotal: number;
}

export interface Cart {
    id?: number;
    userId?: number;
    items: CartItem[];
    itemCount: number;
    subtotal: number;
    total: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AddToCartRequest {
    bookId: number;
    quantity: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
} 