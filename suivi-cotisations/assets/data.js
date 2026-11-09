// Donnees initiales extraites du classeur suivi_cotisations_impayees opti.xlsx (71 employeurs).
const SEED_EMPLOYERS = [
    {
        "id":  "emp-001",
        "registration":  "1201503250",
        "name":  "Agence Nationale d\u0027Appui au développement à la Base",
        "sigle":  "ANADEB",
        "contact":  "93869373/anadebtogo@gmail.com",
        "effectif":  2,
        "status":  "Échéancier en cours"
    },
    {
        "id":  "emp-002",
        "registration":  "1201501543",
        "name":  "Autorité de la Régulation de la Commande Publique",
        "sigle":  "ARCOP",
        "contact":  "22230680/arcoptogo@arcop.tg",
        "effectif":  10,
        "status":  "À relancer"
    },
    {
        "id":  "emp-003",
        "registration":  "1201200008",
        "name":  "Autorité de Régulation des Communications Électroniques et des Postes",
        "sigle":  "ARTP/ARCEP",
        "contact":  "22236363/arcep@arcep.tg",
        "effectif":  2,
        "status":  "À relancer"
    },
    {
        "id":  "emp-004",
        "registration":  "1201409933",
        "name":  "ASSEMBLEE NATIONALE",
        "sigle":  "AN",
        "contact":  "90327777/96193939 MUSTAPHA",
        "effectif":  32,
        "status":  "À relancer"
    },
    {
        "id":  "emp-005",
        "registration":  "1201900072",
        "name":  "Agence Togolaise d’Electrification Rurale et des Energies Renouvelables",
        "sigle":  "AT2ER",
        "contact":  "90013474/at2ertogo@gmail.com",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-006",
        "registration":  "1201200010",
        "name":  "Association Togolaise pour le Bien-Etre Familial",
        "sigle":  "ATBEF",
        "contact":  "22233000/atbef@siegeatbeftogo.org",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-007",
        "registration":  "1201200095",
        "name":  "Centrale d\u0027Achat des Médicaments Essentiels et Génériques du Togo",
        "sigle":  "CAMEG",
        "contact":  "90194890 Le Comptable",
        "effectif":  2,
        "status":  "À relancer"
    },
    {
        "id":  "emp-008",
        "registration":  "1201409935",
        "name":  "CCFCC",
        "sigle":  "CCFCC",
        "contact":  "2270945/ccfcctogo@gmail.com",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-009",
        "registration":  "1201300005",
        "name":  "CCM TOGO",
        "sigle":  "CCM TOGO",
        "contact":  "93103865/kpakpabiacalice@gmail.com",
        "effectif":  3,
        "status":  "À relancer"
    },
    {
        "id":  "emp-010",
        "registration":  "1202100011",
        "name":  "CDA",
        "sigle":  "CDA",
        "contact":  "90367059 M MOTSO",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-011",
        "registration":  "1202200091",
        "name":  "CHEMONICS TOGO",
        "sigle":  "CHEMONICS TOGO",
        "contact":  "90320189/dkoubatine@ghsc-pm.org",
        "effectif":  4,
        "status":  "À relancer"
    },
    {
        "id":  "emp-012",
        "registration":  "1202400051",
        "name":  "COMPASSION INTERNATIONALE TOGO",
        "sigle":  "COMPASSION INTERNATIONALE TOGO",
        "contact":  "99177620",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-013",
        "registration":  "1201200016",
        "name":  "CROIX ROUGE TOGO",
        "sigle":  "CRT",
        "contact":  "22212110/crtsiege@laposte.tg",
        "effectif":  4,
        "status":  "À relancer"
    },
    {
        "id":  "emp-014",
        "registration":  "1202200491",
        "name":  "DAHW-TOGO",
        "sigle":  "DAHW-TOGO",
        "contact":  "90839350 M TAGBA",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-015",
        "registration":  "1201200002",
        "name":  "DIRECTION DES FINANCES",
        "sigle":  "DF",
        "contact":  "92090002 Mme AMEKUSE",
        "effectif":  75572,
        "status":  "À relancer"
    },
    {
        "id":  "emp-016",
        "registration":  "1201200019",
        "name":  "EDITOGO",
        "sigle":  "EDITOGO",
        "contact":  "90773535 M OHIN",
        "effectif":  3,
        "status":  "À relancer"
    },
    {
        "id":  "emp-017",
        "registration":  "1201900127",
        "name":  "FHI-360",
        "sigle":  "FHI-360",
        "contact":  "93813139 M ESSY",
        "effectif":  7,
        "status":  "À relancer"
    },
    {
        "id":  "emp-018",
        "registration":  "1201200007",
        "name":  "GESCOD",
        "sigle":  "GESCOD",
        "contact":  "90377647 La RH",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-019",
        "registration":  "1202201202",
        "name":  "GIZ",
        "sigle":  "GIZ",
        "contact":  "70590667/rh-giztogo@giz.de",
        "effectif":  6,
        "status":  "À relancer"
    },
    {
        "id":  "emp-020",
        "registration":  "1202100759",
        "name":  "HISP WCA",
        "sigle":  "HISP WCA",
        "contact":  "90941171/info@hispwca.org",
        "effectif":  4,
        "status":  "À relancer"
    },
    {
        "id":  "emp-021",
        "registration":  "1201900123",
        "name":  "HOTEL SARAKAWA",
        "sigle":  "HS",
        "contact":  "90334476 M AWOUME",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-022",
        "registration":  "2201400862",
        "name":  "HOUEDJI KOSSIVI WOEDJANGOU(SRDS",
        "sigle":  "HOUEDJI KOSSIVI WOEDJANGOU(SRDS",
        "contact":  "90115265",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-023",
        "registration":  "1202300407",
        "name":  "IH",
        "sigle":  "IH",
        "contact":  "26601055/bureau_togo@santeintégree.org",
        "effectif":  6,
        "status":  "À relancer"
    },
    {
        "id":  "emp-024",
        "registration":  "1201200028",
        "name":  "INSTITUT NATIONAL DES ASSURANCES MALADIES",
        "sigle":  "INAM",
        "contact":  "",
        "effectif":  10,
        "status":  "À relancer"
    },
    {
        "id":  "emp-025",
        "registration":  "1201907685",
        "name":  "JHPIEGO",
        "sigle":  "JHPIEGO",
        "contact":  "91149119/yabaessien@jhpiego.org",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-026",
        "registration":  "2201401576",
        "name":  "KONLANI KANFITIN",
        "sigle":  "KONLANI KANFITIN",
        "contact":  "",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-027",
        "registration":  "2201401790",
        "name":  "KOZAH TCHEPI KWEKU GNASSINGBE",
        "sigle":  "KOZAH TCHEPI KWEKU GNASSINGBE",
        "contact":  "90035451/kozaht@yahoo.com",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-028",
        "registration":  "1201200031",
        "name":  "Loterie Nationale Togolaise",
        "sigle":  "LONATO",
        "contact":  "22535700/lalonato@gmail.com",
        "effectif":  2,
        "status":  "À relancer"
    },
    {
        "id":  "emp-029",
        "registration":  "1202101408",
        "name":  "MALARIA CONSORTIUM TOGO",
        "sigle":  "MC-TOGO",
        "contact":  "90825979 La RH",
        "effectif":  3,
        "status":  "À relancer"
    },
    {
        "id":  "emp-030",
        "registration":  "1201200075",
        "name":  "MINISTRE DE LA DEFENSE NATIONALE",
        "sigle":  "MDN",
        "contact":  "",
        "effectif":  24452,
        "status":  "À relancer"
    },
    {
        "id":  "emp-031",
        "registration":  "1201500001",
        "name":  "OFFICE TOGOLAIS DES RECETTES",
        "sigle":  "OTR",
        "contact":  "",
        "effectif":  577,
        "status":  "À relancer"
    },
    {
        "id":  "emp-032",
        "registration":  "1201200035",
        "name":  "OMS",
        "sigle":  "OMS",
        "contact":  "",
        "effectif":  4,
        "status":  "À relancer"
    },
    {
        "id":  "emp-033",
        "registration":  "1201800120",
        "name":  "PADAT",
        "sigle":  "PADAT",
        "contact":  "90291020/padat.togo@gmail.com",
        "effectif":  3,
        "status":  "À relancer"
    },
    {
        "id":  "emp-034",
        "registration":  "1201200084",
        "name":  "PAL",
        "sigle":  "PAL",
        "contact":  "22274742/togoport@togoport.tg",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-035",
        "registration":  "1202201142",
        "name":  "PAQEEB",
        "sigle":  "PAQEEB",
        "contact":  "91280275/paqeebtogo@gmail.com",
        "effectif":  5,
        "status":  "À relancer"
    },
    {
        "id":  "emp-036",
        "registration":  "1202301081",
        "name":  "PASH-MUT",
        "sigle":  "PASH-MUT",
        "contact":  "Projet fermé cette année en juin 2026",
        "effectif":  3,
        "status":  "À relancer"
    },
    {
        "id":  "emp-037",
        "registration":  "1202101242",
        "name":  "PATA-OTI",
        "sigle":  "PATA-OTI",
        "contact":  "90095882/uepdro4@gmail.com/promake@yahoo.com",
        "effectif":  6,
        "status":  "À relancer"
    },
    {
        "id":  "emp-038",
        "registration":  "1202200559",
        "name":  "PC ELON",
        "sigle":  "PC ELON",
        "contact":  "22514263",
        "effectif":  2,
        "status":  "À relancer"
    },
    {
        "id":  "emp-039",
        "registration":  "1201200040",
        "name":  "PNLS-IST",
        "sigle":  "PNLS-IST",
        "contact":  "90194256/22209439",
        "effectif":  2,
        "status":  "À relancer"
    },
    {
        "id":  "emp-040",
        "registration":  "1202301309",
        "name":  "PRIMA",
        "sigle":  "PRIMA",
        "contact":  "90892825/prima.togo2023@gmail.com",
        "effectif":  9,
        "status":  "À relancer"
    },
    {
        "id":  "emp-041",
        "registration":  "1201908534",
        "name":  "PROMIFA",
        "sigle":  "PROMIFA",
        "contact":  "91384038 Mme OLOUADARA",
        "effectif":  6,
        "status":  "À relancer"
    },
    {
        "id":  "emp-042",
        "registration":  "1202400203",
        "name":  "SADD",
        "sigle":  "SADD",
        "contact":  "92966218/solidarite.action0@gmail.com",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-043",
        "registration":  "1201200073",
        "name":  "SALT LOME",
        "sigle":  "SALT LOME",
        "contact":  "22236060/salt@cafe.tg",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-044",
        "registration":  "1201200032",
        "name":  "SNPT",
        "sigle":  "SNPT",
        "contact":  "90026440/snpt@phosphatesdutogo.com",
        "effectif":  2,
        "status":  "À relancer"
    },
    {
        "id":  "emp-045",
        "registration":  "1201200048",
        "name":  "SOS-VILLAGES ENFANTS",
        "sigle":  "SOS-VILLAGES ENFANTS",
        "contact":  "70597606 M SOGOYOU/samtou.sogoyou@sos-togo.org",
        "effectif":  3,
        "status":  "À relancer"
    },
    {
        "id":  "emp-046",
        "registration":  "1202300960",
        "name":  "SSEQCU",
        "sigle":  "SSEQCU",
        "contact":  "70651653sseqcu.togo@gmail.com",
        "effectif":  2,
        "status":  "À relancer"
    },
    {
        "id":  "emp-047",
        "registration":  "1201900028",
        "name":  "STIC-SA",
        "sigle":  "STIC-SA",
        "contact":  "91651794 M KPATCHA (Institution dissoute en Mars 2026)",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-048",
        "registration":  "2201503219",
        "name":  "TANI TCHILABALO",
        "sigle":  "TANI TCHILABALO",
        "contact":  "90923576/tanigilbert@yahoo.fr",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-049",
        "registration":  "1201200055",
        "name":  "UNITE DE GESTION DES PROJETS DU FOND MONDIAL",
        "sigle":  "UGP-FM",
        "contact":  "22203814/ugptogo@yahoo.fr",
        "effectif":  8,
        "status":  "À relancer"
    },
    {
        "id":  "emp-050",
        "registration":  "1201200074",
        "name":  "UNIVERSITE DE KARA",
        "sigle":  "UK",
        "contact":  "",
        "effectif":  176,
        "status":  "À relancer"
    },
    {
        "id":  "emp-051",
        "registration":  "1201200059",
        "name":  "UNIVERSITE DE LOME",
        "sigle":  "UL",
        "contact":  "90961232 M KPEKPASSI",
        "effectif":  383,
        "status":  "À relancer"
    },
    {
        "id":  "emp-052",
        "registration":  "1202001459",
        "name":  "WACA-RESIP",
        "sigle":  "WACA-RESIP",
        "contact":  "90212219 le RAF",
        "effectif":  3,
        "status":  "À relancer"
    },
    {
        "id":  "emp-053",
        "registration":  "1202102297",
        "name":  "WURI-TOGO",
        "sigle":  "WURI-TOGO",
        "contact":  "",
        "effectif":  2,
        "status":  "À relancer"
    },
    {
        "id":  "emp-054",
        "registration":  "1202500114",
        "name":  "PANT",
        "sigle":  "PANT",
        "contact":  "90182340/kokou.tofia@pant.gouv.tg",
        "effectif":  2,
        "status":  "À relancer"
    },
    {
        "id":  "emp-055",
        "registration":  "1201200041",
        "name":  "PNUD",
        "sigle":  "PNUD",
        "contact":  "",
        "effectif":  2,
        "status":  "À relancer"
    },
    {
        "id":  "emp-056",
        "registration":  "1202300568",
        "name":  "ARAA",
        "sigle":  "ARAA",
        "contact":  "90276139",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-057",
        "registration":  "1202400282",
        "name":  "CRS-TOGO",
        "sigle":  "CRS-TOGO",
        "contact":  "91832203/yolande.atana@crs.org",
        "effectif":  5,
        "status":  "À relancer"
    },
    {
        "id":  "emp-058",
        "registration":  "1201700107",
        "name":  "UONGTO",
        "sigle":  "UONGTO",
        "contact":  "70418785/uongto_2000@yahoo.fr",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-059",
        "registration":  "1202301437",
        "name":  "FSRP-TOGO",
        "sigle":  "FSRP-TOGO",
        "contact":  "",
        "effectif":  4,
        "status":  "À relancer"
    },
    {
        "id":  "emp-060",
        "registration":  "1202301080",
        "name":  "GFA CONSULTING GROUP",
        "sigle":  "GFA CONSULTING GROUP",
        "contact":  "",
        "effectif":  2,
        "status":  "À relancer"
    },
    {
        "id":  "emp-061",
        "registration":  "1201200082",
        "name":  "NSCT",
        "sigle":  "NSCT",
        "contact":  "20400153/nsct@nsct.tg",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-062",
        "registration":  "2202500611",
        "name":  "MANOUBA GOUNTEN (ABM)",
        "sigle":  "MANOUBA GOUNTEN (ABM)",
        "contact":  "90263671",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-063",
        "registration":  "1201200018",
        "name":  "EAMAU",
        "sigle":  "EAMAU",
        "contact":  "96801277/22216253",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-064",
        "registration":  "1202300570",
        "name":  "CICA-RE",
        "sigle":  "CICA-RE",
        "contact":  "99533638 M TCHEOU",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-065",
        "registration":  "2202100940",
        "name":  "LAMBONI WAMPA (VNU)",
        "sigle":  "LAMBONI WAMPA (VNU)",
        "contact":  "",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-066",
        "registration":  "2202501063",
        "name":  "YAGNINIM WAKE (CEDEAO)",
        "sigle":  "YAGNINIM WAKE (CEDEAO)",
        "contact":  "",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-067",
        "registration":  "1202501483",
        "name":  "CIPRES",
        "sigle":  "CIPRES",
        "contact":  "90101434 M TCHAOU",
        "effectif":  1,
        "status":  "À relancer"
    },
    {
        "id":  "emp-068",
        "registration":  "1201200056",
        "name":  "UEMOA",
        "sigle":  "UEMOA",
        "contact":  "",
        "effectif":  4,
        "status":  "À relancer"
    },
    {
        "id":  "emp-069",
        "registration":  "1202201129",
        "name":  "UGP-AK",
        "sigle":  "UGP-AK",
        "contact":  "91446819 Mme KINI",
        "effectif":  6,
        "status":  "À relancer"
    },
    {
        "id":  "emp-070",
        "registration":  "1202100546",
        "name":  "PROJET QOSLSTM/UL",
        "sigle":  "PROJET QOSLSTM/UL",
        "contact":  "93651427/qoslstmul@gmail.com",
        "effectif":  2,
        "status":  "À relancer"
    },
    {
        "id":  "emp-071",
        "registration":  "1202101061",
        "name":  "PHASAO",
        "sigle":  "PHASAO",
        "contact":  "90054811/ugpphasao@inseed.tg",
        "effectif":  1,
        "status":  "À relancer"
    }
];
