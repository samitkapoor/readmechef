import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://readmechef.com';

  // Define all the static routes in your application
  const routes = [
    '',
    '/login'
    // Add more routes as your website grows
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8
  }));

  return routes;
}
