import heroImage from "./assets/ceylon-hero.jpg?inline";
import carImage from "./assets/ceylon-car.jpg?inline";
import vanImage from "./assets/ceylon-van.jpg?inline";
import coachImage from "./assets/ceylon-coach.jpg?inline";

export const PHONE_DISPLAY = "+94 71 299 8788";
export const PHONE_NUMBER = "94712998788";
export const EMAIL = "ceylonptours@gmail.com";
export const REQUESTS_KEY = "ceylon-p-tours-quote-requests-v1";
const IMAGE_FALLBACK_KEY = "ceylon-p-tours-image-overrides-v1";

export function pexels(id: number, width = 1100, height = 850, ext = "jpeg") {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}?auto=compress&cs=tinysrgb&fit=crop&w=${width}&h=${height}`;
}

export function whatsapp(message?: string) {
  return `https://wa.me/${PHONE_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export type Destination = {
  name: string;
  category: string;
  description: string;
  places: string[];
  imageId: number;
};

export const destinations: Destination[] = [
  { name: "Kandy", category: "Last royal capital", description: "Sacred temples, the lake and the hilltop Buddha", places: ["Temple of the Tooth", "Kandy Lake", "Big Buddha"], imageId: 40442107 },
  { name: "Sigiriya", category: "Lion Rock", description: "The rock fortress, the climb next door and the gardens below", places: ["Sigiriya Rock", "Pidurangala", "Water Gardens"], imageId: 19574565 },
  { name: "Dambulla", category: "Cave temples", description: "Golden caves, the giant Buddha and an ancient burial ground", places: ["Cave Temple", "Golden Temple", "Ibbankatuwa"], imageId: 32547985 },
  { name: "Nuwara Eliya", category: "Tea country", description: "Tea hills, a highland lake and the walk to World's End", places: ["Tea Estates", "Gregory Lake", "Horton Plains"], imageId: 36847090 },
  { name: "Ella", category: "Hill country", description: "The blue train, the bridge and two classic hill walks", places: ["Nine Arches", "Little Adam's Peak", "Ella Rock"], imageId: 4769075 },
  { name: "Yala", category: "National park", description: "Leopards, elephants and a rock temple on the park edge", places: ["Leopard Safari", "Elephant Safari", "Sithulpawwa"], imageId: 10607669 },
  { name: "Galle", category: "Dutch fort", description: "Ramparts, the lighthouse and lanes inside the fort", places: ["Galle Fort", "Lighthouse", "Ramparts"], imageId: 11116033 },
  { name: "Mirissa", category: "South coast", description: "Whales offshore, palms on the hill and a swimming beach", places: ["Whale Watching", "Coconut Tree Hill", "Beach"], imageId: 32574422 },
  { name: "Colombo", category: "Capital city", description: "The oceanfront, the tower and the city's best-known temple", places: ["Galle Face", "Lotus Tower", "Gangaramaya"], imageId: 33511789 },
  { name: "Anuradhapura", category: "Ancient kingdom", description: "The sacred bodhi, the great dagoba and the first capital", places: ["Sri Maha Bodhi", "Ruwanwelisaya", "Ancient City"], imageId: 37091540 },
  { name: "Polonnaruwa", category: "Medieval capital", description: "Stone Buddhas, the palace and a compact ruined city", places: ["Gal Vihara", "Royal Palace", "Ancient City"], imageId: 12584869 },
  { name: "Trincomalee", category: "East coast", description: "A cliff temple, a long beach and a snorkel island", places: ["Koneswaram", "Nilaveli", "Pigeon Island"], imageId: 10850861 },
  { name: "Arugam Bay", category: "Surf coast", description: "The point break, Elephant Rock and a quiet village beyond", places: ["Surfing", "Elephant Rock", "Panama"], imageId: 32398175 },
  { name: "Jaffna", category: "Northern peninsula", description: "The fort, Nallur temple and the ferry to Delft", places: ["Jaffna Fort", "Nallur", "Delft Island"], imageId: 39486288 },
  { name: "Udawalawe", category: "Elephant country", description: "Open-park elephants, the reservoir and a classic safari", places: ["Elephant Safari", "National Park", "Reservoir"], imageId: 8126089 },
];

