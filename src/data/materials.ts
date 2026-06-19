export interface Material {
  id:          string;
  name:        string;
  latin:       string;
  description: string;
  bg:          string;
  accentColor?: string;
  href:        string;
}

export const materials: Material[] = [
  {
    id:          'quercia',
    name:        'Quercia',
    latin:       'Quercus robur',
    description: 'Il classico per eccellenza. Venatura viva, caldo e resistente — perfetto per ambienti dal carattere forte.',
    bg:          'https://picsum.photos/seed/oak-wood/600/900',
    href:        '/servizi#quercia',
  },
  {
    id:          'noce',
    name:        'Noce',
    latin:       'Juglans regia',
    description: 'Eleganza scura e sofisticata. Il noce porta profondità e lusso in qualsiasi ambiente.',
    bg:          'https://picsum.photos/seed/walnut-wood/600/900',
    href:        '/servizi#noce',
  },
  {
    id:          'frassino',
    name:        'Frassino',
    latin:       'Fraxinus excelsior',
    description: 'Chiaro e contemporaneo. Il frassino amplifica la luce e dona un respiro moderno agli spazi.',
    bg:          'https://picsum.photos/seed/ash-wood/600/900',
    href:        '/servizi#frassino',
  },
  {
    id:          'bambu',
    name:        'Bambù',
    latin:       'Phyllostachys edulis',
    description: 'Sostenibile e resistente. Il bambù carbonizzato è una scelta eco-consapevole dal design unico.',
    bg:          'https://picsum.photos/seed/bamboo-floor/600/900',
    href:        '/servizi#bambu',
  },
];
