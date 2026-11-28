/* Medical Terminology â€“ offline support.
   core: the app itself (refreshed when a new version is published)
   media: slides, thumbnails and audio (kept across versions) */
const VER = "v1237-restore";
const CORE = "mt-core-" + VER, MEDIA = "mt-media-stable";
const CORE_FILES = ["./", "index.html", "data.js", "lecq.js", "facts.js", "narr.js", "narr_ar.js", "modules.js", 
  "app_logo.svg", "manifest.webmanifest", "files.json", "icons/icon-192.png", "icons/icon-512.png",
  "icons/apple-touch-icon.png", "icons/icon-maskable-512.png", "fonts/atkinson-hyperlegible-latin-400-italic.woff2", "fonts/atkinson-hyperlegible-latin-400-normal.woff2", "fonts/atkinson-hyperlegible-latin-700-normal.woff2", "fonts/bricolage-grotesque-latin-400-normal.woff2", "fonts/bricolage-grotesque-latin-700-normal.woff2", "fonts/bricolage-grotesque-latin-800-normal.woff2", "fonts/cairo-arabic-400-normal.woff2", "fonts/cairo-arabic-600-normal.woff2", "fonts/cairo-arabic-700-normal.woff2", "fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2", "fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2", "fonts/ibm-plex-sans-latin-400-normal.woff2", "fonts/ibm-plex-sans-latin-500-normal.woff2", "fonts/ibm-plex-sans-latin-600-normal.woff2", "fonts/ibm-plex-sans-latin-700-normal.woff2", "fonts/montserrat-latin-400-normal.woff2", "fonts/montserrat-latin-600-normal.woff2", "fonts/montserrat-latin-800-normal.woff2"];
const isMedia = p => /^(slides|thumbs|audio|narr|narr_f)\//.test(p);

/* v1.2.9: a redirected response (e.g. /index.html -> /) cannot answer a page navigation (ERR_FAILED), so rebuild it as a plain response. */
async function clean(res){
  if(!res || !res.redirected) return res;
  return new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers: res.headers });
}
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CORE).then(async c => {
    for(const f of CORE_FILES){
      const r = await fetch(new Request(f, { cache: "reload" }));
      if(!r.ok) throw new Error("fetch failed " + f);
      await c.put(new Request(f), await clean(r));
    }
  }).then(() => self.skipWaiting()));
});
/* v1.2.23: the saved lectures (about 230 MB) are kept across app updates. Only the files that changed are replaced.
   PURGE: [level, [paths]]. A client removes the paths of every level it has not applied yet, then downloads them again when needed. */