export const benefits = [
  { title: "Your own private journey", text: "Travel as a couple, family or friends. No large groups." },
  { title: "Your own vehicle", text: "Comfortable air-conditioned transport for the full trip." },
  { title: "Licensed local knowledge", text: "A national guide who knows viewpoints, timing and stories." },
  { title: "Flexible days", text: "Change a stop, linger longer, or start later. Your pace." },
  { title: "Airport to airport", text: "Colombo (CMB) pickup, hotel help and drop-off included in the plan." },
  { title: "No forced shopping", text: "No gem or spice stops you did not ask for." },
];

export const gallery = [
  { caption: "Safari day in the wild", imageId: 16444287 },
  { caption: "Sigiriya from above", imageId: 32547982 },
  { caption: "The walk to Nine Arches", imageId: 6140761 },
  { caption: "Surf on the south coast", imageId: 11266596 },
  { caption: "Temple of the Tooth, Kandy", imageId: 40442107 },
  { caption: "The hills around Ella", imageId: 36847102 },
  { caption: "A day beside the sea", imageId: 10850852 },
  { caption: "The blue train in Ella", imageId: 4769075 },
  { caption: "Elephants in the open", imageId: 38147402 },
  { caption: "Slow mornings on the coast", imageId: 18552403 },
];

export const vehicles = [
  { name: "Private Car", capacity: "1 to 3 guests", luggage: "2 large bags", bestFor: "Couples and solo travellers", imageKey: "vehicle-car" },
  { name: "Luxury Van", capacity: "4 to 9 guests", luggage: "Up to 8 bags", bestFor: "Families and friends", imageKey: "vehicle-van" },
  { name: "Mini Coach", capacity: "10 to 25 guests", luggage: "Large luggage space", bestFor: "Bigger groups", imageKey: "vehicle-coach" },
];

export const reviews = [
  { name: "Amy Leith", quote: "Excellent safe trip from Dambulla to Negambo. Made a special effort to find us clean bathrooms along the way - would highly recommend." },
  { name: "Frederik De Bleser", quote: "Pradeep was very nice and careful! Also lovely person to talk to. Would absolutely recommend!" },
  { name: "Michael Gilkes", quote: "Freddie was great. Very calm whilst driving on busy roads. Would definitely recommend." },
  { name: "Jiyoung Kim", quote: "Safe driving and friendly driver! Highly recommend." },
  { name: "David Quévreux", quote: "We spent three weeks with Pradeep. He was attentive, very friendly, and a good driver." },
  { name: "Andrea Bocca", quote: "The ride from Ella to the airport was very comfortable. The vehicle was spacious, clean, and perfectly suited for us and our luggage. Highly recommended!" },
];

export const faqs = [
  { question: "How do I book a private tour with Ceylon P Tours?", answer: "WhatsApp +94 71 299 8788 or use the form. Send dates, how many people, and the places you want. We reply with a private itinerary and a quote. Nothing is a group bus." },
  { question: "What is included?", answer: "Licensed driver-guide, private air-conditioned vehicle, Colombo (CMB) airport pickup and drop-off, and a flexible daily plan. Hotels and park tickets are quoted to match your budget." },
  { question: "When is the best time to visit Sri Lanka?", answer: "December to April for the south, west and hills. May to September for the east. Sigiriya, Dambulla and Anuradhapura work most of the year." },
  { question: "How much does a private tour cost?", answer: "Every trip is priced for your dates, vehicle and route. Send a short brief - we quote without obligation. No published group-tour price, because every journey is private." },
  { question: "Do you pick up from Colombo airport?", answer: "Yes. Most private tours start with pickup at Colombo Bandaranaike International Airport (CMB). We can also collect you from a Colombo or Negombo hotel." },
  { question: "Can you plan Sigiriya, Ella, Yala and Galle in one trip?", answer: "Yes. A typical private route from Kandy covers Sigiriya and Dambulla, Kandy, Nuwara Eliya, Ella, a Yala or Udawalawe safari, then Galle Fort and Mirissa on the south coast. We change days to match your time." },
];

