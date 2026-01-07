--
-- PostgreSQL database dump
--

\restrict d81skEb3zC8aBAeQ9DS04tOYYuxXcLwz5ddxnEKYDJZpzQOk16CbtYPcilUc8Ra

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-01-07 04:37:34

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 24685)
-- Name: items_order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items_order (
    id bigint NOT NULL,
    address character varying(255),
    created_at timestamp(6) without time zone,
    credit_card character varying(255),
    customer_name character varying(255),
    email character varying(255),
    status character varying(255),
    amount double precision
);


ALTER TABLE public.items_order OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24684)
-- Name: items_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_order_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_order_id_seq OWNER TO postgres;

--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 219
-- Name: items_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_order_id_seq OWNED BY public.items_order.id;


--
-- TOC entry 224 (class 1259 OID 24706)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id bigint NOT NULL,
    amount double precision NOT NULL,
    cardholder_name character varying(255),
    currency character varying(255),
    last4 character varying(4),
    order_id bigint NOT NULL,
    paid_at timestamp(6) without time zone,
    status character varying(255)
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24705)
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 223
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- TOC entry 222 (class 1259 OID 24695)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    description character varying(255),
    details text,
    featured boolean NOT NULL,
    image_url character varying(255),
    main_category character varying(255),
    name character varying(255),
    price double precision,
    sub_category character varying(255)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24694)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 221
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 4866 (class 2604 OID 24688)
-- Name: items_order id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_order ALTER COLUMN id SET DEFAULT nextval('public.items_order_id_seq'::regclass);


--
-- TOC entry 4868 (class 2604 OID 24709)
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- TOC entry 4867 (class 2604 OID 24698)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 5023 (class 0 OID 24685)
-- Dependencies: 220
-- Data for Name: items_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items_order (id, address, created_at, credit_card, customer_name, email, status, amount) FROM stdin;
1	Berhayat Sok.\nNo 8 Daire 1	2026-01-05 20:02:55.656059	reytryykujyhtreyt	Cansu Bektaş	Cbektas12@outlook.com	CONFIRMED	\N
2	Berhayat Sok.\nNo 8 Daire 1	2026-01-07 01:00:31.551914	reytryykujyhtreyt	Cansu Bektaş	Cbektas12@outlook.com	CONFIRMED	\N
3	Berhayat Sok.\nNo 8 Daire 1	2026-01-07 01:23:12.085364	reytryykujyhtreyt	Cansu Bektaş	Cbektas12@outlook.com	CONFIRMED	\N
4	Berhayat Sok.\nNo 8 Daire 1	2026-01-07 01:23:52.015583	reytryykujyhtreyt	Cansu Bektaş	Cbektas12@outlook.com	CONFIRMED	\N
5	Berhayat Sok.\nNo 8 Daire 1	2026-01-07 01:29:59.260278	reytryykujyhtreyt	Cansu Bektaş	Cbektas12@outlook.com	CONFIRMED	\N
6	Berhayat Sok.\nNo 8 Daire 1	2026-01-07 01:44:04.087494	reytryykujyhtreyt	Cansu Bektaş	Cbektas12@outlook.com	PAID	\N
7	Berhayat Sok.\nNo 8 Daire 1	2026-01-07 02:07:52.708955	reytryykujyhtreyt	Cansu Bektaş	Cbektas12@outlook.com	PENDING	\N
8	Berhayat Sok.\nNo 8 Daire 1	2026-01-07 02:37:25.104853	reytryykujyhtreyt	Cansu Bektaş	Cbektas12@outlook.com	PAID	2239
9	Berhayat Sok.\nNo 8 Daire 1	2026-01-07 03:08:51.30489	reytryykujyhtreyt	Cansu Bektaş	Cbektas12@outlook.com	PAID	10649
\.


--
-- TOC entry 5027 (class 0 OID 24706)
-- Dependencies: 224
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, amount, cardholder_name, currency, last4, order_id, paid_at, status) FROM stdin;
1	0	fghtukrjtyrst	TRY	5354	6	2026-01-07 01:44:23.72649	PAID
2	2239	sfgddhyjtukyıl	TRY	4950	8	2026-01-07 02:37:56.368669	PAID
3	10649	Cansu Bektaş	TRY	3461	9	2026-01-07 03:09:20.532052	PAID
\.