const PURGE = [[1, ["narr/L3_25.mp3","narr/L4_08.mp3","narr/L4_20.mp3","narr/L4_21.mp3","narr/L4_21.ogg","narr/L4_22.mp3","narr/L4_22.ogg","narr/L4_23.mp3","narr/L4_23.ogg","narr/L4_24.mp3","narr/L4_24.ogg","narr/L4_25.mp3","narr/L4_25.ogg","narr/L4_26.ogg","narr/L4_27.mp3","narr/L4_27.ogg","narr/L4_28.mp3","narr/L4_28.ogg","narr/L4_29.mp3","narr/L4_29.ogg","narr/L4_30.mp3","narr/L4_30.ogg","narr/L4_31.ogg","narr/L4_32.mp3","narr/L4_32.ogg","narr/L4_33.mp3","narr/L4_33.ogg","narr/L4_34.mp3","narr/L4_34.ogg","narr/L4_35.mp3","narr/L4_35.ogg","narr/L4_36.ogg","narr/L4_37.ogg","narr/L4_38.ogg","narr/L4_39.ogg","narr/L4_40.ogg","narr/L4_41.ogg","narr/L4_42.ogg","narr/L4_43.ogg","narr/L4_44.ogg","narr/L4_45.ogg","narr_f/L3_25.mp3","narr_f/L4_08.mp3","narr_f/L4_20.mp3","narr_f/L4_21.mp3","narr_f/L4_21.ogg","narr_f/L4_22.mp3","narr_f/L4_22.ogg","narr_f/L4_23.mp3","narr_f/L4_23.ogg","narr_f/L4_24.mp3","narr_f/L4_24.ogg","narr_f/L4_25.mp3","narr_f/L4_25.ogg","narr_f/L4_26.ogg","narr_f/L4_27.mp3","narr_f/L4_27.ogg","narr_f/L4_28.mp3","narr_f/L4_28.ogg","narr_f/L4_29.mp3","narr_f/L4_29.ogg","narr_f/L4_30.mp3","narr_f/L4_30.ogg","narr_f/L4_31.ogg","narr_f/L4_32.mp3","narr_f/L4_32.ogg","narr_f/L4_33.mp3","narr_f/L4_33.ogg","narr_f/L4_34.mp3","narr_f/L4_34.ogg","narr_f/L4_35.mp3","narr_f/L4_35.ogg","narr_f/L4_36.ogg","narr_f/L4_37.ogg","narr_f/L4_38.ogg","narr_f/L4_39.ogg","narr_f/L4_40.ogg","narr_f/L4_41.ogg","narr_f/L4_42.ogg","narr_f/L4_43.ogg","narr_f/L4_44.ogg","narr_f/L4_45.ogg","slides/L3_25.webp","slides/L3_39.webp","slides/L3_41.webp","slides/L3_43.webp","slides/L3_44.webp","slides/L3_45.webp","slides/L3_46.webp","slides/L4_06.webp","slides/L4_08.webp","slides/L4_20.webp","slides/L4_21.webp","slides/L4_22.webp","slides/L4_23.webp","slides/L4_24.webp","slides/L4_25.webp","slides/L4_26.webp","slides/L4_27.webp","slides/L4_28.webp","slides/L4_29.webp","slides/L4_30.webp","slides/L4_31.webp","slides/L4_32.webp","slides/L4_33.webp","slides/L4_34.webp","slides/L4_35.webp","slides/L4_36.webp","slides/L4_37.webp","slides/L4_38.webp","slides/L4_39.webp","slides/L4_40.webp","slides/L4_41.webp","slides/L4_42.webp","slides/L4_43.webp","slides/L4_44.webp","slides/L4_45.webp","thumbs/L3_25.webp","thumbs/L3_39.webp","thumbs/L3_41.webp","thumbs/L3_43.webp","thumbs/L3_44.webp","thumbs/L3_45.webp","thumbs/L3_46.webp","thumbs/L4_06.webp","thumbs/L4_08.webp","thumbs/L4_20.webp","thumbs/L4_21.webp","thumbs/L4_22.webp","thumbs/L4_23.webp","thumbs/L4_24.webp","thumbs/L4_25.webp","thumbs/L4_26.webp","thumbs/L4_27.webp","thumbs/L4_28.webp","thumbs/L4_29.webp","thumbs/L4_30.webp","thumbs/L4_31.webp","thumbs/L4_32.webp","thumbs/L4_33.webp","thumbs/L4_34.webp","thumbs/L4_35.webp","thumbs/L4_36.webp","thumbs/L4_37.webp","thumbs/L4_38.webp","thumbs/L4_39.webp","thumbs/L4_40.webp","thumbs/L4_41.webp","thumbs/L4_42.webp","thumbs/L4_43.webp","thumbs/L4_44.webp","thumbs/L4_45.webp"]],[2, ["narr/L5_16.mp3","narr/L5_17.mp3","narr/L5_27.ogg","narr_f/L5_16.mp3","narr_f/L5_17.mp3","narr_f/L5_27.ogg","slides/L5_16.webp","slides/L5_17.webp","slides/L5_27.webp","slides/L5_30.webp","slides/L5_31.webp","slides/L5_35.webp","thumbs/L5_16.webp","thumbs/L5_17.webp","thumbs/L5_27.webp","thumbs/L5_30.webp","thumbs/L5_31.webp","thumbs/L5_35.webp"]],[3, ["narr/L6_08.ogg","narr/L6_09.ogg","narr/L6_16.mp3","narr/L6_28.ogg","narr_f/L6_08.ogg","narr_f/L6_09.ogg","narr_f/L6_16.mp3","narr_f/L6_28.ogg","slides/L6_08.webp","slides/L6_09.webp","slides/L6_16.webp","slides/L6_28.webp","slides/L6_31.webp","slides/L6_32.webp","slides/L6_36.webp","thumbs/L6_08.webp","thumbs/L6_09.webp","thumbs/L6_16.webp","thumbs/L6_28.webp","thumbs/L6_31.webp","thumbs/L6_32.webp","thumbs/L6_36.webp"]],[4, ["narr/L7_12.ogg","narr/L7_13.ogg","narr/L7_24.ogg","narr_f/L7_12.ogg","narr_f/L7_13.ogg","narr_f/L7_24.ogg","slides/L7_12.webp","slides/L7_13.webp","slides/L7_24.webp","slides/L7_27.webp","slides/L7_28.webp","thumbs/L7_12.webp","thumbs/L7_13.webp","thumbs/L7_24.webp","thumbs/L7_27.webp","thumbs/L7_28.webp"]],[5, ["narr/L8_07.ogg","narr/L8_10.mp3","narr/L8_11.ogg","narr/L8_23.mp3","narr_f/L8_07.ogg","narr_f/L8_10.mp3","narr_f/L8_11.ogg","narr_f/L8_23.mp3","slides/L8_07.webp","thumbs/L8_07.webp","slides/L8_10.webp","thumbs/L8_10.webp","slides/L8_11.webp","thumbs/L8_11.webp","slides/L8_23.webp","thumbs/L8_23.webp","slides/L8_25.webp","thumbs/L8_25.webp","slides/L8_26.webp","thumbs/L8_26.webp","slides/L8_27.webp","thumbs/L8_27.webp","slides/L8_29.webp","thumbs/L8_29.webp","slides/L8_30.webp","thumbs/L8_30.webp","slides/L8_31.webp","thumbs/L8_31.webp","slides/L8_32.webp","thumbs/L8_32.webp"]],[6, ["audio/t0772_ef.ogg","audio/t0772_em.ogg","audio/t0818_df.ogg","audio/t0818_ef.ogg","audio/t0818_em.ogg","audio/t1970_df.ogg","audio/t1970_ef.ogg","audio/t1970_em.ogg","audio/t1971_df.ogg","audio/t1971_ef.ogg","audio/t1971_em.ogg","audio/t1988_df.ogg","audio/t1988_ef.ogg","audio/t1988_em.ogg","audio/t1989_df.ogg","audio/t1989_ef.ogg","audio/t1989_em.ogg","audio/t1991_df.ogg","audio/t1991_ef.ogg","audio/t1991_em.ogg","audio/t1999_df.ogg","audio/t1999_ef.ogg","audio/t1999_em.ogg"]],[7, ["narr/L3_39.ogg","narr_f/L3_39.ogg","narr/L3_41.ogg","narr_f/L3_41.ogg","narr/L3_43.ogg","narr_f/L3_43.ogg","narr/L3_44.mp3","narr_f/L3_44.mp3","narr/L3_45.ogg","narr_f/L3_45.ogg","narr/L3_46.ogg","narr_f/L3_46.ogg","narr/L4_38.ogg","narr_f/L4_38.ogg","narr/L4_39.ogg","narr_f/L4_39.ogg","narr/L4_40.ogg","narr_f/L4_40.ogg","narr/L4_41.ogg","narr_f/L4_41.ogg","narr/L4_44.ogg","narr_f/L4_44.ogg","narr/L4_45.ogg","narr_f/L4_45.ogg","narr/L5_30.ogg","narr_f/L5_30.ogg","narr/L5_31.ogg","narr_f/L5_31.ogg","narr/L5_35.ogg","narr_f/L5_35.ogg","narr/L6_31.ogg","narr_f/L6_31.ogg","narr/L6_32.ogg","narr_f/L6_32.ogg","narr/L6_36.ogg","narr_f/L6_36.ogg","narr/L7_27.ogg","narr_f/L7_27.ogg","narr/L7_28.ogg","narr_f/L7_28.ogg","narr/L8_25.ogg","narr_f/L8_25.ogg","narr/L8_26.ogg","narr_f/L8_26.ogg","narr/L8_27.ogg","narr_f/L8_27.ogg","narr/L8_29.ogg","narr_f/L8_29.ogg","narr/L8_30.ogg","narr_f/L8_30.ogg","narr/L8_31.ogg","narr_f/L8_31.ogg","narr/L8_32.ogg","narr_f/L8_32.ogg","audio/t2005_df.ogg","audio/t2005_ef.ogg","audio/t2005_em.ogg","audio/t2006_df.ogg","audio/t2006_ef.ogg","audio/t2006_em.ogg","audio/t2007_df.ogg","audio/t2007_ef.ogg","audio/t2007_em.ogg","audio/t2008_df.ogg","audio/t2008_ef.ogg","audio/t2008_em.ogg","audio/t2009_df.ogg","audio/t2009_ef.ogg","audio/t2009_em.ogg","audio/t2010_df.ogg","audio/t2010_ef.ogg","audio/t2010_em.ogg"]],[8, ["audio/t0111_df.ogg","audio/t0152_df.ogg","audio/t0364_df.ogg","audio/t0397_df.ogg","audio/t0406_df.ogg","audio/t0482_df.ogg","audio/t0522_df.ogg","audio/t0586_df.ogg","audio/t0631_df.ogg","audio/t0719_df.ogg","audio/t0738_df.ogg","audio/t0834_df.ogg","audio/t0908_df.ogg","audio/t0921_df.ogg","audio/t0928_df.ogg","audio/t1019_df.ogg","audio/t1122_df.ogg","audio/t1222_df.ogg","audio/t1223_df.ogg","audio/t1224_df.ogg","audio/t1246_df.ogg","audio/t1337_df.ogg","audio/t1372_df.ogg","audio/t1387_df.ogg","audio/t1388_df.ogg","audio/t1411_df.ogg","audio/t1433_df.ogg","audio/t1459_df.ogg","audio/t1463_df.ogg","audio/t1474_df.ogg","audio/t1485_df.ogg","audio/t1543_df.ogg","audio/t1553_df.ogg","audio/t1675_df.ogg","audio/t1677_df.ogg","audio/t1712_df.ogg","audio/t1730_df.ogg","audio/t1734_df.ogg","audio/t1740_df.ogg","audio/t1751_df.ogg","audio/t1778_df.ogg","audio/t1800_df.ogg","audio/t1842_df.ogg","audio/t1868_df.ogg","audio/t1954_df.ogg","audio/t1969_df.ogg","audio/t1969_ef.ogg","audio/t1969_em.ogg","audio/t1972_df.ogg","audio/t1972_ef.ogg","audio/t1972_em.ogg","audio/t1973_df.ogg","audio/t1973_ef.ogg","audio/t1973_em.ogg","audio/t1974_df.ogg","audio/t1974_ef.ogg","audio/t1974_em.ogg","audio/t1975_df.ogg","audio/t1975_ef.ogg","audio/t1975_em.ogg","audio/t1976_df.ogg","audio/t1976_ef.ogg","audio/t1976_em.ogg","audio/t1977_df.ogg","audio/t1977_ef.ogg","audio/t1977_em.ogg","audio/t1978_df.ogg","audio/t1978_ef.ogg","audio/t1978_em.ogg","audio/t1979_df.ogg","audio/t1979_ef.ogg","audio/t1979_em.ogg","audio/t1980_df.ogg","audio/t1980_ef.ogg","audio/t1980_em.ogg","audio/t1981_df.ogg","audio/t1981_ef.ogg","audio/t1981_em.ogg","audio/t1982_df.ogg","audio/t1982_ef.ogg","audio/t1982_em.ogg","audio/t1983_df.ogg","audio/t1983_ef.ogg","audio/t1983_em.ogg","audio/t1984_df.ogg","audio/t1984_ef.ogg","audio/t1984_em.ogg","audio/t1985_df.ogg","audio/t1985_ef.ogg","audio/t1985_em.ogg","audio/t1986_df.ogg","audio/t1986_ef.ogg","audio/t1986_em.ogg","audio/t1987_df.ogg","audio/t1987_ef.ogg","audio/t1987_em.ogg","audio/t1990_df.ogg","audio/t1990_ef.ogg","audio/t1990_em.ogg","audio/t1992_df.ogg","audio/t1992_ef.ogg","audio/t1992_em.ogg","audio/t1993_df.ogg","audio/t1993_ef.ogg","audio/t1993_em.ogg","audio/t1994_df.ogg","audio/t1994_ef.ogg","audio/t1994_em.ogg","audio/t1995_df.ogg","audio/t1995_ef.ogg","audio/t1995_em.ogg","audio/t1996_df.ogg","audio/t1996_ef.ogg","audio/t1996_em.ogg","audio/t1997_df.ogg","audio/t1997_ef.ogg","audio/t1997_em.ogg","audio/t1998_df.ogg","audio/t1998_ef.ogg","audio/t1998_em.ogg","audio/t2000_df.ogg","audio/t2000_ef.ogg","audio/t2000_em.ogg","audio/t2001_df.ogg","audio/t2001_ef.ogg","audio/t2001_em.ogg","audio/t2002_df.ogg","audio/t2002_ef.ogg","audio/t2002_em.ogg","audio/t2003_df.ogg","audio/t2003_ef.ogg","audio/t2003_em.ogg","audio/t2004_df.ogg","audio/t2004_ef.ogg","audio/t2004_em.ogg"]],[9, ["audio/t2011_df.ogg","audio/t2011_ef.ogg","audio/t2011_em.ogg","audio/t2012_df.ogg","audio/t2012_ef.ogg","audio/t2012_em.ogg","audio/t2013_df.ogg","audio/t2013_ef.ogg","audio/t2013_em.ogg","audio/t2014_df.ogg","audio/t2014_ef.ogg","audio/t2014_em.ogg","audio/t2015_df.ogg","audio/t2015_em.ogg","audio/t2016_df.ogg","audio/t2016_ef.ogg","audio/t2016_em.ogg","audio/t2017_df.ogg","audio/t2017_ef.ogg","audio/t2017_em.ogg","audio/t2018_df.ogg","audio/t2018_ef.ogg","audio/t2018_em.ogg","audio/t2019_df.ogg","audio/t2019_ef.ogg","audio/t2019_em.ogg","audio/t2020_df.ogg","audio/t2020_ef.ogg","audio/t2021_df.ogg","audio/t2021_ef.ogg","audio/t2021_em.ogg","audio/t2022_df.ogg","audio/t2022_ef.ogg","audio/t2022_em.ogg","audio/t2023_df.ogg","audio/t2023_ef.ogg","audio/t2023_em.ogg","audio/t2024_df.ogg","audio/t2024_ef.ogg","audio/t2024_em.ogg","audio/t2025_df.ogg","audio/t2025_ef.ogg","audio/t2025_em.ogg","audio/t2026_df.ogg","audio/t2026_ef.ogg","audio/t2026_em.ogg","audio/t2027_df.ogg","audio/t2027_ef.ogg","audio/t2027_em.ogg","audio/t2028_df.ogg","audio/t2028_ef.ogg","audio/t2028_em.ogg","audio/t2029_df.ogg","audio/t2029_ef.ogg","audio/t2029_em.ogg","audio/t2030_df.ogg","audio/t2030_ef.ogg","audio/t2030_em.ogg","audio/t2031_df.ogg","audio/t2031_ef.ogg","audio/t2031_em.ogg","audio/t2032_df.ogg","audio/t2032_ef.ogg","audio/t2032_em.ogg","audio/t2033_df.ogg","audio/t2033_ef.ogg","audio/t2033_em.ogg","audio/t2034_df.ogg","audio/t2034_ef.ogg","audio/t2034_em.ogg","audio/t2035_df.ogg","audio/t2035_ef.ogg","audio/t2035_em.ogg","audio/t2036_df.ogg","audio/t2036_ef.ogg","audio/t2036_em.ogg","audio/t2037_df.ogg","audio/t2037_ef.ogg","audio/t2037_em.ogg","audio/t2038_df.ogg","audio/t2038_ef.ogg","audio/t2038_em.ogg","audio/t2039_df.ogg","audio/t2039_ef.ogg","audio/t2039_em.ogg","audio/t2040_df.ogg","audio/t2040_ef.ogg","audio/t2040_em.ogg","audio/t2041_df.ogg","audio/t2041_ef.ogg","audio/t2041_em.ogg","audio/t2042_df.ogg","audio/t2042_em.ogg","audio/t2043_df.ogg","audio/t2043_ef.ogg","audio/t2043_em.ogg","audio/t2044_df.ogg","audio/t2044_ef.ogg","audio/t2044_em.ogg","audio/t2045_df.ogg","audio/t2045_ef.ogg","audio/t2045_em.ogg","audio/t2046_df.ogg","audio/t2046_ef.ogg","audio/t2046_em.ogg","audio/t2047_df.ogg","audio/t2047_ef.ogg","audio/t2047_em.ogg","audio/t2048_df.ogg","audio/t2048_ef.ogg","audio/t2048_em.ogg","audio/t2049_df.ogg","audio/t2049_ef.ogg","audio/t2049_em.ogg","audio/t2050_df.ogg","audio/t2050_ef.ogg","audio/t2050_em.ogg","audio/t2051_df.ogg","audio/t2051_ef.ogg","audio/t2051_em.ogg","audio/t2052_df.ogg","audio/t2052_ef.ogg","audio/t2052_em.ogg","audio/t2053_df.ogg","audio/t2053_ef.ogg","audio/t2053_em.ogg","audio/t2054_df.ogg","audio/t2054_ef.ogg","audio/t2054_em.ogg","audio/t2055_df.ogg","audio/t2055_ef.ogg","audio/t2055_em.ogg","audio/t2056_df.ogg","audio/t2056_ef.ogg","audio/t2056_em.ogg","audio/t2057_df.ogg","audio/t2057_ef.ogg","audio/t2057_em.ogg"]],[10, ["audio/t2006_ef.ogg","audio/t2006_em.ogg","audio/t2007_ef.ogg","audio/t2007_em.ogg","audio/t2033_ef.ogg","audio/t2033_em.ogg","audio/t2034_ef.ogg","audio/t2034_em.ogg","audio/t2035_ef.ogg","audio/t2035_em.ogg","audio/t2036_ef.ogg","audio/t2036_em.ogg","audio/t2037_ef.ogg","audio/t2037_em.ogg","audio/t2038_ef.ogg","audio/t2038_em.ogg","audio/t2039_ef.ogg","audio/t2039_em.ogg","audio/t2040_ef.ogg","audio/t2040_em.ogg","audio/t2041_ef.ogg","audio/t2041_em.ogg","audio/t2042_ef.ogg","audio/t2042_em.ogg","audio/t2043_ef.ogg","audio/t2043_em.ogg","audio/t2044_ef.ogg","audio/t2044_em.ogg","audio/t2045_ef.ogg","audio/t2045_em.ogg","audio/t2046_ef.ogg","audio/t2046_em.ogg","audio/t2047_ef.ogg","audio/t2047_em.ogg","audio/t2048_ef.ogg","audio/t2048_em.ogg","audio/t2049_ef.ogg","audio/t2049_em.ogg","audio/t2050_ef.ogg","audio/t2050_em.ogg","audio/t2051_ef.ogg","audio/t2051_em.ogg","audio/t2052_ef.ogg","audio/t2052_em.ogg","audio/t2053_ef.ogg","audio/t2053_em.ogg","audio/t2054_ef.ogg","audio/t2054_em.ogg","audio/t2055_ef.ogg","audio/t2055_em.ogg","audio/t2056_ef.ogg","audio/t2056_em.ogg","audio/t2057_ef.ogg","audio/t2057_em.ogg"]],[11, ["audio/t2006_ef.ogg","audio/t2006_em.ogg","audio/t2007_ef.ogg","audio/t2007_em.ogg","audio/t2008_ef.ogg","audio/t2008_em.ogg","audio/t2046_ef.ogg","audio/t2046_em.ogg","audio/t2047_ef.ogg","audio/t2047_em.ogg"]],[12, ["audio/t2006_ef.ogg","audio/t2006_em.ogg","audio/t2007_ef.ogg","audio/t2007_em.ogg","audio/t2008_ef.ogg","audio/t2008_em.ogg","audio/t2046_ef.ogg","audio/t2046_em.ogg","audio/t2047_ef.ogg","audio/t2047_em.ogg"]]];
async function readLevel(meta){ const r = await meta.match("level"); return r ? (parseInt(await r.text(), 10) || 0) : 0; }
async function mediaUpkeep(){
  const base = new URL(self.registration.scope).pathname;
  const rel = req => decodeURIComponent(new URL(req.url).pathname.slice(base.length));
  const meta = await caches.open("mt-meta");
  const level = await readLevel(meta);
  const ks = await caches.keys();
  const dst = await caches.open(MEDIA);
  const stale = new Set();
  for(const [lv, paths] of PURGE) if(lv > level) paths.forEach(p => stale.add(p));
  // 1) bring over saved media from the per-version caches of v1.2.18 .. v1.2.22 (never the files that changed since)
  for(const k of ks.filter(k => /^mt-media-v12(1[89]|2\d)-/.test(k) && k !== MEDIA)){
    const src = await caches.open(k);
    for(const req of await src.keys()){
      if(stale.has(rel(req))) continue;
      if(await dst.match(req)) continue;
      const res = await src.match(req);
      if(res) await dst.put(req, res);
    }
  }
  // 2) remove the changed files from the stable cache
  for(const req of await dst.keys()) if(stale.has(rel(req))) await dst.delete(req);
  await meta.put("level", new Response(String(Math.max(level, ...PURGE.map(p => p[0])))));
}
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    try{ await mediaUpkeep(); }catch(err){}
    const ks = await caches.keys();
    await Promise.all(ks.filter(k => (k.startsWith("mt-core-") && k !== CORE) || (k.startsWith("mt-media-") && k !== MEDIA)).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
async function fromCacheOrNet(req, path){
  const media = isMedia(path);
  const key = new Request(new URL(path, self.registration.scope).href);
  const hit = await caches.match(key, { ignoreSearch: true });
  if(hit) return clean(hit);
  const res = await clean(await fetch(key));  // full file, never a range
  if(res.ok && res.status === 200){
    const c = await caches.open(media ? MEDIA : CORE);
    await c.put(key, res.clone());
  }
  return res;
}

// Safari asks for audio in byte ranges; answer them from the cached full file.
async function ranged(res, range){
  const buf = await res.arrayBuffer(), size = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(range || "");
  let a = m && m[1] ? +m[1] : 0, b = m && m[2] ? +m[2] : size - 1;
  if(m && !m[1] && m[2]){ a = Math.max(0, size - +m[2]); b = size - 1; }
  b = Math.min(b, size - 1);
  if(!m || a >= size || b < a || a < 0) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  return new Response(buf.slice(a, b + 1), { status: 206, statusText: "Partial Content", headers: {
    "Content-Type": res.headers.get("Content-Type") || "audio/mpeg",
    "Content-Range": `bytes ${a}-${b}/${size}`, "Content-Length": String(b - a + 1), "Accept-Ranges": "bytes" } });
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url), scope = new URL(self.registration.scope);
  if(url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  let path = decodeURIComponent(url.pathname.slice(scope.pathname.length)) || "index.html";
  if(req.mode === "navigate") path = "index.html";
  e.respondWith((async () => {
    try{
      const res = await fromCacheOrNet(req, path);
      const range = req.headers.get("range");
      if(range && res.status === 200) return ranged(res, range);
      return res;
    }catch(err){
      const fall = await caches.match(new URL("index.html", self.registration.scope).href);
      if(req.mode === "navigate" && fall) return fall;
      return new Response("Offline and not saved yet", { status: 503 });
    }
  })());
});
