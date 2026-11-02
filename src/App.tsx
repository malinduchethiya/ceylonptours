import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, CalendarDays, Check,
  CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Copy, ExternalLink,
  Image as ImageIcon, Inbox, LayoutDashboard, MapPin, Menu, MessageCircle,
  RotateCcw, Trash2, Upload, UsersRound, X,
} from "lucide-react";
import {
  PHONE_DISPLAY, PHONE_NUMBER, EMAIL, REQUESTS_KEY, destinations, benefits,
  gallery, vehicles, reviews, faqs, imageSlots, imageDefaults, imageGroups,
  whatsapp, readRequests, loadImageOverrides, storeImageOverrides, resizeUpload,
  type Destination, type QuoteForm, type QuoteRequest, type AdminTab,
} from "./siteData";

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="30" cy="16" r="4" stroke="currentColor" strokeWidth="1.1" />
      <path d="M7 31.5c6.5-6.7 11.5-6.7 17.5 0 6-7.8 11.2-7.8 16.5 0M7 37c6-5.5 11.5-5.5 17.5 0 5.7-6.7 11.3-6.7 16.5 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAllDestinations, setShowAllDestinations] = useState(false);
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [activeVehicle, setActiveVehicle] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [quote, setQuote] = useState<QuoteForm>({ name: "", country: "", arrivalDate: "", travellers: "2", details: "" });
  const [submittedLink, setSubmittedLink] = useState("");
  const [requests, setRequests] = useState<QuoteRequest[]>(readRequests);
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>({});
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imageSaveQueue = useRef<Promise<void>>(Promise.resolve());
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminTab>("overview");
  const [imageGroup, setImageGroup] = useState("Hero");
  const [draftImageUrls, setDraftImageUrls] = useState<Record<string, string>>({});
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [adminNotice, setAdminNotice] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 45);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    void loadImageOverrides().then((images) => {
      setImageOverrides(images);
      setImagesLoaded(true);
    });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    imageSaveQueue.current = imageSaveQueue.current.catch(() => {}).then(() => storeImageOverrides(imageOverrides));
  }, [imageOverrides, imagesLoaded]);

  useEffect(() => {
    try {
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    } catch {
      // The WhatsApp handoff still works when local browser storage is disabled.
    }
  }, [requests]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || activeDestination || galleryIndex !== null || adminOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, activeDestination, galleryIndex, adminOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setActiveDestination(null);
        setGalleryIndex(null);
        setAdminOpen(false);
      }
      if (galleryIndex !== null && event.key === "ArrowRight") setGalleryIndex((galleryIndex + 1) % gallery.length);
      if (galleryIndex !== null && event.key === "ArrowLeft") setGalleryIndex((galleryIndex - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [galleryIndex]);

  const getImage = (key: string) => imageOverrides[key] || imageDefaults[key];
  const visibleDestinations = showAllDestinations ? destinations : destinations.slice(0, 12);
  const selectedRequest = useMemo(() => requests.find((request) => request.id === selectedRequestId) || requests[0], [requests, selectedRequestId]);
  const newRequests = requests.filter((request) => request.status === "New").length;

  function togglePlace(place: string) {
    setSelectedPlaces((current) => current.includes(place) ? current.filter((item) => item !== place) : [...current, place]);
  }

  function updateQuote(field: keyof QuoteForm, value: string) {
    setQuote((current) => ({ ...current, [field]: value }));
    if (submittedLink) setSubmittedLink("");
  }

  function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const request: QuoteRequest = {
      ...quote,
      name: quote.name.trim(), country: quote.country.trim(), details: quote.details.trim(),
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
      createdAt: new Date().toISOString(), places: selectedPlaces, status: "New",
    };
    setRequests((current) => [request, ...current]);
    const message = `Hello Ceylon P Tours! I would like a private Sri Lanka tour quote.\n\nName: ${request.name}\nCountry: ${request.country}\nArrival date: ${request.arrivalDate}\nTravellers: ${request.travellers}\nPlaces I selected: ${request.places.length ? request.places.join(", ") : "Open to suggestions"}\nTrip ideas / who is travelling: ${request.details}`;
    const link = whatsapp(message);
    setSubmittedLink(link);
    window.open(link, "_blank", "noopener,noreferrer");
  }

  function updateImage(key: string, value?: string) {
    setImageOverrides((current) => {
      const updated = { ...current };
      if (value) updated[key] = value;
      else delete updated[key];
      return updated;
    });
  }

  async function uploadImage(key: string, file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAdminNotice("Please choose an image file.");
      return;
    }
    setUploadingKey(key);
    try {
      const image = await resizeUpload(file);
      updateImage(key, image);
      setDraftImageUrls((current) => ({ ...current, [key]: "" }));
      setAdminNotice("Image updated. The preview is saved in this browser.");
    } catch {
      setAdminNotice("This image could not be uploaded. Please try another file.");
    } finally {
      setUploadingKey(null);
    }
  }

  function saveImageUrl(key: string) {
    const value = (draftImageUrls[key] || "").trim();
    if (!/^https?:\/\//i.test(value)) {
      setAdminNotice("Enter a full https:// or http:// image URL.");
      return;
    }
    updateImage(key, value);
    setDraftImageUrls((current) => ({ ...current, [key]: "" }));
    setAdminNotice("Image URL saved in this browser.");
  }

  function markRequest(id: string) {
    setRequests((current) => current.map((request) => request.id === id ? { ...request, status: request.status === "New" ? "Replied" : "New" } : request));
  }

  function deleteRequest(id: string) {
    if (!window.confirm("Delete this local request preview?")) return;
    setRequests((current) => current.filter((request) => request.id !== id));
    setSelectedRequestId(null);
  }

  async function copyRequest(request: QuoteRequest) {
    const brief = `${request.name} | ${request.country} | Arrival: ${request.arrivalDate} | Travellers: ${request.travellers}\nPlaces: ${request.places.join(", ") || "Open to suggestions"}\n${request.details}`;
    try {
      await navigator.clipboard.writeText(brief);
      setAdminNotice("Request details copied.");
    } catch {
      setAdminNotice("Clipboard access is unavailable in this browser.");
    }
  }

  const navItems = [
    { label: "Destinations", href: "#destinations" },
    { label: "About", href: "#about" },
    { label: "Your guide", href: "#guide" },
    { label: "Gallery", href: "#gallery" },
    { label: "Reviews", href: "#reviews" },
  ];

  return (
    <>
      <div id="top" />
      <header className={`site-header ${scrolled || menuOpen ? "is-scrolled" : ""}`}>
        <div className="header-inner">
          <a className="nav-brand" href="#top" aria-label="Ceylon P Tours, back to top" onClick={() => setMenuOpen(false)}>
            <BrandMark />
            <span className="nav-brand-copy"><strong>Ceylon P Tours</strong><small>PRIVATE SRI LANKA JOURNEYS</small></span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map((item) => <a href={item.href} key={item.label}>{item.label}</a>)}
          </nav>
          <a className="header-cta" href="#quote">Plan a journey <ArrowUpRight size={16} strokeWidth={1.8} /></a>
          <button type="button" className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
            {menuOpen ? <X size={25} strokeWidth={1.6} /> : <Menu size={26} strokeWidth={1.6} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.25 }}>
            <div className="mobile-nav-links">
              {navItems.map((item, index) => <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{item.label}<ArrowUpRight size={20} /></a>)}
              <a href="#vehicles" onClick={() => setMenuOpen(false)}><span>06</span>Vehicles<ArrowUpRight size={20} /></a>
              <a href="#faq" onClick={() => setMenuOpen(false)}><span>07</span>FAQ<ArrowUpRight size={20} /></a>
            </div>
            <a className="button button-dark mobile-nav-cta" href="#quote" onClick={() => setMenuOpen(false)}>Get a private quote <ArrowUpRight size={18} /></a>
            <p>Kandy, Sri Lanka <span /> {PHONE_DISPLAY}</p>
          </motion.nav>
        )}
      </AnimatePresence>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <motion.img className="hero-image" src={getImage("hero")} alt="Sigiriya Rock rising above the forest in Sri Lanka" initial={reduceMotion ? false : { scale: 1.055 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: "easeOut" }} />
          <div className="hero-shade" />
          <div className="hero-content page-container">
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.16 }}>
              <p className="hero-eyebrow"><span className="eyebrow-line" /> <span lang="si">ආයුබෝවන්</span> <span className="eyebrow-divider">/</span> KANDY, SRI LANKA</p>
              <h1 id="hero-title">Ceylon<br /><em>P Tours</em></h1>
            </motion.div>
            <motion.div className="hero-bottom" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.38 }}>
              <div><p className="hero-description">Private tours of Sri Lanka,<br />beautifully your own.</p><p className="hero-subdescription">Your route. Your guide. Your pace.</p></div>
              <div className="hero-actions">
                <a className="button button-mint" href="#quote">Plan your private tour <ArrowUpRight size={19} strokeWidth={1.8} /></a>
                <a className="hero-text-link" href="#destinations">Explore the island <ArrowDown size={17} strokeWidth={1.8} /></a>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="journey-strip-wrap page-container">
          <div className="journey-strip">
            <div className="journey-strip-item"><span className="strip-number">01 / THE PLACES</span><h2>Your route</h2><p>Sigiriya, Kandy, tea hills, Yala and the coast, shaped around your days.</p></div>
            <div className="journey-strip-item"><span className="strip-number">02 / THE PEOPLE</span><h2>Your driver-guide</h2><p>Pradeep and the team stay with you from pickup to drop-off.</p></div>
            <div className="journey-strip-item"><span className="strip-number">03 / THE JOURNEY</span><h2>Your vehicle</h2><p>Car, luxury van or mini coach. Yours for the whole trip.</p></div>
          </div>
        </div>

        <section className="destinations-section section-pad" id="destinations" aria-labelledby="destinations-title">
          <div className="page-container">
            <div className="section-heading destinations-heading">
              <Reveal><p className="eyebrow"><span className="eyebrow-line" /> SRI LANKA / DESTINATIONS</p><h2 id="destinations-title">Every kind of <em>island.</em></h2></Reveal>
              <Reveal className="heading-aside" delay={0.1}><p>From ancient kingdoms and misty tea hills to wild safaris and slow coastal days. Wherever you dream of going, we will take you there.</p><a href="#quote" className="underlined-link">Build my own route <ArrowUpRight size={17} /></a></Reveal>
            </div>
            <div className="destinations-grid">
              {visibleDestinations.map((destination, index) => (
                <article className="destination-item" key={destination.name}>
                  <button type="button" className="destination-photo" onClick={() => setActiveDestination(destination)} aria-label={`More details about ${destination.name}`}>
                    <img src={getImage(`destination-${destination.name}`)} alt={`${destination.name}, Sri Lanka`} loading="lazy" />
                    <span className="destination-photo-arrow"><ArrowUpRight size={21} strokeWidth={1.7} /></span>
                  </button>
                  <div className="destination-copy">
                    <div className="destination-topline"><span>{destination.category}</span><span>{String(index + 1).padStart(2, "0")} / {String(destinations.length).padStart(2, "0")}</span></div>
                    <h3>{destination.name}</h3><p>{destination.description}</p>
                    <div className="destination-foot"><span>{destination.places.join("  /  ")}</span><button type="button" onClick={() => setActiveDestination(destination)}>More details <ArrowUpRight size={14} /></button></div>
                  </div>
                </article>
              ))}
            </div>
            <div className="destinations-actions">
              <button type="button" className="show-more-button" onClick={() => setShowAllDestinations(!showAllDestinations)}>{showAllDestinations ? "Show featured destinations" : "Explore all 15 destinations"} <span>{showAllDestinations ? <ArrowUp size={18} /> : <ArrowDown size={18} />}</span></button>
              <div className="destinations-quote-links"><a href={whatsapp("Hello Ceylon P Tours! I would love to explore Sri Lanka with you.")} target="_blank" rel="noreferrer">WhatsApp us <ArrowUpRight size={17} /></a><a href="#quote">Ask for a custom route <ArrowUpRight size={17} /></a></div>
            </div>
          </div>
        </section>

        <section className="about-section section-pad" id="about" aria-labelledby="about-title">
          <div className="page-container about-layout">
            <Reveal className="about-copy">
              <p className="eyebrow"><span className="eyebrow-line" /> WHY BOOK CEYLON P TOURS</p>
              <h2 id="about-title">Private Sri Lanka tours <em>from Kandy.</em></h2>
              <p>Ceylon P Tours is a private tour company based in Kandy, Sri Lanka. Couples, families and friends travel in one air-conditioned car, luxury van or mini coach, with pickup at Colombo Bandaranaike International Airport (CMB) or a hotel in Colombo or Negombo.</p>
              <p>We plan custom routes around the island: Sigiriya and Dambulla in the Cultural Triangle, the Temple of the Tooth in Kandy, Nuwara Eliya tea country, Ella and the Nine Arch Bridge, Yala or Udawalawe safari, Galle Fort, Mirissa whale watching, plus the east and north when the season is right - Trincomalee, Arugam Bay and Jaffna.</p>
              <p>Send your dates, group size and places on WhatsApp {PHONE_DISPLAY}. We reply with a private itinerary and a quote. There are no group buses.</p>
              <a href="#quote" className="text-arrow-link">Let's plan your journey <span><ArrowUpRight size={19} /></span></a>
            </Reveal>
            <Reveal className="about-image-wrap" delay={0.12}><img src={getImage("about")} alt="Lush green tea country in Sri Lanka" loading="lazy" /><div className="editorial-caption"><span>01 / THE WAY WE TRAVEL</span><span>One island, countless ways to feel it.</span></div></Reveal>
          </div>
        </section>

        <section className="benefits-section section-pad" aria-labelledby="benefits-title">
          <div className="page-container">
            <div className="benefits-heading"><Reveal><p className="eyebrow"><span className="eyebrow-line" /> WHY CEYLON P TOURS</p><h2 id="benefits-title">A private Sri Lanka tour, <em>not a group bus.</em></h2></Reveal><Reveal delay={0.1}><p>You travel as one family or couple. One licensed guide. One vehicle. One WhatsApp for the whole trip.</p></Reveal></div>
            <div className="benefits-grid">{benefits.map((benefit, index) => <Reveal key={benefit.title} className="benefit" delay={(index % 3) * 0.07}><span className="benefit-number">0{index + 1}</span><h3>{benefit.title}</h3><p>{benefit.text}</p></Reveal>)}</div>
          </div>
        </section>

        <section className="guide-section" id="guide" aria-labelledby="guide-title">
          <div className="guide-visual"><img src={getImage("guide")} alt="A traveller walking through the tea fields of Sri Lanka" loading="lazy" /><span className="guide-visual-caption">A more personal way to see the island.</span></div>
          <div className="guide-content"><Reveal>
            <p className="eyebrow eyebrow-light"><span className="eyebrow-line" /> YOUR TOUR GUIDE</p>
            <h2 id="guide-title">Travel with someone who <em>knows the island.</em></h2>
            <p className="guide-intro">Ceylon P Tours is based in Kandy. Every private tour includes a licensed guide and one vehicle from airport pickup to drop-off.</p>
            <div className="guide-person"><span>Pradeep Rathnayake</span><small>LICENSED NATIONAL DRIVER-GUIDE</small></div>
            <div className="guide-details"><div><span>01 / ARRIVAL</span><strong>Airport pickup and drop-off at Colombo (CMB)</strong></div><div><span>02 / LANGUAGE</span><strong>English and Sinhala spoken</strong></div><div><span>03 / PRIVATE</span><strong>One group, one vehicle</strong></div><div><span>04 / FLEXIBLE</span><strong>Your pace, your stops</strong></div><div><span>05 / BASED</span><strong>Kandy, Sri Lanka</strong></div></div>
            <div className="guide-actions"><a className="button button-mint" href="#quote">Ask for a quote <ArrowUpRight size={18} /></a><a href={whatsapp("Hello Pradeep, I would like to plan a private Sri Lanka tour.")} target="_blank" rel="noreferrer" className="guide-message-link">Message Pradeep <ArrowUpRight size={17} /></a></div>
          </Reveal></div>
        </section>

        <section className="gallery-section section-pad" id="gallery" aria-labelledby="gallery-title">
          <div className="page-container">
            <div className="section-heading gallery-heading"><Reveal><p className="eyebrow"><span className="eyebrow-line" /> MOMENTS ALONG THE WAY</p><h2 id="gallery-title">A journey in <em>pictures.</em></h2></Reveal><Reveal className="heading-aside" delay={0.1}><p>From the first sunrise to the last stretch of coast. Tap any image to take a closer look.</p><span className="gallery-note">Preview photography. Your own guest photos can be added in Admin.</span></Reveal></div>
            <div className="gallery-grid">{gallery.map((item, index) => <button type="button" key={item.caption} className={`gallery-item gallery-item-${index + 1}`} onClick={() => setGalleryIndex(index)} aria-label={`Open photo ${index + 1}: ${item.caption}`}><img src={getImage(`gallery-${index}`)} alt={item.caption} loading="lazy" /><span className="gallery-item-caption"><span>{item.caption}</span><ArrowUpRight size={18} /></span></button>)}</div>
          </div>
        </section>

        <section className="vehicles-section section-pad" id="vehicles" aria-labelledby="vehicles-title">
          <div className="page-container">
            <div className="vehicles-heading"><Reveal><p className="eyebrow"><span className="eyebrow-line" /> OUR VEHICLES</p><h2 id="vehicles-title">The right vehicle for <em>every group.</em></h2></Reveal><Reveal delay={0.1}><p>Your vehicle travels with you throughout your journey. The same clean, comfortable vehicle and driver-guide stay from the first day to the last.</p></Reveal></div>
            <div className="vehicles-layout">
              <div className="vehicle-options">{vehicles.map((vehicle, index) => <button type="button" key={vehicle.name} className={`vehicle-option ${activeVehicle === index ? "is-active" : ""}`} onClick={() => setActiveVehicle(index)} aria-pressed={activeVehicle === index}><span className="vehicle-option-number">0{index + 1}</span><span className="vehicle-option-content"><span className="vehicle-option-head"><strong>{vehicle.name}</strong>{index === 1 && <small>MOST POPULAR</small>}</span><span className="vehicle-option-meta">{vehicle.capacity} <span /> {vehicle.bestFor}</span>{activeVehicle === index && <span className="vehicle-option-expanded"><span>Capacity <b>{vehicle.capacity}</b></span><span>Luggage <b>{vehicle.luggage}</b></span><span>Air conditioning <b>Fully air-conditioned</b></span><span>Best for <b>{vehicle.bestFor}</b></span></span>}</span><ArrowUpRight className="vehicle-option-arrow" size={20} strokeWidth={1.6} /></button>)}<a href="#quote" className="text-arrow-link vehicle-quote-link">Find my vehicle <span><ArrowUpRight size={19} /></span></a></div>
              <div className="vehicle-images"><AnimatePresence mode="wait"><motion.img key={vehicles[activeVehicle].imageKey} className="vehicle-image-main" src={getImage(vehicles[activeVehicle].imageKey)} alt={`${vehicles[activeVehicle].name} example`} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} /></AnimatePresence><img className="vehicle-image-small-one" src={getImage("vehicle-detail-1")} alt="Scenic road through Sri Lanka" loading="lazy" /><img className="vehicle-image-small-two" src={getImage("vehicle-detail-2")} alt="Comfortable vehicle interior" loading="lazy" /><img className="vehicle-image-bottom-one" src={getImage("vehicle-detail-3")} alt="Mini coach in a tropical landscape" loading="lazy" /><img className="vehicle-image-bottom-two" src={getImage("vehicle-detail-4")} alt="Private car on a coastal road" loading="lazy" /><span className="vehicle-image-note">Vehicle images are illustrative. Upload your own fleet in Admin.</span></div>
            </div>
          </div>
        </section>

        <section className="reviews-section section-pad" id="reviews" aria-labelledby="reviews-title">
          <div className="page-container"><div className="section-heading reviews-heading"><Reveal><p className="eyebrow"><span className="eyebrow-line" /> WORDS FROM THE ROAD</p><h2 id="reviews-title">Loved by <em>travellers.</em></h2></Reveal><Reveal className="heading-aside" delay={0.1}><p>Real 5-star Google reviews for Ceylon P Tours. Safe driving, a friendly licensed guide and a clean vehicle.</p></Reveal></div><div className="reviews-grid">{reviews.map((review) => <article className="review" key={review.name}><div className="review-top"><span className="review-stars" aria-label="5 out of 5 stars">★★★★★</span><span className="review-source">GOOGLE REVIEW</span></div><blockquote>"{review.quote}"</blockquote><div className="review-author"><span className="review-avatar">{review.name.charAt(0)}</span><span>{review.name}</span></div></article>)}</div><a className="reviews-cta" href="#quote">I want a trip like theirs <ArrowUpRight size={19} /></a></div>
        </section>

        <section className="faq-section section-pad" id="faq" aria-labelledby="faq-title">
          <div className="page-container faq-layout"><Reveal className="faq-intro"><p className="eyebrow"><span className="eyebrow-line" /> GOOD TO KNOW</p><h2 id="faq-title">Questions <em>guests ask.</em></h2><p>Everything you might want to know before you send a quote request.</p><a href={whatsapp("Hello Ceylon P Tours! I have a question about a private tour.")} target="_blank" rel="noreferrer" className="underlined-link">Still curious? Ask us <ArrowUpRight size={17} /></a></Reveal><div className="faq-list">{faqs.map((faq, index) => <div className="faq-item" key={faq.question}><button type="button" aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{faq.question}</span><span className="faq-toggle">{openFaq === index ? <X size={18} strokeWidth={1.6} /> : <ChevronDown size={20} strokeWidth={1.6} />}</span></button><AnimatePresence initial={false}>{openFaq === index && <motion.div id={`faq-answer-${index}`} className="faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}><p>{faq.answer}</p></motion.div>}</AnimatePresence></div>)}</div></div>
        </section>

        <section className="quote-section section-pad" id="quote" aria-labelledby="quote-title">
          <div className="page-container quote-layout"><Reveal className="quote-copy"><p className="eyebrow eyebrow-light"><span className="eyebrow-line" /> GET A FREE PRIVATE QUOTE</p><p className="quote-welcome"><span lang="si">ආයුබෝවන්</span> / CEYLON P TOURS, KANDY</p><h2 id="quote-title">Your Sri Lanka story <em>starts here.</em></h2><p className="quote-intro">Private tours of Sri Lanka at your own pace. Licensed national driver-guide, your own air-conditioned vehicle, Colombo airport pickup. Tell us your dates and we will send a free private quote.</p><div className="quote-contact"><a href={`https://wa.me/${PHONE_NUMBER}`} target="_blank" rel="noreferrer"><span>WHATSAPP</span><strong>{PHONE_DISPLAY}</strong><ArrowUpRight size={18} /></a><a href={`mailto:${EMAIL}`}><span>EMAIL</span><strong>{EMAIL}</strong><ArrowUpRight size={18} /></a><div><span>BASED IN</span><strong>Kandy, Sri Lanka / Airport: Colombo CMB</strong><MapPin size={18} /></div></div></Reveal>
            <Reveal className="quote-form-wrap" delay={0.12}><form className="quote-form" onSubmit={submitQuote}><div className="form-heading"><span className="form-index">01 / YOUR JOURNEY</span><h3>Tell us what you <em>have in mind.</em></h3><p>A few details are enough to get started.</p></div><div className="form-grid"><label className="form-field"><span>Your name *</span><input type="text" name="name" placeholder="Your full name" value={quote.name} onChange={(event) => updateQuote("name", event.target.value)} required autoComplete="name" /></label><label className="form-field"><span>Country *</span><input type="text" name="country" placeholder="Where are you travelling from?" value={quote.country} onChange={(event) => updateQuote("country", event.target.value)} required autoComplete="country-name" /></label><label className="form-field"><span>Arrival date *</span><input type="date" name="arrivalDate" value={quote.arrivalDate} onChange={(event) => updateQuote("arrivalDate", event.target.value)} required /></label><label className="form-field"><span>Travellers *</span><select name="travellers" value={quote.travellers} onChange={(event) => updateQuote("travellers", event.target.value)} required><option value="1">1 traveller</option><option value="2">2 travellers</option><option value="3">3 travellers</option><option value="4">4 travellers</option><option value="5-8">5-8 travellers</option><option value="9+">9+ travellers</option></select></label><label className="form-field form-field-full"><span>Where do you want to go, what do you want to do, and who is travelling? *</span><textarea name="details" rows={5} placeholder="Tell us about your dream route, interests, and who is coming along..." value={quote.details} onChange={(event) => updateQuote("details", event.target.value)} required /></label></div>{selectedPlaces.length > 0 && <div className="form-selected-places"><span>PLACES ON YOUR ROUTE</span><div>{selectedPlaces.map((place) => <button type="button" key={place} onClick={() => togglePlace(place)} title={`Remove ${place}`}>{place} <X size={13} /></button>)}</div></div>}<button type="submit" className="button button-dark form-submit">Get my free quote on WhatsApp <ArrowUpRight size={18} /></button><p className="form-helper">WhatsApp opens with your details. Press send there to deliver your request.</p>{submittedLink && <div className="form-success" role="status"><CheckCircle2 size={19} /><span>Your message is ready. <a href={submittedLink} target="_blank" rel="noreferrer">Open WhatsApp again</a> if it did not open automatically.</span></div>}</form></Reveal>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-container">
          <div className="footer-main">
            <div className="footer-brand-block"><a href="#top" className="footer-brand"><BrandMark /><span>Ceylon P Tours</span></a><p>Private tours of Sri Lanka from Kandy. Your own vehicle, Colombo (CMB) airport pickup, custom routes to Sigiriya, Ella, Yala, Galle and Mirissa.</p><a className="footer-whatsapp" href={whatsapp("Hello Ceylon P Tours! I would like a private tour quote.")} target="_blank" rel="noreferrer">WhatsApp quote <ArrowUpRight size={17} /></a></div>
            <div className="footer-column"><h3>EXPLORE</h3><a href="#destinations">Destinations</a><a href="#about">About</a><a href="#guide">Your guide</a><a href="#gallery">Gallery</a><a href="#vehicles">Vehicles</a><a href="#reviews">Reviews</a><a href="#faq">FAQ</a></div>
            <div className="footer-column footer-contact-column"><h3>GET IN TOUCH</h3><a href={`tel:+${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a><span>Kandy, Central Province, Sri Lanka</span><span>Airport pickup: Colombo CMB</span><a href="#quote" className="footer-quote-link">Quote form <ArrowUpRight size={16} /></a></div>
          </div>
          <div className="footer-destinations">Sigiriya <span /> Kandy <span /> Dambulla <span /> Nuwara Eliya <span /> Ella <span /> Yala <span /> Galle Fort <span /> Mirissa <span /> Colombo <span /> Anuradhapura <span /> Polonnaruwa <span /> Trincomalee <span /> Arugam Bay <span /> Jaffna <span /> Udawalawe</div>
          <div className="footer-bottom"><span>© 2026 Ceylon P Tours. Private tours of Sri Lanka from Kandy. All rights reserved.</span><div><button type="button" onClick={() => { setAdminOpen(true); setAdminTab("overview"); }} className="footer-admin">Admin</button><a href="#top">Back to top <ArrowUp size={15} /></a></div></div>
        </div>
      </footer>

      <AnimatePresence>
        {activeDestination && <motion.div className="overlay-backdrop" role="presentation" onMouseDown={() => setActiveDestination(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="destination-modal" role="dialog" aria-modal="true" aria-labelledby="destination-modal-title" onMouseDown={(event) => event.stopPropagation()} initial={reduceMotion ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <button type="button" className="modal-close" onClick={() => setActiveDestination(null)} aria-label="Close destination details"><X size={21} /></button>
            <div className="destination-modal-image"><img src={getImage(`destination-${activeDestination.name}`)} alt={activeDestination.name} /></div>
            <div className="destination-modal-copy"><p className="eyebrow"><span className="eyebrow-line" /> {activeDestination.category.toUpperCase()}</p><h2 id="destination-modal-title">{activeDestination.name}</h2><p className="destination-modal-description">{activeDestination.description}.</p><p className="modal-list-label">THINGS TO EXPLORE</p><ul>{activeDestination.places.map((place, index) => <li key={place}><span>0{index + 1}</span>{place}</li>)}</ul><button type="button" className="button button-dark" onClick={() => { togglePlace(activeDestination.name); setActiveDestination(null); }}>{selectedPlaces.includes(activeDestination.name) ? "Remove from my route" : "Add to my route"} {selectedPlaces.includes(activeDestination.name) ? <Check size={18} /> : <ArrowUpRight size={18} />}</button><a href={whatsapp(`Hello Ceylon P Tours! I would love to include ${activeDestination.name} in my private tour.`)} target="_blank" rel="noreferrer" className="modal-whatsapp">Ask about {activeDestination.name} <ArrowUpRight size={16} /></a></div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {galleryIndex !== null && <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={`Photo ${galleryIndex + 1} of ${gallery.length}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" className="lightbox-close" onClick={() => setGalleryIndex(null)} aria-label="Close photo"><X size={24} /></button>
          <button type="button" className="lightbox-arrow lightbox-prev" onClick={() => setGalleryIndex((galleryIndex - 1 + gallery.length) % gallery.length)} aria-label="Previous photo"><ChevronLeft size={25} /></button>
          <motion.img key={galleryIndex} src={getImage(`gallery-${galleryIndex}`)} alt={gallery[galleryIndex].caption} initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} />
          <button type="button" className="lightbox-arrow lightbox-next" onClick={() => setGalleryIndex((galleryIndex + 1) % gallery.length)} aria-label="Next photo"><ChevronRight size={25} /></button>
          <div className="lightbox-caption"><span>{gallery[galleryIndex].caption}</span><span>{String(galleryIndex + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</span></div>
        </motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {adminOpen && <motion.div className="admin-shell" role="dialog" aria-modal="true" aria-label="Ceylon P Tours admin preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <aside className="admin-sidebar">
            <div className="admin-brand"><BrandMark /><span>Ceylon P Tours<small>ADMIN PREVIEW</small></span></div>
            <nav aria-label="Admin navigation">
              <button type="button" className={adminTab === "overview" ? "active" : ""} onClick={() => setAdminTab("overview")}><LayoutDashboard size={18} /> Overview</button>
              <button type="button" className={adminTab === "requests" ? "active" : ""} onClick={() => setAdminTab("requests")}><Inbox size={18} /> Requests {newRequests > 0 && <span>{newRequests}</span>}</button>
              <button type="button" className={adminTab === "images" ? "active" : ""} onClick={() => setAdminTab("images")}><ImageIcon size={18} /> Site images</button>
            </nav>
            <div className="admin-sidebar-bottom"><p>Changes and form requests are saved on this device only.</p><button type="button" onClick={() => setAdminOpen(false)}><ArrowUpRight size={18} /> View website</button></div>
          </aside>
          <div className="admin-main">
            <div className="admin-topbar"><span>CEYLON P TOURS / ADMIN</span><button type="button" onClick={() => setAdminOpen(false)} aria-label="Close admin panel"><X size={20} /></button></div>
            <div className="admin-content">
              {adminTab === "overview" && <>
                <div className="admin-page-heading"><p>WELCOME BACK</p><h2>At a glance.</h2><span>This is a working local UI preview for your tour website.</span></div>
                <div className="admin-stats"><div><span>NEW REQUESTS</span><strong>{newRequests.toString().padStart(2, "0")}</strong><small>Waiting to be reviewed</small></div><div><span>ALL REQUESTS</span><strong>{requests.length.toString().padStart(2, "0")}</strong><small>Submitted on this device</small></div><div><span>CHANGED IMAGES</span><strong>{Object.keys(imageOverrides).length.toString().padStart(2, "0")}</strong><small>Of {imageSlots.length} editable images</small></div></div>
                <div className="admin-overview-bottom"><div><h3>Recent requests</h3>{requests.length ? requests.slice(0, 3).map((request) => <button type="button" className="admin-recent-request" key={request.id} onClick={() => { setSelectedRequestId(request.id); setAdminTab("requests"); }}><span><strong>{request.name}</strong><small>{request.country} / {request.arrivalDate}</small></span><ArrowUpRight size={17} /></button>) : <p className="admin-empty-small">No requests yet. Submit the quote form on the website to see one here.</p>}<button type="button" className="admin-inline-link" onClick={() => setAdminTab("requests")}>Open request inbox <ArrowRight size={16} /></button></div><div className="admin-setup-note"><span>UI PREVIEW</span><h3>Ready for your photos.</h3><p>Replace the sample destination, gallery, guide and vehicle imagery with your own photos. This demo stores changes in your browser.</p><button type="button" onClick={() => setAdminTab("images")}>Manage site images <ArrowUpRight size={17} /></button></div></div>
              </>}

              {adminTab === "requests" && <>
                <div className="admin-page-heading"><p>YOUR INBOX</p><h2>Quote requests.</h2><span>Requests from the on-site form appear here in this browser.</span></div>
                <div className="admin-info-banner"><MessageCircle size={19} /><span>Visitors must press Send in WhatsApp to deliver a message to {PHONE_DISPLAY}. This local inbox is a UI demo, not a shared server inbox.</span></div>
                {requests.length ? <div className="admin-requests-layout">
                  <div className="admin-request-list">{requests.map((request) => <button type="button" key={request.id} className={`admin-request-list-item ${selectedRequest?.id === request.id ? "selected" : ""}`} onClick={() => setSelectedRequestId(request.id)}><span className={`request-status-dot ${request.status === "New" ? "new" : ""}`} /><span><strong>{request.name}</strong><small>{request.country} / {request.arrivalDate}</small></span><time>{new Date(request.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</time></button>)}</div>
                  {selectedRequest && <div className="admin-request-detail"><div className="admin-request-detail-top"><span className={`request-status ${selectedRequest.status === "New" ? "new" : ""}`}>{selectedRequest.status}</span><span>{new Date(selectedRequest.createdAt).toLocaleString()}</span></div><h3>{selectedRequest.name}</h3><p className="admin-request-origin">Travelling from {selectedRequest.country}</p><div className="admin-request-facts"><div><CalendarDays size={17} /><span>Arrival date</span><strong>{selectedRequest.arrivalDate}</strong></div><div><UsersRound size={17} /><span>Travellers</span><strong>{selectedRequest.travellers}</strong></div></div><div className="admin-request-copy"><span>PLACES OF INTEREST</span><p>{selectedRequest.places.length ? selectedRequest.places.join(", ") : "Open to suggestions"}</p></div><div className="admin-request-copy"><span>TRIP IDEAS</span><p>{selectedRequest.details}</p></div><div className="admin-request-actions"><button type="button" onClick={() => markRequest(selectedRequest.id)}><Check size={16} /> {selectedRequest.status === "New" ? "Mark as replied" : "Mark as new"}</button><button type="button" onClick={() => void copyRequest(selectedRequest)}><Copy size={16} /> Copy brief</button><button type="button" className="admin-delete" onClick={() => deleteRequest(selectedRequest.id)} aria-label="Delete request"><Trash2 size={17} /></button></div></div>}
                </div> : <div className="admin-empty"><Inbox size={34} strokeWidth={1.3} /><h3>No requests just yet.</h3><p>When a visitor fills out the quote form, their details will appear here on this device.</p><button type="button" onClick={() => setAdminOpen(false)}>View quote form <ExternalLink size={16} /></button></div>}
              </>}

              {adminTab === "images" && <>
                <div className="admin-page-heading"><p>VISUAL CONTENT</p><h2>Site images.</h2><span>Replace any hero, destination, story, gallery or vehicle photo.</span></div>
                <div className="admin-info-banner"><Upload size={19} /><span>Upload a photo or paste an image URL. Changes save in this browser and update the website immediately.</span></div>
                <div className="admin-image-groups">{imageGroups.map((group) => <button type="button" key={group} onClick={() => setImageGroup(group)} className={imageGroup === group ? "active" : ""}>{group} <span>{imageSlots.filter((slot) => slot.group === group).length}</span></button>)}</div>
                <div className="admin-image-list">{imageSlots.filter((slot) => slot.group === imageGroup).map((slot) => <div className="admin-image-row" key={slot.key}><img src={getImage(slot.key)} alt={`${slot.label} preview`} /><div className="admin-image-row-body"><div className="admin-image-title"><strong>{slot.label}</strong>{imageOverrides[slot.key] && <span>CHANGED</span>}</div><div className="admin-image-controls"><input type="url" aria-label={`Image URL for ${slot.label}`} placeholder="Paste an image URL" value={draftImageUrls[slot.key] || ""} onChange={(event) => setDraftImageUrls((current) => ({ ...current, [slot.key]: event.target.value }))} onKeyDown={(event) => { if (event.key === "Enter") saveImageUrl(slot.key); }} /><button type="button" onClick={() => saveImageUrl(slot.key)} disabled={!draftImageUrls[slot.key]?.trim()}>Save URL</button><label className="admin-upload-button"><Upload size={15} /> {uploadingKey === slot.key ? "Uploading" : "Upload"}<input type="file" accept="image/*" onChange={(event) => { void uploadImage(slot.key, event.target.files?.[0]); event.target.value = ""; }} /></label>{imageOverrides[slot.key] && <button type="button" className="admin-reset-button" onClick={() => { updateImage(slot.key); setAdminNotice("Original sample image restored."); }} title="Restore original image" aria-label={`Restore original ${slot.label} image`}><RotateCcw size={17} /></button>}</div></div></div>)}</div>
              </>}
            </div>
            {adminNotice && <div className="admin-notice" role="status"><CheckCircle2 size={17} /> {adminNotice}<button type="button" onClick={() => setAdminNotice("")} aria-label="Dismiss message"><X size={15} /></button></div>}
          </div>
        </motion.div>}
      </AnimatePresence>
    </>
  );
}