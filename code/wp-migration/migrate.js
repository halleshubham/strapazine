const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// CONFIGURATION
const WP_API = 'https://janataweekly.org/wp-json/wp/v2';
const STRAPI_API = 'http://127.0.0.1:1337/api';
const STRAPI_TOKEN = '4c10e6d41c8db3108ab1187ba725d5be6742cf3ed367455a3f20d7a320706b62868d569e2d7bbf400bcf051223db06c062360a11b72b780ec375714b976ac15c6f4129303ac48b54055f7043018f087ce57ba2edfbaa6a0583a93cbc899362a9c085168163e6f4e9ad5c74dc15cca239d0c47439bdc601d3ea59169a5cff3dc5'; // Create via Strapi Admin

const strapiHeaders = {
  Authorization: `Bearer ${STRAPI_TOKEN}`,
};

// Utilities
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function fetchWordPressPosts() {
  const url = `${WP_API}/posts?per_page=100&_embed`;
  const response = await axios.get(url);
  return response.data;
}

async function uploadImageToStrapi(media) {
  const url = media.source_url;
  const imageResp = await axios.get(url, { responseType: 'stream' });

  const form = new FormData();
  form.append('files', imageResp.data, media.slug + path.extname(url));

  const uploadResp = await axios.post(`${STRAPI_API}/upload`, form, {
    headers: {
      ...form.getHeaders(),
      ...strapiHeaders,
    },
  });

  return uploadResp.data[0]; // uploaded media object
}

async function createOrGetCategory(category) {
  const slug = category.slug;

  const existing = await axios.get(`${STRAPI_API}/categories?filters[slug][$eq]=${slug}`, { headers: strapiHeaders });
  if (existing.data.data.length > 0) return existing.data.data[0];

  const created = await axios.post(
    `${STRAPI_API}/categories`,
    { data: { name: category.name, slug: category.slug } },
    { headers: strapiHeaders }
  );
  return created.data.data;
}

async function createOrGetAuthor(author) {
  const existing = await axios.get(`${STRAPI_API}/authors?filters[wpId][$eq]=${author.id}`, { headers: strapiHeaders });
  if (existing.data.data.length > 0) return existing.data.data[0];

  const created = await axios.post(
    `${STRAPI_API}/authors`,
    {
      data: {
        name: author.name,
        wpId: author.id,
      },
    },
    { headers: strapiHeaders }
  );
  return created.data.data;
}

async function createArticle(post) {
  const title = post.title.rendered;
  const content = post.content.rendered;
  const wpId = post.id;
  const slug = post.slug;

  const authorData = post._embedded.author[0];
  const categoryData = post._embedded['wp:term'][0][0]; // Assuming one category
  const imageData = post._embedded['wp:featuredmedia']?.[0];

  const author = await createOrGetAuthor(authorData);
  const category = await createOrGetCategory(categoryData);

  let image = null;
  if (imageData) {
    try {
      image = await uploadImageToStrapi(imageData);
    } catch (e) {
      console.error('Image upload failed:', e.message);
    }
  }

  const articlePayload = {
    data: {
      title,
      content,
      wpId,
      slug,
      author: author.id,
      categories: [category.id],
      ...(image && { featuredImage: image.id }),
    },
  };

  const existing = await axios.get(`${STRAPI_API}/articles?filters[wpId][$eq]=${wpId}`, { headers: strapiHeaders });
  if (existing.data.data.length === 0) {
    const created = await axios.post(`${STRAPI_API}/articles`, articlePayload, { headers: strapiHeaders });
    console.log(`✅ Article Created: ${title}`);
    return created.data.data;
  } else {
    console.log(`⚠️  Skipped (already exists): ${title}`);
  }
}

async function main() {
  const posts = await fetchWordPressPosts();
  for (const post of posts) {
    await createArticle(post);
    await delay(500); // Respect rate limits
  }

  console.log('🎉 Migration complete.');
}

main().catch(console.error);
