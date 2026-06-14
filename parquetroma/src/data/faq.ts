export interface FaqItem {
  id:       string;
  question: string;
  answer:   string;
}

export const faq: FaqItem[] = [
  {
    id: 'quanto-tempo',
    question: 'Quanto tempo richiede la posa del parquet?',
    answer: 'Per un appartamento standard di 80-100 mq la posa richiede in media 3-5 giorni lavorativi. I tempi variano in base alla metratura, alla complessità del pattern scelto (la spina di pesce richiede più tempo) e alle condizioni del sottofondo. Vi forniamo sempre un cronoprogramma preciso durante il sopralluogo gratuito.',
  },
  {
    id: 'preventivo',
    question: 'Come funziona il preventivo? È davvero gratuito?',
    answer: 'Sì, il preventivo è completamente gratuito e senza impegno. Effettuiamo un sopralluogo entro 48 ore dalla vostra richiesta, misuriamo lo spazio, valutiamo il sottofondo e vi presentiamo un preventivo dettagliato con materiali, tempistiche e costi. Non ci sono costi nascosti.',
  },
  {
    id: 'riscaldamento',
    question: 'Il parquet è compatibile con il riscaldamento a pavimento?',
    answer: 'Sì, installiamo parquet specifici per sistemi di riscaldamento a pavimento (idronico ed elettrico). Utilizziamo essenze e spessori certificati per questa applicazione, come quercia e bambù in versione prefinita. È fondamentale comunicarcelo prima della scelta del materiale per garantire le prestazioni ottimali.',
  },
  {
    id: 'garanzia',
    question: 'Che garanzia offrite sul lavoro eseguito?',
    answer: 'Offriamo garanzia di 5 anni sulla posa e 2 anni sulla levigatura/finitura. I materiali sono coperti dalla garanzia del produttore (solitamente 10-25 anni). In caso di difetti imputabili alla posa, interverremo gratuitamente per risolvere il problema.',
  },
  {
    id: 'zona',
    question: 'In quali zone di Roma operate?',
    answer: 'Operiamo su tutta Roma e provincia, oltre a tutto il Lazio. Le nostre zone principali includono: centro storico, Prati, Parioli, Flaminio, EUR, Trastevere, Testaccio, Ostiense, Trionfale e tutti i quartieri limitrofi. Per lavori in province distanti, valutiamo caso per caso.',
  },
];
