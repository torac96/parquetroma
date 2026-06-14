export const SITE_CONFIG = {
  name:        'ParquetRoma',
  url:         'https://www.parquetroma.it',
  phone:       '+39-06-1234-5678',
  phoneHref:   'tel:+390612345678',
  whatsapp:    'https://wa.me/390612345678',
  email:       'info@parquetroma.it',
  address: {
    street:   'Via del Parquet, 12',
    city:     'Roma',
    region:   'Lazio',
    zip:      '00100',
    country:  'IT',
  },
  geo: { lat: 41.9028, lng: 12.4964 },
  priceRange:  '€€€',
  areaServed:  ['Roma', 'Lazio'],
  rating: {
    value: 5.0,
    count: 127,
  },
  social: {
    facebook:  'https://facebook.com/parquetroma',
    instagram: 'https://instagram.com/parquetroma',
    google:    'https://g.page/parquetroma',
  },
} as const;

export const SCHEMA_LOCAL_BUSINESS = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_CONFIG.url}/#business`,
  name: SITE_CONFIG.name,
  description: 'Installazione professionale di parquet e porte a Roma con 20+ anni di esperienza artigianale.',
  url: SITE_CONFIG.url,
  telephone: SITE_CONFIG.phone,
  email: SITE_CONFIG.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress:   SITE_CONFIG.address.street,
    addressLocality: SITE_CONFIG.address.city,
    addressRegion:   SITE_CONFIG.address.region,
    postalCode:      SITE_CONFIG.address.zip,
    addressCountry:  SITE_CONFIG.address.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude:  SITE_CONFIG.geo.lat,
    longitude: SITE_CONFIG.geo.lng,
  },
  priceRange: SITE_CONFIG.priceRange,
  areaServed: SITE_CONFIG.areaServed,
  aggregateRating: {
    '@type':       'AggregateRating',
    ratingValue:   SITE_CONFIG.rating.value,
    reviewCount:   SITE_CONFIG.rating.count,
    bestRating:    5,
    worstRating:   1,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens:  '08:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens:  '09:00',
      closes: '13:00',
    },
  ],
};
