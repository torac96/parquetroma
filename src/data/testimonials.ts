export interface Testimonial {
  id:      string;
  name:    string;
  role:    string;
  quote:   string;
  rating:  number;
  avatar:  string;
}

export const testimonials: Testimonial[] = [
  {
    id:     'marco-b',
    name:   'Marco B.',
    role:   'Residenziale — Prati, Roma',
    quote:  'Professionalità eccezionale. Hanno installato 90 mq di quercia con spina di pesce in soli 4 giorni. Risultato impeccabile, rispettando ogni dettaglio del progetto.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Marco+B&background=C4922A&color=fff&size=96',
  },
  {
    id:     'giulia-m',
    name:   'Giulia M.',
    role:   'Villa Parioli, Roma',
    quote:  'Avevo bisogno di restaurare un parquet anni \'70. Il risultato è straordinario — sembra nuovo. Il team è gentile, puntuale e incredibilmente accurato.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Giulia+M&background=2D5016&color=fff&size=96',
  },
  {
    id:     'studio-arch',
    name:   'Studio Arch. Bianchi',
    role:   'Progetto commerciale — EUR, Roma',
    quote:  'Li utilizziamo per tutti i nostri cantieri. Affidabilità totale, materiali premium e una cura artigianale che fa la differenza nei progetti di lusso.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Studio+B&background=1E1A15&color=FAF8F4&size=96',
  },
  {
    id:     'anna-r',
    name:   'Anna R.',
    role:   'Appartamento — Trastevere, Roma',
    quote:  'Hanno trasformato il mio soggiorno in qualcosa di meraviglioso. Sono stati chiari sin dall\'inizio su costi e tempistiche, rispettando tutto alla lettera.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Anna+R&background=8B5E3C&color=fff&size=96',
  },
  {
    id:     'fabrizio-c',
    name:   'Fabrizio C.',
    role:   'Attico — Parioli, Roma',
    quote:  'Cercavo qualcuno che capisse davvero il legno. ParquetRoma ha superato ogni aspettativa — la qualità artigianale si vede e si sente sotto i piedi.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Fabrizio+C&background=C4922A&color=fff&size=96',
  },
  {
    id:     'sofia-g',
    name:   'Sofia G.',
    role:   'Casa nuova — Flaminio, Roma',
    quote:  'Dall\'inizio alla fine è stato un piacere. Il sopralluogo gratuito, i consigli sui materiali, la posa impeccabile. Consigliati assolutamente.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Sofia+G&background=3D6B20&color=fff&size=96',
  },
];
