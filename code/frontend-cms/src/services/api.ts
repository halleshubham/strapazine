import axios from 'axios';
import { ApiResponse, Article, Author, Category, Issue } from '../types';

const API_URL = 'http://localhost:1337/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to normalize Strapi response structure
const normalizeResponse = <T>(response: any): T => {
  if (Array.isArray(response.data)) {
    return response.data.map((item: any) => ({
      id: item.id,
      ...item.attributes,
    })) as T;
  }
  
  return {
    id: response.data.id,
    ...response.data.attributes,
  } as T;
};

export const getArticles = async (page = 1, pageSize = 10, filters = {}) => {
  const response = await api.get('/articles', {
    params: {
      populate: ['author', 'categories', 'coverImage', 'issue'],
      pagination: {
        page,
        pageSize,
      },
      filters,
      sort: ['publishedAt:desc'],
    },
  });
  
  return {
    data: normalizeResponse<Article[]>(response.data),
    meta: response.data.meta,
  };
};

export const getArticleBySlug = async (slug: string) => {
  const response = await api.get('/articles', {
    params: {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: ['author', 'categories', 'coverImage', 'issue'],
    },
  });
  
  return normalizeResponse<Article[]>(response.data)[0];
};

export const getArticlesByIssue = async (issueId: number, page = 1, pageSize = 10) => {
  return getArticles(page, pageSize, {
    issue: {
      id: {
        $eq: issueId,
      },
    },
  });
};

export const getArticlesByCategory = async (categorySlug: string, page = 1, pageSize = 10) => {
  return getArticles(page, pageSize, {
    categories: {
      slug: {
        $eq: categorySlug,
      },
    },
  });
};

export const getArticlesByAuthor = async (authorId: number, page = 1, pageSize = 10) => {
  return getArticles(page, pageSize, {
    author: {
      id: {
        $eq: authorId,
      },
    },
  });
};

export const getCategories = async () => {
  const response = await api.get('/categories', {
    params: {
      sort: ['name:asc'],
    },
  });
  
  return normalizeResponse<Category[]>(response.data);
};

export const getAuthors = async () => {
  const response = await api.get('/authors', {
    params: {
      populate: ['avatar'],
      sort: ['name:asc'],
    },
  });
  
  return normalizeResponse<Author[]>(response.data);
};

export const getIssues = async (page = 1, pageSize = 10) => {
  const response = await api.get('/issues', {
    params: {
      populate: ['coverImage'],
      pagination: {
        page,
        pageSize,
      },
      sort: ['publishDate:desc'],
    },
  });
  
  return {
    data: normalizeResponse<Issue[]>(response.data),
    meta: response.data.meta,
  };
};

export const searchArticles = async (query: string, page = 1, pageSize = 10) => {
  return getArticles(page, pageSize, {
    $or: [
      {
        title: {
          $containsi: query,
        },
      },
      {
        content: {
          $containsi: query,
        },
      },
    ],
  });
};

export default api;