--
-- TOC entry 5025 (class 0 OID 24695)
-- Dependencies: 222
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, description, details, featured, image_url, main_category, name, price, sub_category) FROM stdin;
1	A versatile eyeshadow palette featuring cool-toned nude shades with a mix of matte, shimmer, and metallic finishes. Designed to create both everyday and bold eye looks with smooth blending and high color payoff.	{"weight_g": 16.5, "skin_type": "all", "palette_type": "Nude"}	f	https://media.sephora.eu/content/dam/digital/pim/published/H/HUDA_BEAUTY/739400/357629-media_swatch.jpg?scaleWidth=undefined&scaleHeight=undefined&scaleMode=undefined	Makeup	Huda Beauty Icy Nude Eyeshadow Palette	2999	Eyeshadow
2	A midi eyeshadow palette by Natasha Denona designed to sculpt and define the eyes with a mix of matte and shimmer tones. Smooth, blendable textures allow both soft everyday looks and more defined eye makeup.	{"weight_g": 14, "skin_type": "all", "palette_type": "Midi"}	t	https://media.sephora.eu/content/dam/digital/pim/published/N/NATASHA_DENONA/776482/382567-media_swatch.jpg?scaleWidth=undefined&scaleHeight=undefined&scaleMode=undefined	Makeup	Natasha Denona Eye Sculpt Texture and Tone Palette	2499	Eyeshadow
3	Huda Beauty Nude Obsessions Eyeshadow Palette features a range of soft matte and shimmer nude tones that blend easily and work for both everyday and bold looks. Designed to flatter many skin tones with universal nude shades.	{"weight_g": 9, "skin_type": "all", "palette_type": "Nude Obsessions"}	f	https://media.sephora.eu/content/dam/digital/pim/published/H/HUDA_BEAUTY/489139/121578-media_swatch.jpeg?scaleWidth=undefined&scaleHeight=undefined&scaleMode=undefined	Makeup	Huda Beauty Nude Obsessions Eyeshadow Palette	2239	Eyeshadow
4	Chanel Stylo Yeux Waterproof eye pencil provides rich color payoff with a creamy glide and long-lasting wear. Its waterproof formula resists smudging and fading, making it ideal for defining eyes with precision and intensity.	{"form": "Pencil", "skin_type": "all", "waterproof": true}	f	https://media.sephora.eu/content/dam/digital/pim/published/C/CHANEL/548903/234998-media_swatch.jpg?scaleWidth=undefined&scaleHeight=undefined&scaleMode=undefined	Makeup	Chanel Stylo Yeux Waterproof	1599	Eyeliner
5	Charlotte Tilbury The Feline Flick Eyeliner offers precise control with a smooth, rich black formula that glides easily for sharp, defined flicks. Its long-lasting texture resists smudging and stays bold throughout wear.	{"form": "Liquid", "skin_type": "all", "waterproof": true}	f	https://media.sephora.eu/content/dam/digital/pim/published/C/CHARLOTTE_TILBURY/747856/363933-media_swatch.jpg?scaleWidth=undefined&scaleHeight=undefined&scaleMode=undefined	Makeup	Charlotte Tilbury The Feline Flick Eyeliner	1699	Eyeliner
6	An ultra-precise liquid eyeliner by Benefit designed to create sharp, defined lines with intense black payoff. The fine tip allows maximum control for both subtle definition and bold liner looks, while the long-lasting formula resists smudging.	{"form": "Liquid", "skin_type": "all", "waterproof": true}	t	https://media.sephora.eu/content/dam/digital/pim/published/B/BENEFIT_COSMETICS/585605/272897-media_swatch.jpg?scaleWidth=undefined&scaleHeight=undefined&scaleMode=undefined	Makeup	Benefit They re Real! Xtreme Precision Liner	1699	Eyeliner
7	Dior Backstage Rosy Glow Stick Blush delivers a natural, radiant flush with a creamy, blendable texture that adapts to your skin’s moisture levels. 	{\n    "form": "Stick",\n    "finish": "Radiant",\n    "intensity": "Buildable"\n  }	t	https://media.sephora.eu/content/dam/digital/pim/published/D/DIOR/766334/372500-media_swatch.jpeg	Makeup	Dior Backstage Rosy Glow Stick Blush	2499	Blush
8	Fenty Beauty Fenty Cheeks Powder Blush delivers rich, blendable color with a high-performance formula that is long lasting and suitable for all skin tones. Ideal for a natural or radiant cheek look with a lightweight, breathable texture.	{\n    "form": "Powder",\n    "finish": "Natural",\n    "intensity": "Buildable"\n  }	f	https://media.sephora.eu/content/dam/digital/pim/published/F/FENTY_BEAUTY/728140/348251-media_swatch.jpg	Makeup	Fenty Beauty Fenty Cheeks Powder Blush	1869	Blush
9	Yves Saint Laurent Make Me Blush Powder Blush delivers buildable color with a silky texture that blends effortlessly into the skin. The lightweight formula provides a natural to bold flush while enhancing the complexion with a refined finish.	{\n    "form": "Powder",\n    "finish": "Soft Matte",\n    "intensity": "Buildable"\n  }	t	https://media.sephora.eu/content/dam/digital/pim/published/Y/YVES_SAINT_LAURENT/750675/363749-media_swatch-2.jpg	Makeup	Yves Saint Laurent Make Me Blush Powder Blush	2899	Blush
10	Benefit Cookie Highlighter adds a soft golden shimmer with a buildable glow that enhances the complexion. Its fine powder texture blends effortlessly to create radiant highlights for all skin tones.	{\n    "form": "Powder",\n    "finish": "Shimmery",\n    "shimmer_level": "High"\n  }	t	https://media.sephora.eu/content/dam/digital/pim/published/B/BENEFIT_COSMETICS/585599/275249-media_swatch.jpg	Makeup	Benefit Cookie Highlighter	2629	Highlighter
11	CHANEL Baume Essentiel is a multi-use glow stick that delivers a fresh, luminous sheen. Its balmy texture melts into the skin to reflect light and enhance the complexion with a natural, radiant finish.	{\n    "form": "Stick Balm",\n    "finish": "Dewy",\n    "shimmer_level": "Low"\n  }	f	https://media.sephora.eu/content/dam/digital/pim/published/C/CHANEL/464763/111123-media_swatch.jpg	Makeup	CHANEL Baume Essentiel Glow Stick	2300	Highlighter
12	Fenty Beauty Diamond Bomb All-Over Diamond Veil Highlighter delivers a multidimensional sparkle with a lightweight, blendable formula. Its radiant finish enhances the complexion with a luminous sheen that catches the light beautifully.	{\n    "form": "Loose/Pressed Powder",\n    "finish": "Highly Shimmery",\n    "shimmer_level": "Extreme"\n  }	f	https://media.sephora.eu/content/dam/digital/pim/published/F/FENTY_BEAUTY/443947/26103-media_swatch.jpg	Makeup	Fenty Beauty Diamond Bomb All-Over Diamond Veil Highlighter	2799	Highlighter
16	NARS Powermatte Lipstick delivers ultra-intense color with a smooth, lightweight matte finish. The long-wearing formula glides on effortlessly and provides bold impact with comfortable, all-day wear.	{"color":"Mogador","texture":"Matte","weight_g":1.5}	t	https://media.sephora.eu/content/dam/digital/pim/published/N/NARS/640290/299744-media_swatch.jpg?scaleWidth=585&scaleHeight=585&scaleMode=fit	Makeup	NARS Powermatte Lipstick	1980	Lipstick
17	Yves Saint Laurent Rouge Pur Couture Satin Lipstick delivers rich, intense color with a smooth satin finish. Its creamy texture glides effortlessly onto the lips, providing long-lasting comfort and a luxurious feel.	{"color":"Red / Nude (Shade Dependent)","texture":"Satin","weight_g":3.8}	f	https://media.sephora.eu/content/dam/digital/pim/published/Y/YVES_SAINT_LAURENT/700303/328071-media_swatch.jpg	Makeup	Yves Saint Laurent Rouge Pur Couture Satin Lipstick	2600	Lipstick
18	Charlotte Tilbury Pillow Talk Love Effect Lipstick delivers rich, flattering color with a smooth, comfortable feel. The formula glides on easily for an effortlessly polished look with a soft satin finish.	{"color":"Love Talk","texture":"Satin","weight_g":3.5}	f	https://media.sephora.eu/content/dam/digital/pim/published/C/CHARLOTTE_TILBURY/763125/367717-media_swatch.jpg	Makeup	Charlotte Tilbury Pillow Talk Love Effect Lipstick	2529	Lipstick
19	Lightweight gel-cream moisturizer that helps deeply hydrate the skin with auto-replenishing technology for up to 100 hours.	{\n    "skin_type": "All skin types",\n    "usage_time": "Morning & night",\n    "key_ingredients": "Aloe vera bio-ferment, hyaluronic acid"\n  }	t	https://media.sephora.eu/content/dam/digital/pim/published/C/CLINIQUE/530918/223977-media_swatch.jpg	Skincare	Clinique Moisture Surge™ – 100H Auto-Replenishing Moisturizer (30ml)	1160	Moisturizer
20	Repairing night serum designed to support smoother, healthier-looking skin while you sleep.	{\n    "skin_type": "All skin types",\n    "usage_time": "Night",\n    "key_ingredients": "Multi-recovery complex, hyaluronic acid"\n  }	f	https://media.sephora.eu/content/dam/digital/pim/published/L/LAUDE/738027/357261-media_swatch.jpeg	Skincare	Estée Lauder Advanced Night Repair – Repairing Night Serum (30ml)	4430	Moisturizer
21	Moisturizing gel cream suitable for sensitive skin; helps strengthen the skin barrier and provide a calmer appearance.	{\n    "skin_type": "Sensitive skin",\n    "usage_time": "Morning & night",\n    "key_ingredients": "Ceramide complex, niacinamide, green tea"\n  }	t	https://media.sephora.eu/content/dam/digital/pim/published/B/BYOMA/633707/281321-media_swatch.jpg	Skincare	BYOMA Moisturizing Gel Cream (50ml)	1219	Moisturizer
22	Lightweight eye contour serum formulated to help reduce the appearance of dark circles and puffiness around the eyes.	{\n    "skin_type": "All skin types",\n    "volume_ml": 30,\n    "active_ingredients": "Caffeine 5%, EGCG"\n  }	f	https://media.sephora.eu/content/dam/digital/pim/published/T/THE_ORDINARY/502450/161706-media_swatch.jpg	Skincare	The Ordinary Caffeine Solution 5% + EGCG Eye Contour Serum (30ml)	390	Serum
23	Advanced face serum designed to strengthen the skin’s defense system and improve overall skin resilience.	{\n    "skin_type": "All skin types",\n    "volume_ml": 50,\n    "active_ingredients": "ImuGenerationRED Technology, botanical extracts"\n  }	f	https://media.sephora.eu/content/dam/digital/pim/published/S/SHISEIDO/542277/230794-media_swatch.jpg	Skincare	Shiseido Ultimune 4.0 Power Infusing Serum (50ml)	7650	Serum
24	Clinically effective and tinted serum formulated to enhance radiance while providing a natural glow to the skin.	{\n    "skin_type": "All skin types",\n    "volume_ml": 40,\n    "active_ingredients": "Niacinamide, watermelon extract"\n  }	f	https://media.sephora.eu/content/dam/digital/pim/published/G/GLOW_RECIPE/716203/339018-media_swatch.jpg	Skincare	Glow Recipe Watermelon Glow Hue Drops – Niacinamide Brightening Serum (40ml)	2649	Serum
25	Mineral sunscreen makeup base that smooths the skin while providing hydration and broad-spectrum SPF 30 protection.	{\n    "spf": 30,\n    "skin_type": "All skin types",\n    "volume_ml": 40\n  }	f	https://media.sephora.eu/content/dam/digital/pim/published/K/KOSAS/758990/363412-media_swatch.jpg	Skincare	Kosas DreamBeam Comfy Smooth Sunscreen Makeup Base SPF 30 (40ml)	2989	SunCreams
26	Lightweight sun serum enriched with ginseng extract that provides intense hydration and high SPF 50+ sun protection.	{\n    "spf": 50,\n    "skin_type": "All skin types",\n    "volume_ml": 50\n  }	f	https://media.sephora.eu/content/dam/digital/pim/published/B/BEAUTY_OF_JOSEON/761609/365603-media_swatch.jpg	Skincare	Beauty of Joseon Ginseng Moist Sun Serum SPF 50+ (50ml)	1349	SunCreams
27	Lightweight mineral sunscreen that helps protect the skin against UVA and UVB rays while delivering a natural finish.	{\n    "spf": 30,\n    "skin_type": "All skin types",\n    "volume_ml": 50\n  }	t	https://media.sephora.eu/content/dam/digital/pim/published/S/SUMMER_FRIDAYS/616100/277168-media_swatch.jpg	Skincare	Summer Fridays ShadeDrops Mineral Milk Sunscreen SPF 30 (50ml)	3439	SunCreams
28	Weekly at-home treatment mask designed to repair, strengthen, and protect hair structure from damage.	{"hair_type":"All hair types","volume_ml":100,"curl_friendly":true}	t	https://media.sephora.eu/content/dam/digital/pim/published/O/OLAPLEX/353189/31163-media_swatch.jpg?scaleWidth=undefined&scaleHeight=undefined&scaleMode=undefined	Haircare	Olaplex No.3 Hair Perfector Repairing Hair Mask (100ml)	2150	HairMask
29	Deeply hydrating hair mask enriched with hyaluronic acid to provide long-lasting moisture and softness.	{"hair_type":"Dry & dehydrated hair","volume_ml":250,"curl_friendly":true}	f	https://media.sephora.eu/content/dam/digital/pim/published/A/AMIKA/728491/348406-media_swatch.jpg?scaleWidth=undefined&scaleHeight=undefined&scaleMode=undefined	Haircare	Amika Hydro Rush Intense Moisture Hair Mask (250ml)	2659	HairMask
30	Professional strengthening mask formulated to renew hair lengths and improve the appearance of thin or damaged ends.	{"hair_type":"Long & damaged hair","volume_ml":250,"curl_friendly":false}	f	https://media.sephora.eu/content/dam/digital/pim/published/B/BRGWP232/557756/240278-media_swatch.jpg?scaleWidth=undefined&scaleHeight=undefined&scaleMode=undefined	Haircare	Loreal Professionnel Serie Expert Pro Longer Hair Mask (250ml)	1500	HairMask
31	Nourishing hair oil enriched with sustainably sourced Mirsalehi honey to add shine, softness, and hydration.	{\n    "hair_type": "All hair types",\n    "volume_ml": 50,\n    "active_ingredients": "Mirsalehi honey, botanical oils"\n  }	f	https://media.sephora.eu/content/dam/digital/pim/published/G/GISOU/760195/363971-media_swatch.jpg	Haircare	Gisou Honey Infused Hair Oil (50ml)	2529	Oils
32	Multi-purpose illuminating hair oil that enhances shine, smoothness, and softness with a lightweight formula.	{\n    "hair_type": "All hair types",\n    "volume_ml": 75,\n    "active_ingredients": "Marula oil, camellia oil"\n  }	t	https://media.sephora.eu/content/dam/digital/pim/published/K/KERAS/732806/351096-media_swatch.jpg	Haircare	Kérastase Elixir Ultime Refillable Hair Oil (75ml)	3750	Oils
33	Anti-frizz smoothing serum formulated with keratin to control unruly hair and provide long-lasting smoothness.	{\n    "hair_type": "Frizzy & unruly hair",\n    "volume_ml": 125,\n    "active_ingredients": "Keratin, kukui nut oil"\n  }	f	https://media.sephora.eu/content/dam/digital/pim/published/B/BRGWP232/557746/240268-media_swatch.jpg	Haircare	L’Oréal Professionnel Serie Expert Liss Unlimited Smoothing Serum (125ml)	1240	Oils
34	Curl defining styling cream that enhances waves and curls, reduces frizz, and provides flexible, natural hold.	{\n    "washable": true,\n    "hair_type": "Wavy & curly hair",\n    "hold_level": 2\n  }	f	https://media.sephora.eu/content/dam/digital/pim/published/A/AVEDA/718167/350291-media_swatch.jpeg	Haircare	Aveda Be Curly Advanced Curl Defining Cream (200ml)	1929	HairWax
35	Rich curl defining cream formulated to shape, moisturize, and enhance natural curls with soft, touchable hold.	{\n    "washable": true,\n    "hair_type": "Curly & coily hair",\n    "hold_level": 3\n  }	f	https://media.sephora.eu/content/dam/digital/pim/published/F/FENTY_HAIR/756731/363192-media_swatch.jpg	Haircare	Fenty Hair The Homecurl Curl Defining Cream (100ml)	1439	HairWax
36	Leave-in thermo-protective styling serum designed for color-treated hair to reduce frizz and protect against heat.	{\n    "washable": true,\n    "hair_type": "Color-treated hair",\n    "hold_level": 1\n  }	f	https://media.sephora.eu/content/dam/digital/pim/published/K/KERAS/615342/276996-media_swatch.jpg	Haircare	Kerastase Chroma Absolu Thermique Color-Protecting Serum (150ml)	2350	HairWax
37	Limited-edition glow kit featuring two iconic Beauty Light Wands for a radiant, Hollywood-inspired highlight.	{\n    "coverage": "Sheer to Medium",\n    "kit_type": "Highlighter Set",\n    "product_count": 2\n  }	t	https://media.sephora.eu/content/dam/digital/pim/published/C/CHARLOTTE_TILBURY/779527/382343-media_swatch-0.jpg	SpecialSets	Charlotte Tilbury Hollywood Superstar Glow Kit	2249	MakeupSets
38	Gloss Bomb lip gloss trio set featuring three universally flattering shades with high-shine finish.	{\n    "coverage": "Sheer",\n    "kit_type": "Lip Gloss Set",\n    "product_count": 3\n  }	f	https://media.sephora.eu/content/dam/digital/pim/published/F/FENTY_BEAUTY/FENTY/369901-media_swatch.jpg	SpecialSets	Fenty Beauty Glossy Posse VIII Lip Gloss Set	3659	MakeupSets
39	Holiday lip makeup set including three Maracuja Juicy Lip products for hydrated, glossy lips.	{\n    "coverage": "Medium",\n    "kit_type": "Lip Makeup Set",\n    "product_count": 3\n  }	t	https://media.sephora.eu/content/dam/digital/pim/published/T/TARTE/776078/376769-media_swatch-0.jpg	SpecialSets	Tarte Lil’ Treats Maracuja Juicy Lip Trio	1979	MakeupSets
40	Makeup gift set including iconic Pillow Talk shades designed to enhance lips and cheeks with a soft, romantic glow.	{\n    "gender": "Female",\n    "age_group": "Adult",\n    "product_count": 3\n  }	t	https://media.sephora.eu/content/dam/digital/pim/published/C/CHARLOTTE_TILBURY/776517/377610-media_swatch-0.jpg	SpecialSets	Charlotte Tilbury Pillow Talk Iconic Lip & Cheek Kit	2499	SetsForGifts
41	Holiday fragrance mist gift set featuring multiple iconic Cheirosa scents in travel-size sprays.	{\n    "gender": "Unisex",\n    "age_group": "Adult",\n    "product_count": 5\n  }	t	https://media.sephora.eu/content/dam/digital/pim/published/S/SOL_DE_JANEIRO/774834/377291-media_swatch.jpg	SpecialSets	Sol de Janeiro Spritz The Season Cheirosa Perfumed Body Spray Set (5 x 30ml)	3199	SetsForGifts
42	Luxury men’s fragrance gift set featuring the iconic Versace Eros Eau de Parfum, perfect for special occasions.	{\n    "gender": "Male",\n    "age_group": "Adult",\n    "product_count": 2\n  }	f	https://media.sephora.eu/content/dam/digital/pim/published/V/VERSACE/792493/385823-media_swatch-0.jpg	SpecialSets	Versace Eros Eau de Parfum Gift Set (100ml + 10ml)	6440	SetsForGifts
\.


--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 219
-- Name: items_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_order_id_seq', 9, true);


--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 223
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 3, true);


--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 221
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 42, true);


--
-- TOC entry 4870 (class 2606 OID 24693)
-- Name: items_order items_order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_order
    ADD CONSTRAINT items_order_pkey PRIMARY KEY (id);


--
-- TOC entry 4874 (class 2606 OID 24716)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4872 (class 2606 OID 24704)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


-- Completed on 2026-01-07 04:37:34

--
-- PostgreSQL database dump complete
--

\unrestrict d81skEb3zC8aBAeQ9DS04tOYYuxXcLwz5ddxnEKYDJZpzQOk16CbtYPcilUc8Ra

