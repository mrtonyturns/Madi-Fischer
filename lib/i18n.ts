export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export interface CasaCopy {
  name: string;
  price: string;
  tagline: string;
  deck: string;
  water: string;
  highlight?: string;
}

/** One marker on the area map. `id` keys into the coordinate table that lives
 *  in components/area-map.tsx — copy is translated, geography is not. */
export interface PlaceCopy {
  id: string;
  name: string;
  category: "fishing" | "nature" | "adventure";
  travel: string;
  text: string;
}

export interface FormLabels {
  name: string;
  email: string;
  phone: string;
  message: string;
  placeholder: string;
  submit: string;
  sending: string;
  successTitle: string;
  successBody: string;
  genericError: string;
}

interface Dictionary {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogLocale: string;
  };
  nav: {
    casas: string;
    area: string;
    know: string;
    contact: string;
    cta: string;
    switchLabel: string;
    switchHref: string;
    menu: string;
    close: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scrollCue: string;
    imageAlt: string;
    /** Three short proof points under the buttons. */
    facts: string[];
  };
  highlights: {
    eyebrow: string;
    items: { title: string; text: string; cta: string; href: string }[];
  };
  stats: {
    eyebrow: string;
    items: { value: string; caption: string }[];
  };
  casas: {
    eyebrow: string;
    title: string;
    intro: string;
    perNight: string;
    beds: string;
    bath: string;
    kitchen: string;
    bookCta: string;
    askCta: string;
    /** Label used whenever the button hands off to Airbnb. */
    bookNowCta: string;
    note: string;
    list: CasaCopy[];
  };
  area: {
    eyebrow: string;
    title: string;
    sub: string;
    /** Map chrome. */
    filterAll: string;
    filterFishing: string;
    filterNature: string;
    filterAdventure: string;
    baseName: string;
    baseMeta: string;
    pacific: string;
    note: string;
    hint: string;
    /** "Get directions" / "See on Google Maps" on the detail card. */
    directionsCta: string;
    mapsCta: string;
    listingCta: string;
    places: PlaceCopy[];
  };
  know: {
    eyebrow: string;
    title: string;
    sub: string;
    items: { title: string; text: string }[];
  };
  reviews: {
    eyebrow: string;
    title: string;
    /** Credit line required when showing Google-sourced reviews. */
    source: string;
    readMore: string;
    ratingLabel: string;
  };
  book: {
    eyebrow: string;
    title: string;
    sub: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    sub: string;
    location: string;
  };
  form: FormLabels;
  footer: {
    tagline: string;
    rights: string;
  };
}