export type ImageSlot = { key: string; label: string; group: string; defaultUrl: string };

export const imageSlots: ImageSlot[] = [
  { key: "hero", label: "Full-screen hero", group: "Hero", defaultUrl: heroImage },
  ...destinations.map((destination) => ({ key: `destination-${destination.name}`, label: destination.name, group: "Destinations", defaultUrl: pexels(destination.imageId, 1100, 850) })),
  { key: "about", label: "About the journey", group: "Our story", defaultUrl: pexels(36847090, 1100, 1400) },
  { key: "guide", label: "Guide feature", group: "Our story", defaultUrl: pexels(5931383, 1100, 1400) },
  ...gallery.map((item, index) => ({ key: `gallery-${index}`, label: item.caption, group: "Gallery", defaultUrl: pexels(item.imageId, 1000, 900) })),
  { key: "vehicle-car", label: "Private car", group: "Vehicles", defaultUrl: carImage },
  { key: "vehicle-van", label: "Luxury van", group: "Vehicles", defaultUrl: vanImage },
  { key: "vehicle-coach", label: "Mini coach", group: "Vehicles", defaultUrl: coachImage },
  { key: "vehicle-detail-1", label: "On the road", group: "Vehicles", defaultUrl: pexels(32398200, 750, 800) },
  { key: "vehicle-detail-2", label: "Comfort inside", group: "Vehicles", defaultUrl: pexels(39416591, 750, 800, "png") },
  { key: "vehicle-detail-3", label: "Mini coach showcase", group: "Vehicles", defaultUrl: coachImage },
  { key: "vehicle-detail-4", label: "Private car showcase", group: "Vehicles", defaultUrl: carImage },
];

export const imageDefaults = Object.fromEntries(imageSlots.map((slot) => [slot.key, slot.defaultUrl])) as Record<string, string>;
export const imageGroups = ["Hero", "Destinations", "Our story", "Gallery", "Vehicles"];

export type QuoteForm = { name: string; country: string; arrivalDate: string; travellers: string; details: string };
export type QuoteRequest = QuoteForm & { id: string; createdAt: string; places: string[]; status: "New" | "Replied" };
export type AdminTab = "overview" | "requests" | "images";

export function readRequests(): QuoteRequest[] {
  try {
    return JSON.parse(localStorage.getItem(REQUESTS_KEY) || "[]") as QuoteRequest[];
  } catch {
    return [];
  }
}

function openImageDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) return reject(new Error("IndexedDB unavailable"));
    const request = indexedDB.open("ceylon-p-tours-ui", 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains("settings")) request.result.createObjectStore("settings");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadImageOverrides(): Promise<Record<string, string>> {
  try {
    const db = await openImageDb();
    return await new Promise((resolve, reject) => {
      const request = db.transaction("settings", "readonly").objectStore("settings").get("images");
      request.onsuccess = () => resolve((request.result as Record<string, string>) || {});
      request.onerror = () => reject(request.error);
    });
  } catch {
    try {
      return JSON.parse(localStorage.getItem(IMAGE_FALLBACK_KEY) || "{}") as Record<string, string>;
    } catch {
      return {};
    }
  }
}

export async function storeImageOverrides(images: Record<string, string>) {
  try {
    const db = await openImageDb();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction("settings", "readwrite");
      transaction.objectStore("settings").put(images, "images");
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch {
    try {
      localStorage.setItem(IMAGE_FALLBACK_KEY, JSON.stringify(images));
    } catch {
      // Image previews still work for this session if browser storage is unavailable.
    }
  }
}

export function resizeUpload(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      const scale = Math.min(1, 1800 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Could not process the image"));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/webp", 0.82));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read this image"));
    };
    image.src = objectUrl;
  });
}