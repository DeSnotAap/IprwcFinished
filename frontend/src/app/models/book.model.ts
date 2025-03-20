export interface Book {
    id: number;
    title: string;
    author: string;
    description?: string;
    price: number;
    imageUrl?: string;
    categoryId?: number;
    categoryName?: string;
    publishedDate?: Date;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface BookRequest {
    title: string;
    author: string;
    description?: string;
    price: number;
    imageUrl?: string;
    categoryId?: number;
    publishedDate?: Date;
}

export interface CategoryRequest {
    name: string;
    description?: string;
}

export interface PageResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            unsorted: boolean;
        };
    };
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    size: number;
    number: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
} 