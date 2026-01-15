-- Migrate existing landing pages (Business, Restaurant, Fleet) to landing_pages table
-- This ensures backward compatibility and allows them to be managed through the admin interface

-- Insert Business landing page
INSERT INTO landing_pages (tag, name, description, hero_title, subtitle, bg_color, header_image_url, relevancy_column, is_enabled, display_order)
VALUES (
  'business',
  'Business',
  'AI certification programs designed for business owners and entrepreneurs looking to leverage artificial intelligence to grow their business.',
  'The Best AI Certification for Business Owners',
  'at IFAIP',
  '#2563eb',
  '/hero.png',
  'business_relevancy',
  true,
  0
)
ON CONFLICT (tag) DO NOTHING;

-- Insert Restaurant landing page
INSERT INTO landing_pages (tag, name, description, hero_title, subtitle, bg_color, header_image_url, relevancy_column, is_enabled, display_order)
VALUES (
  'restaurant',
  'Restaurant',
  'Specialized AI training for restaurant owners to optimize operations, improve customer experience, and increase profitability.',
  'The Best AI Certification for Restaurant Owners',
  'at IFAIP',
  '#16a34a',
  '/hero.png',
  'restaurant_relevancy',
  true,
  1
)
ON CONFLICT (tag) DO NOTHING;

-- Insert Fleet landing page
INSERT INTO landing_pages (tag, name, description, hero_title, subtitle, bg_color, header_image_url, relevancy_column, is_enabled, display_order)
VALUES (
  'fleet',
  'Fleet',
  'AI certification courses tailored for fleet managers to enhance logistics, reduce costs, and improve operational efficiency.',
  'The Best AI Certification for Fleet Manager',
  'at IFAIP',
  '#9333ea',
  '/hero.png',
  'fleet_relevancy',
  true,
  2
)
ON CONFLICT (tag) DO NOTHING;
