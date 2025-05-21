import axios from 'axios';
import type { Article, Author, Category, Issue } from '../types';

const API_URL = 'http://localhost:1337/api';
const API_HOST = 'http://localhost:1337';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to normalize Strapi response structure
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeResponse = <T>(response: any): T => {
  if (Array.isArray(response.data.data)) {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.data.map((item: any) => ({
      id: item.id,
      ...item,
      // Ensure categories is always an array
      categories: item.categories
        ? item.categories.map((cat: any) => ({
            id: cat.id,
            ...cat
          }))
        : [],
      // Ensure author is properly normalized
      author: item.author 
        ? {
            id: item.author.id,
            ...item.author
          }
        : null,
      // Ensure issue is properly normalized
      issue: item.issue
        ? {
            id: item.issue.id,
            ...item.issue
          }
        : null,
      // Ensure featuredImage is properly normalized
      featuredImage: item.featuredImage 
        ? {
            url: API_HOST+item.featuredImage.url
          }
        : null,
    })) as T;
  }
  
  const data = response;
//   return data;
    return {
    id: data.id,
    ...data,
    // Ensure categories is always an array
    categories: data.categories
      ? data.categories 
      : [],
    // Ensure author is properly normalized
    author: data.author
      ? {
          id: data.author.id,
          ...data.author
        }
      : null,
    // Ensure issue is properly normalized
    issue: data.issue
      ? {
          id: data.issue.id,
          ...data.issue
        }
      : null,
    // Ensure featuredImage is properly normalized
    featuredImage: data.featuredImage 
      ? {
          url: API_HOST+data.featuredImage.url
        }
      : null,
  } as T;
};

export const getArticles = async (page = 1, pageSize = 10, filters = {}) => {
  const response = await api.get('/articles', {
    params: {
      populate: ['author', 'categories', 'featuredImage', 'issue'],
      pagination: {
        page,
        pageSize,
      },
      filters,
      sort: ['publishedAt:desc'],
    },
  });
  
  return {
    data: normalizeResponse<Article[]>(response),
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
      populate: ['author', 'categories', 'featuredImage', 'issue'],
    },
  });
  
  return normalizeResponse<Article[]>(response)[0];
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
  
  return normalizeResponse<Category[]>(response);
};

export const getAuthors = async () => {
  const response = await api.get('/authors', {
    params: {
      populate: ['avatar'],
      sort: ['name:asc'],
    },
  });
  
  return normalizeResponse<Author[]>(response);
};

export const getIssues = async (page = 1, pageSize = 10) => {
  const response = await api.get('/issues', {
    params: {
      populate: ['featuredImage'],
      pagination: {
        page,
        pageSize,
      },
      sort: ['publishDate:desc'],
    },
  });
  
  return {
    data: normalizeResponse<Issue[]>(response),
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
