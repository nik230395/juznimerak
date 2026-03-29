import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) throw new Error("TURSO_DATABASE_URL is not set");

const adapter = new PrismaLibSql({ url, authToken });
const prisma = new PrismaClient({ adapter });

const MENU = [
  { category: "Roštilj", name: "Mešano meso",               subtitle: "Grill Mix für 1 Person",       price: "10,90 €",           sortOrder: 1 },
  { category: "Roštilj", name: "Pljeskavica",                subtitle: "Fleischlaibchen",               price: "6,90 €",            sortOrder: 2 },
  { category: "Roštilj", name: "Punjena pljeskavica",        subtitle: "Gefüllte Fleischlaibchen",      price: "11,90 €",           allergens: "D", sortOrder: 3 },
  { category: "Roštilj", name: "Ćevapi 200 / 400 g",                                                    price: "6,90 / 10,90 €",    sortOrder: 4 },
  { category: "Roštilj", name: "Svinjski vrat 200 / 400 g",  subtitle: "Schweinssteaks",                price: "6,90 / 10,90 €",    sortOrder: 5 },
  { category: "Roštilj", name: "Paštica 200 / 400 g",        subtitle: "Bauchfleisch",                  price: "6,90 / 10,90 €",    sortOrder: 6 },
  { category: "Roštilj", name: "Batk 200 / 400 g",           subtitle: "Hühnenbein",                    price: "6,90 / 10,90 €",    sortOrder: 7 },
  { category: "Roštilj", name: "Kobasice 200 / 400 g",       subtitle: "Grillwürstel",                  price: "6,90 / 10,90 €",    sortOrder: 8 },
  { category: "Roštilj", name: "Punjena piletina",           subtitle: "Gefüllte Hühnerbrust",          price: "13,00 €",           sortOrder: 9 },
  { category: "Roštilj", name: "Punjena vešalica 400 g",     subtitle: "Gefüllte Karre",                price: "13,90 €",           allergens: "G", sortOrder: 10 },
  { category: "Roštilj", name: "Bela vešalica 200 / 400 g",  subtitle: "Weißes Karee",                  price: "6,90 / 10,90 €",    sortOrder: 11 },
  { category: "Roštilj", name: "Dinklave vešalica",          subtitle: "Gänsebraten Karree",            price: "11,00 €",           sortOrder: 12 },
  { category: "Roštilj", name: "Svinjski kotopić",           subtitle: "Grillgeflügel vom Schwein",     price: "6,90 / 10,90 €",    sortOrder: 13 },

  { category: "Specijaliteti", name: "Karađorđeva šnicla",    subtitle: "Karađorđeva Schnitzel",        price: "14,90 €", allergens: "A,C,G", sortOrder: 1 },
  { category: "Specijaliteti", name: "Bečka šnicla",          subtitle: "Wiener Schnitzel",             price: "12,90 €",            sortOrder: 2 },
  { category: "Specijaliteti", name: "Rostfleisch",                                                      price: "14,90 €",            sortOrder: 3 },
  { category: "Specijaliteti", name: "Pečena piletina",       subtitle: "Hühnerbraten",                 price: "15,90 €", allergens: "G",     sortOrder: 4 },
  { category: "Specijaliteti", name: "Meso ispod sača za 2",  subtitle: "Für 2 Personen",               price: "19,90 €",            sortOrder: 5 },
  { category: "Specijaliteti", name: "Punjene paprike sa sirom", subtitle: "Gefüllte Paprika mit Käse", price: "8,90 €",  allergens: "A,C,G", sortOrder: 6 },

  { category: "Salate", name: "Šmarski mix",       subtitle: "für 4 Personen",    price: "13,90 €", allergens: "G", sortOrder: 1 },
  { category: "Salate", name: "Šopska salata",      subtitle: "Šopska-Salat",      price: "4,50 €",  allergens: "G", sortOrder: 2 },
  { category: "Salate", name: "Dakovska salata",    subtitle: "Dakischer Salat",   price: "4,50 €",                  sortOrder: 3 },
  { category: "Salate", name: "Paradajz salata",    subtitle: "Tomatensalat",      price: "4,50 €",                  sortOrder: 4 },
  { category: "Salate", name: "Krastavac salata",   subtitle: "Gurkensalat",       price: "4,50 €",                  sortOrder: 5 },
  { category: "Salate", name: "Kupus salata",       subtitle: "Krautsalat",        price: "4,50 €",                  sortOrder: 6 },
  { category: "Salate", name: "Kiseli kupus",       subtitle: "Sauerkraut",        price: "4,50 €",                  sortOrder: 7 },
  { category: "Salate", name: "Mešana salata",      subtitle: "Gemischter Salat",  price: "4,50 €",                  sortOrder: 8 },
  { category: "Salate", name: "Krompir salata",     subtitle: "Kartoffelsalat",    price: "3,90 €",                  sortOrder: 9 },
  { category: "Salate", name: "Kajmak",             subtitle: "Käsmus",            price: "1,90 €",  allergens: "G", sortOrder: 10 },
  { category: "Salate", name: "Ajvar",                                              price: "1,90 €",                  sortOrder: 11 },
  { category: "Salate", name: "Džadzike",                                           price: "1,90 €",  allergens: "G", sortOrder: 12 },

  { category: "Kuhinja", name: "Pileća ili Rind Čorba", subtitle: "Hühner- oder Rindssuppe", price: "4,90 €", allergens: "A", sortOrder: 1 },
  { category: "Kuhinja", name: "Pasulj",                subtitle: "Bohnensuppe",              price: "6,90 €", allergens: "A", sortOrder: 2 },
  { category: "Kuhinja", name: "Sarma 1 kom.",          subtitle: "Krautroulade",             price: "2,00 €", allergens: "A", sortOrder: 3 },
  { category: "Kuhinja", name: "Rindfleisch",                                                  price: "7,90 €", allergens: "A", sortOrder: 4 },
  { category: "Kuhinja", name: "Sarma sa prilogom",     subtitle: "Krautroulade mit Beilage", price: "6,90 €", allergens: "G", sortOrder: 5 },

  { category: "Riba", name: "Pastrmka",     subtitle: "Forelle",            price: "13,90 €", allergens: "D", sortOrder: 1 },
  { category: "Riba", name: "File Pangasius", subtitle: "Fischfilet Pangasius", price: "13,90 €", allergens: "D", sortOrder: 2 },

  { category: "Prilog", name: "Lepinja",  subtitle: "Fladenbrot",  price: "1,50 €", allergens: "A", sortOrder: 1 },
  { category: "Prilog", name: "Pomfrit",  subtitle: "Pommes",      price: "2,90 €",                 sortOrder: 2 },
  { category: "Prilog", name: "Ketchup",                            price: "1,00 €", allergens: "M", sortOrder: 3 },
  { category: "Prilog", name: "Majonez",  subtitle: "Mayonnaise",  price: "1,00 €", allergens: "C,G,M", sortOrder: 4 },
  { category: "Prilog", name: "Senf",                               price: "1,00 €", allergens: "M", sortOrder: 5 },

  { category: "Desert", name: "Palačinke 2 kom.", subtitle: "Palatschinken", price: "4,50 €", allergens: "A,C,G", sortOrder: 1 },
  { category: "Desert", name: "Baklava 2 kom.",                               price: "4,50 €", allergens: "A,H",   sortOrder: 2 },
];

async function main() {
  console.log("Seeding database...");

  // Clear existing menu items
  await prisma.menuItem.deleteMany();

  // Insert menu items
  for (const item of MENU) {
    await prisma.menuItem.create({ data: { ...item, available: true } });
  }
  console.log(`Inserted ${MENU.length} menu items.`);

  // Create admin user if doesn't exist
  const existing = await prisma.admin.findUnique({ where: { username: "admin" } });
  if (!existing) {
    const passwordHash = await bcrypt.hash("JuzniMerak123!", 12);
    await prisma.admin.create({ data: { username: "admin", passwordHash } });
    console.log("Admin created: username=admin  password=JuzniMerak123!");
  } else {
    console.log("Admin already exists.");
  }

  console.log("Done!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