export const dict: Record<Locale, Dictionary> = {
  en: {
    meta: {
      title:
        "Fischer Tropitel | Jungle Casa Rentals & Sportfishing Near Quepos, Costa Rica",
      description:
        "Three private jungle casas above a waterfall near Quepos, Costa Rica — the sportfishing capital of the world. Full kitchens, private pool, hot springs hike, and local captains ready to take you fishing.",
      ogTitle: "Fischer Tropitel — Jungle Casa Rentals Near Quepos, Costa Rica",
      ogDescription:
        "Three private jungle casas above a waterfall near Quepos, Costa Rica. Wake up to howler monkeys, hike to hot springs, and fish the best waters in the world.",
      ogLocale: "en_US",
    },
    nav: {
      casas: "The Casas",
      area: "Fishing & Adventure",
      know: "Know Before You Go",
      contact: "Contact",
      cta: "Plan your stay",
      switchLabel: "Español",
      switchHref: "/es/",
      menu: "Open menu",
      close: "Close menu",
    },
    hero: {
      eyebrow: "Quepos, Costa Rica",
      title: "Three casas on a mountain, above a waterfall.",
      sub: "Wake up to the river. Walk to hot springs. Fish the waters that made Quepos famous — then come home to a house that's yours for the week.",
      ctaPrimary: "See the three casas",
      ctaSecondary: "Plan your stay",
      scrollCue: "Scroll",
      imageAlt:
        "The Fischer Tropitel casas on their private mountain property above Quepos, Costa Rica",
      facts: [
        "Private pool",
        "20-minute walk to hot springs",
        "Sleeps 6 per casa — 12 across all three",
      ],
    },
    highlights: {
      eyebrow: "Life on the mountain",
      items: [
        {
          title: "Coffee with a waterfall view",
          text: "The casas look out over the river and its waterfall — the soundtrack to your morning.",
          cta: "See the casas",
          href: "#casas",
        },
        {
          title: "The sportfishing that made Quepos famous",
          text: "We found this mountain on a fishing trip and never really left. Local captains can take you out for the day.",
          cta: "Explore the area",
          href: "#area",
        },
        {
          title: "Hot springs at the end of a jungle trail",
          text: "A 20-minute hike from your door ends at natural hot springs our guests get to use.",
          cta: "Explore the area",
          href: "#area",
        },
      ],
    },
    stats: {
      eyebrow: "Your vacation, our mountain",
      items: [
        {
          value: "3",
          caption: "fully furnished casas on one private jungle property",
        },
        {
          value: "6 / 12",
          caption:
            "guests per casa, or twelve if you take the whole property",
        },
        {
          value: "20 min",
          caption: "on foot from your door to natural hot springs",
        },
        {
          value: "$150–250",
          caption: "per night, depending on the casa and the season",
        },
      ],
    },
    casas: {
      eyebrow: "The Casas",
      title: "Pick your casa",
      intro:
        "Three fully furnished houses on one secluded mountain property. Each has two bedrooms, one bathroom, a fully equipped kitchen, and sleeps about six — twelve if you take all three. We bring our own three kids down every chance we get, so it is built for families as much as for fishermen.",
      perNight: "/ night",
      beds: "2 bedrooms · sleeps ~6",
      bath: "1 bathroom",
      kitchen: "Fully equipped kitchen",
      bookCta: "Book",
      askCta: "Ask about dates",
      bookNowCta: "Book now",
      note: "Good to know: the casas share one property, so if you book one, friendly neighbors may be staying in another. Rates are lower in the rainy season — ask us.",
      list: [
        {
          name: "Casa Cascada",
          price: "$250",
          tagline: "The fancy one — the biggest bathroom on the property.",
          deck: "Shares a big deck with Loads of Toads",
          water: "Hot water",
        },
        {
          name: "Loads of Toads",
          price: "$200",
          tagline: "Named for the neighbors you'll hear singing every night.",
          deck: "Shares a big deck with Casa Cascada",
          water: "Hot water",
        },
        {
          name: "Casa Verde",
          price: "$150",
          tagline: "Just as beautiful, priced lower for one honest reason:",
          deck: "Its own private deck",
          water: "No hot water (yet) — that's why it costs less",
          highlight:
            "The missing hot water is the only reason this one is $100 less a night — the house itself is every bit as nice as the other two. In the Costa Rican heat most guests barely notice, and we plan to add it.",
        },
      ],
    },
    area: {
      eyebrow: "Fishing & Adventure",
      title: "We came for the fishing. We stayed for everything else.",
      sub: "Our family found Quepos on a fishing vacation and never really left. It is a fishing town first, but there is plenty here for kids and for people who have never held a rod — here's everything within reach of the gate.",
      filterAll: "Everything",
      filterFishing: "Fishing",
      filterNature: "Nature",
      filterAdventure: "Adventure",
      baseName: "The casas",
      baseMeta: "You are here",
      pacific: "PACIFIC",
      note: "A sketch, not a survey — the bearings are right, the distances aren't. Travel times are real ones, measured from our gate.",
      directionsCta: "Get directions",
      mapsCta: "See on Google Maps",
      listingCta: "Fischer Tropitel on Google Maps",
      hint: "Pick a marker to see what's there and how far it is from your front door.",
      places: [
        {
          id: "quepos-marina",
          name: "Marina Pez Vela, Quepos",
          category: "fishing",
          travel: "25 min by car",
          text: "The reason we came to Costa Rica at all. Quepos is one of the world's great sailfish and marlin ports, and the fleet runs out of Marina Pez Vela year-round. Tell us when you're coming and we'll put you in touch with a captain we actually know.",
        },
        {
          id: "hot-springs",
          name: "Natural hot springs",
          category: "nature",
          travel: "20 min on foot",
          text: "Follow the trail down from the casas and you reach natural hot springs in about twenty minutes. Our guests are welcome to use them. Bring sandals you don't mind getting muddy.",
        },
        {
          id: "manuel-antonio",
          name: "Manuel Antonio National Park",
          category: "nature",
          travel: "35 min by car",
          text: "Costa Rica's most-loved national park: rainforest trails that end at white-sand coves, with sloths, iguanas and three kinds of monkey along the way. Go early — it opens at seven and the wildlife knows it.",
        },
        {
          id: "playa-espadilla",
          name: "Playa Espadilla",
          category: "nature",
          travel: "35 min by car",
          text: "The long public beach just outside the park gates. This is the reliable sunset — soft sand, warm water, and somewhere to eat dinner two minutes' walk away.",
        },
        {
          id: "rainmaker",
          name: "Rainmaker Reserve",
          category: "nature",
          travel: "25 min by car",
          text: "A private rainforest reserve with hanging bridges strung through the canopy, marked hiking trails, and swimming holes under the falls. Wilder than the national park, and a fraction of the crowd.",
        },
        {
          id: "jet-ski",
          name: "Jet skis & boat tours",
          category: "adventure",
          travel: "30 min by car",
          text: "Jet ski rentals, catamaran days and sunset boat tours all run off the same stretch of coast as the fishing fleet. Good half-day for the kids when nobody feels like a full offshore trip.",
        },
        {
          id: "canopy",
          name: "Zip lines & ATV trails",
          category: "adventure",
          travel: "20 min by car",
          text: "Canopy tours, ATV runs through the mountains and horseback rides all operate within twenty minutes of the gate. We'll book them for you rather than send you to a kiosk in town.",
        },
        {
          id: "savegre",
          name: "Rafting the Savegre",
          category: "adventure",
          travel: "45 min by car",
          text: "Class II–III whitewater through rainforest — gentle enough for a first-timer, long enough to feel like a real day out. Most trips include lunch on the riverbank.",
        },
        {
          id: "nauyaca",
          name: "Nauyaca Waterfalls",
          category: "adventure",
          travel: "1 hr 15 by car",
          text: "Two falls, the upper one dropping about 45 metres into a pool wide enough to swim across. Hike in, ride in on horseback, or take the truck. It's the longest day on this map and the one people talk about afterwards.",
        },
      ],
    },
    know: {
      eyebrow: "Know Before You Go",
      title: "This is the jungle, not a resort — and that's the point",
      sub: "We'd rather tell you everything up front so you show up excited, not surprised. Here's the honest version.",
      items: [
        {
          title: "You need 4-wheel drive",
          text: "The casas sit up a steep mountain road. A 4WD vehicle isn't a suggestion — it's how you get here. In the rainy season, fallen trees, mud, and the occasional cow in the road are part of the adventure.",
        },
        {
          title: "Solar power, jungle rules",
          text: "The property runs on solar with a backup generator. Heavy rain can interrupt power; our caretakers live on site and keep everything running and everyone comfortable.",
        },
        {
          title: "This is the jungle — really",
          text: "Frogs on the railing, monkeys in the trees, maybe a snake on the trail. If you want wildlife at arm's length, you'll love it here. If you want a resort lobby, this isn't it.",
        },
        {
          title: "Two very different seasons",
          text: "Dry season runs roughly December through April — that's prime time. The rainy season (April to December) is lush, green, and quieter, and getting up the mountain takes more patience.",
        },
      ],
    },
    reviews: {
      eyebrow: "Guest reviews",
      title: "What people say after they've stayed",
      source: "From our Google Business Profile",
      readMore: "Read all reviews on Google",
      ratingLabel: "out of 5",
    },
    book: {
      eyebrow: "Booking",
      title: "Book your stay",
      sub: "Pick your dates below and we'll confirm the details with you directly.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Ready to plan your trip?",
      sub: "Tell us the dates you're thinking about, how many people are coming, and whether you want us to line up a fishing captain. We'll get back to you with availability.",
      location:
        "In the mountains above Quepos, Costa Rica — about 200 meters past the Hot Springs Lodge",
    },
    form: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      message: "Tell us about your trip",
      placeholder:
        "Dates you're thinking about, how many people, which casa — and whether you'd like us to line up a fishing captain.",
      submit: "Send message",
      sending: "Sending…",
      successTitle: "Thanks — we got it.",
      successBody: "We'll be in touch shortly.",
      genericError: "Something went wrong. Please try again.",
    },
    footer: {
      tagline: "Jungle casa rentals near Quepos, Costa Rica",
      rights: "Pura vida.",
    },
  },
  es: {
    meta: {
      title:
        "Fischer Tropitel | Casas en la selva y pesca deportiva cerca de Quepos, Costa Rica",
      description:
        "Tres casas privadas en la selva sobre una catarata cerca de Quepos, Costa Rica — la capital mundial de la pesca deportiva. Cocinas completas, piscina privada, aguas termales y capitanes locales listos para llevarlo a pescar.",
      ogTitle:
        "Fischer Tropitel — Casas en la selva cerca de Quepos, Costa Rica",
      ogDescription:
        "Tres casas privadas en la selva sobre una catarata cerca de Quepos, Costa Rica. Despierte con los monos congo, camine a las aguas termales y pesque en las mejores aguas del mundo.",
      ogLocale: "es_CR",
    },
    nav: {
      casas: "Las Casas",
      area: "Pesca y Aventura",
      know: "Antes de Venir",
      contact: "Contacto",
      cta: "Planee su estadía",
      switchLabel: "English",
      switchHref: "/en/",
      menu: "Abrir menú",
      close: "Cerrar menú",
    },
    hero: {
      eyebrow: "Quepos, Costa Rica",
      title: "Tres casas en la montaña, sobre una catarata.",
      sub: "Despierte con el río. Camine a las aguas termales. Pesque en las aguas que hicieron famoso a Quepos — y vuelva a una casa que es suya toda la semana.",
      ctaPrimary: "Ver las tres casas",
      ctaSecondary: "Planee su estadía",
      scrollCue: "Baje",
      imageAlt:
        "Las casas de Fischer Tropitel en su propiedad privada en la montaña sobre Quepos, Costa Rica",
      facts: [
        "Piscina privada",
        "20 minutos a pie a las aguas termales",
        "6 personas por casa — 12 en las tres",
      ],
    },
    highlights: {
      eyebrow: "La vida en la montaña",
      items: [
        {
          title: "Café con vista a la catarata",
          text: "Las casas miran al río y su catarata — la banda sonora de su mañana.",
          cta: "Ver las casas",
          href: "#casas",
        },
        {
          title: "La pesca deportiva que hizo famoso a Quepos",
          text: "Encontramos esta montaña en un viaje de pesca y nunca nos fuimos del todo. Capitanes locales pueden llevarlo a pescar por el día.",
          cta: "Explorar la zona",
          href: "#area",
        },
        {
          title: "Aguas termales al final de un sendero",
          text: "Una caminata de 20 minutos desde su puerta termina en aguas termales naturales que nuestros huéspedes pueden usar.",
          cta: "Explorar la zona",
          href: "#area",
        },
      ],
    },
    stats: {
      eyebrow: "Sus vacaciones, nuestra montaña",
      items: [
        {
          value: "3",
          caption: "casas totalmente amuebladas en una propiedad privada en la selva",
        },
        {
          value: "6 / 12",
          caption:
            "huéspedes por casa, o doce si toma la propiedad entera",
        },
        {
          value: "20 min",
          caption: "a pie desde su puerta hasta las aguas termales naturales",
        },
        {
          value: "$150–250",
          caption: "por noche, según la casa y la temporada",
        },
      ],
    },
    casas: {
      eyebrow: "Las Casas",
      title: "Elija su casa",
      intro:
        "Tres casas totalmente amuebladas en una propiedad privada en la montaña. Cada una tiene dos habitaciones, un baño, cocina totalmente equipada y espacio para unas seis personas — doce si toma las tres. Bajamos con nuestros tres hijos cada vez que podemos, así que está pensada tanto para familias como para pescadores.",
      perNight: "/ noche",
      beds: "2 habitaciones · ~6 personas",
      bath: "1 baño",
      kitchen: "Cocina totalmente equipada",
      bookNowCta: "Reservar ahora",
      bookCta: "Reservar",
      askCta: "Consultar fechas",
      note: "Bueno saber: las casas comparten una misma propiedad, así que si reserva una, puede haber vecinos amistosos en otra. Las tarifas bajan en la temporada de lluvias — pregúntenos.",
      list: [
        {
          name: "Casa Cascada",
          price: "$250",
          tagline: "La elegante — con el baño más grande de la propiedad.",
          deck: "Comparte una gran terraza con Loads of Toads",
          water: "Agua caliente",
        },
        {
          name: "Loads of Toads",
          price: "$200",
          tagline: "Nombrada por los vecinos que oirá cantar cada noche.",
          deck: "Comparte una gran terraza con Casa Cascada",
          water: "Agua caliente",
        },
        {
          name: "Casa Verde",
          price: "$150",
          tagline: "Igual de linda, con un precio menor por una razón honesta:",
          deck: "Terraza privada propia",
          water: "Sin agua caliente (por ahora) — por eso cuesta menos",
          highlight:
            "La falta de agua caliente es la única razón por la que esta cuesta $100 menos por noche — la casa en sí es igual de linda que las otras dos. Con el calor de Costa Rica casi nadie lo nota, y pensamos instalarla.",
        },
      ],
    },
    area: {
      eyebrow: "Pesca y Aventura",
      title: "Vinimos por la pesca. Nos quedamos por todo lo demás.",
      sub: "Nuestra familia descubrió Quepos en unas vacaciones de pesca y nunca se fue del todo. Es un pueblo de pesca ante todo, pero hay de sobra para los niños y para quien nunca ha tomado una caña — esto es todo lo que queda al alcance del portón.",
      filterAll: "Todo",
      filterFishing: "Pesca",
      filterNature: "Naturaleza",
      filterAdventure: "Aventura",
      baseName: "Las casas",
      baseMeta: "Usted está aquí",
      pacific: "PACÍFICO",
      note: "Un croquis, no un plano — las direcciones son correctas, las distancias no. Los tiempos de viaje sí son reales, medidos desde nuestro portón.",
      directionsCta: "Cómo llegar",
      mapsCta: "Ver en Google Maps",
      listingCta: "Fischer Tropitel en Google Maps",
      hint: "Elija un punto para ver qué hay allí y a qué distancia queda de su puerta.",
      places: [
        {
          id: "quepos-marina",
          name: "Marina Pez Vela, Quepos",
          category: "fishing",
          travel: "25 min en carro",
          text: "La razón por la que vinimos a Costa Rica. Quepos es uno de los grandes puertos de pez vela y marlín del mundo, y la flota sale de Marina Pez Vela todo el año. Díganos cuándo viene y lo ponemos en contacto con un capitán que de verdad conocemos.",
        },
        {
          id: "hot-springs",
          name: "Aguas termales naturales",
          category: "nature",
          travel: "20 min a pie",
          text: "Baje por el sendero desde las casas y en unos veinte minutos llega a aguas termales naturales. Nuestros huéspedes pueden usarlas. Traiga sandalias que no le importe embarrar.",
        },
        {
          id: "manuel-antonio",
          name: "Parque Nacional Manuel Antonio",
          category: "nature",
          travel: "35 min en carro",
          text: "El parque nacional más querido de Costa Rica: senderos de selva que terminan en calas de arena blanca, con perezosos, iguanas y tres especies de mono por el camino. Vaya temprano — abre a las siete y la fauna lo sabe.",
        },
        {
          id: "playa-espadilla",
          name: "Playa Espadilla",
          category: "nature",
          travel: "35 min en carro",
          text: "La playa pública larga justo afuera del parque. Este es el atardecer seguro — arena suave, agua tibia y dónde cenar a dos minutos a pie.",
        },
        {
          id: "rainmaker",
          name: "Reserva Rainmaker",
          category: "nature",
          travel: "25 min en carro",
          text: "Una reserva privada de selva con puentes colgantes entre las copas de los árboles, senderos marcados para caminar y pozas para nadar bajo las cataratas. Más salvaje que el parque nacional y con una fracción de la gente.",
        },
        {
          id: "jet-ski",
          name: "Motos acuáticas y paseos en bote",
          category: "adventure",
          travel: "30 min en carro",
          text: "El alquiler de motos acuáticas, los días en catamarán y los paseos al atardecer salen del mismo tramo de costa que la flota de pesca. Buen medio día con los niños cuando nadie quiere una salida mar adentro completa.",
        },
        {
          id: "canopy",
          name: "Canopy y cuadraciclos",
          category: "adventure",
          travel: "20 min en carro",
          text: "Tours de canopy, recorridos en cuadraciclo por la montaña y paseos a caballo operan a menos de veinte minutos del portón. Se los reservamos nosotros en vez de mandarlo a un puesto en el pueblo.",
        },
        {
          id: "savegre",
          name: "Rafting en el Savegre",
          category: "adventure",
          travel: "45 min en carro",
          text: "Rápidos clase II–III entre la selva — suaves para principiantes y largos como para sentirse un día completo. Casi todos los tours incluyen almuerzo a la orilla del río.",
        },
        {
          id: "nauyaca",
          name: "Cataratas Nauyaca",
          category: "adventure",
          travel: "1 h 15 en carro",
          text: "Dos cataratas; la de arriba cae unos 45 metros a una poza lo bastante ancha para cruzarla nadando. Se llega a pie, a caballo o en camión. Es el paseo más largo de este mapa y del que la gente habla después.",
        },
      ],
    },
    know: {
      eyebrow: "Antes de Venir",
      title: "Esto es la selva, no un resort — y esa es la gracia",
      sub: "Preferimos contárselo todo de antemano para que llegue emocionado, no sorprendido. Esta es la versión honesta.",
      items: [
        {
          title: "Necesita un vehículo 4x4",
          text: "Las casas están subiendo un camino de montaña empinado. Un 4x4 no es una sugerencia — es la forma de llegar. En la temporada de lluvias, los árboles caídos, el barro y alguna vaca en el camino son parte de la aventura.",
        },
        {
          title: "Energía solar, reglas de la selva",
          text: "La propiedad funciona con energía solar y un generador de respaldo. La lluvia fuerte puede interrumpir la electricidad; nuestros cuidadores viven en la propiedad y mantienen todo funcionando y a todos cómodos.",
        },
        {
          title: "Esto es la selva — de verdad",
          text: "Ranas en la baranda, monos en los árboles, quizá una serpiente en el sendero. Si quiere la vida silvestre de cerca, le va a encantar. Si busca el lobby de un resort, esto no es eso.",
        },
        {
          title: "Dos temporadas muy distintas",
          text: "La temporada seca va más o menos de diciembre a abril — es la mejor época. La temporada de lluvias (de abril a diciembre) es verde, exuberante y más tranquila, y subir la montaña requiere más paciencia.",
        },
      ],
    },
    reviews: {
      eyebrow: "Opiniones de huéspedes",
      title: "Lo que dicen después de quedarse",
      source: "De nuestro perfil de Google Business",
      readMore: "Ver todas las opiniones en Google",
      ratingLabel: "de 5",
    },
    book: {
      eyebrow: "Reservas",
      title: "Reserve su estadía",
      sub: "Elija sus fechas abajo y confirmamos los detalles con usted directamente.",
    },
    contact: {
      eyebrow: "Contacto",
      title: "¿Listo para planear su viaje?",
      sub: "Cuéntenos qué fechas tiene en mente, cuántas personas vienen y si quiere que le coordinemos un capitán de pesca. Le responderemos con la disponibilidad.",
      location:
        "En las montañas sobre Quepos, Costa Rica — unos 200 metros después del Hot Springs Lodge",
    },
    form: {
      name: "Nombre",
      email: "Correo electrónico",
      phone: "Teléfono",
      message: "Cuéntenos sobre su viaje",
      placeholder:
        "Las fechas que tiene en mente, cuántas personas, cuál casa — y si quiere que le coordinemos un capitán de pesca.",
      submit: "Enviar mensaje",
      sending: "Enviando…",
      successTitle: "¡Gracias! Lo recibimos.",
      successBody: "Le escribiremos pronto.",
      genericError: "Algo salió mal. Inténtelo de nuevo.",
    },
    footer: {
      tagline: "Casas de alquiler en la selva cerca de Quepos, Costa Rica",
      rights: "Pura vida.",
    },
  },
};
