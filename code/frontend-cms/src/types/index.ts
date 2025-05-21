export interface Author {
  id: number;
  name: string;
  bio: string;
  email: string;
  avatar?: {
    url: string;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Issue {
  id: number;
  title: string;
  issueNumber: number;
  publishDate: string;
  featuredImage?: {
    url: string;
  };
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  featuredImage?: {
    url: string;
  };
  author: Author;
  categories: Category[];
  issue?: Issue;
}

export interface PaginationData {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    pagination: PaginationData;
  };
}
