export interface Service {
  id:          string;
  slug:        string;
  title:       string;
  description: string;
  features:    string[];
  image: {
    src:    string;
    alt:    string;
    width:  number;
    height: number;
  };
  isFeatured?: boolean;
}

export const services: Service[] = [
  {
    id:          'parquet',
    slug:        'servizi#parquet',
    title:       'Posa Parquet',
    description: 'Installazione professionale di pavimenti in legno: quercia, noce, frassino, bambù. Dalla consulenza alla finitura, curiamo ogni fase.',
    features: [
      'Sopralluogo e consulenza gratuita',
      'Selezione materiali premium',
      'Pattern: spina di pesce, diagonale, dritto',
      'Levigatura, verniciatura e finitura',
      'Garanzia sul lavoro eseguito',
    ],
    image: { src: 'https://picsum.photos/seed/parquet-service/600/400', alt: 'Posa parquet professionale Roma', width: 600, height: 400 },
    isFeatured: true,
  },
  {
    id:          'porte',
    slug:        'servizi#porte',
    title:       'Installazione Porte',
    description: 'Completiamo la tua ristrutturazione con porte interne ed esterne in legno, coordinate con il parquet scelto.',
    features: [
      'Porte battente, scorrevoli, filomuro',
      'Coordinamento estetico parquet',
      'Montaggio telaio e controtelaio',
    ],
    image: { src: 'https://picsum.photos/seed/doors-service/600/400', alt: 'Installazione porte legno Roma', width: 600, height: 400 },
  },
  {
    id:          'consulenza',
    slug:        'contatti',
    title:       'Consulenza & Design',
    description: 'Ti guidiamo nella selezione del legno ideale, del pattern e delle finiture per esaltare il tuo spazio.',
    features: [
      'Analisi spazio e stile',
      'Campionari materiali e finiture',
      'Simulazione visiva del risultato',
    ],
    image: { src: 'https://picsum.photos/seed/design-consult/600/400', alt: 'Consulenza design parquet Roma', width: 600, height: 400 },
  },
  {
    id:          'levigatura',
    slug:        'servizi#levigatura',
    title:       'Levigatura & Restauro',
    description: 'Restituiamo vita al tuo parquet esistente con levigatura professionale, trattamenti anti-usura e finiture protettive.',
    features: [
      'Levigatura a secco senza polvere',
      'Ripristino graffi e ammaccature',
      'Oliatura e verniciatura professionale',
      'Stuccatura fughe e giunti',
    ],
    image: { src: 'https://picsum.photos/seed/parquet-restore/600/400', alt: 'Levigatura restauro parquet Roma', width: 600, height: 400 },
  },
];
