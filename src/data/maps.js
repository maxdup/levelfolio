import vanguardTitle from '../images/vanguard/vanguard.png'
import vanguardImg0 from '../images/vanguard/cp_vanguard_rc60.jpg'
import vanguardImg1 from '../images/vanguard/cp_vanguard_rc61.jpg'
import vanguardImg2 from '../images/vanguard/cp_vanguard_rc62.jpg'
import vanguardImg3 from '../images/vanguard/cp_vanguard_rc63.jpg'
import vanguardImg4 from '../images/vanguard/cp_vanguard_rc64.jpg'
import vanguardPanorama from '../images/vanguard/cp_vanguard360.jpg'
import vanguardMdl from '../models/vanguard.obj?url'
import vanguardMtl from '../models/vanguard.mtl?url'

import hadalTitle from '../images/hadal/hadal.png'
import hadalImg0 from '../images/hadal/cp_hadal_b130.jpg'
import hadalImg1 from '../images/hadal/cp_hadal_b131.jpg'
import hadalImg2 from '../images/hadal/cp_hadal_b132.jpg'
import hadalImg3 from '../images/hadal/cp_hadal_b133.jpg'
import hadalImg4 from '../images/hadal/cp_hadal_b134.jpg'
import hadalPanorama from '../images/hadal/cp_hadal360.jpg'
import hadalMdl from '../models/hadal.obj?url'
import hadalMtl from '../models/hadal.mtl?url'

import snowvilleTitle from '../images/snowville/snowville.png'
import snowvilleImg0 from '../images/snowville/snowville_01.jpg'
import snowvilleImg1 from '../images/snowville/snowville_02.jpg'
import snowvilleImg2 from '../images/snowville/snowville_03.jpg'
import snowvilleImg3 from '../images/snowville/snowville_04.jpg'
import snowvilleImg4 from '../images/snowville/snowville_05.jpg'
import snowvillePanorama from '../images/snowville/pd_snowville360.jpg'

import occultTitle from '../images/occult/occult.png'
import occultImg0 from '../images/occult/koth_occult_rc40.jpg'
import occultImg1 from '../images/occult/koth_occult_rc41.jpg'
import occultImg2 from '../images/occult/koth_occult_rc42.jpg'
import occultImg3 from '../images/occult/koth_occult_rc43.jpg'
import occultImg4 from '../images/occult/koth_occult_rc44.jpg'
import occultPcgamer from '../images/occult/pcgamer.jpg'
import occultPanorama from '../images/occult/koth_occult360.jpg'
import occultMdl from '../models/occult.obj?url'
import occultMtl from '../models/occult.mtl?url'

import effigyTitle from '../images/effigy/effigy.png'
import effigyImg0 from '../images/effigy/pl_effigy_rc20.jpg'
import effigyImg1 from '../images/effigy/pl_effigy_rc21.jpg'
import effigyImg2 from '../images/effigy/pl_effigy_rc22.jpg'
import effigyImg3 from '../images/effigy/pl_effigy_rc23.jpg'
import effigyImg4 from '../images/effigy/pl_effigy_rc24.jpg'
import effigyPanorama from '../images/effigy/pl_effigy360.jpg'

const maps = {
  vanguard: {
    name: 'vanguard',
    order: 0,
    mdlurl: vanguardMdl,
    mtlurl: vanguardMtl,
    mdlents: [['cn', 0, 0, 103], ['cr', 1936, -400, 324],
              ['cr', 4096, -1216, 319], ['cb', -1936, 400, 324],
              ['cb', -4096, 1216, 319], ['rr', 5300, -950, 310],
              ['rb', -5300, 950, 310], ['ph', 1265, -548, 109],
              ['pa', 1265, -484, 109], ['ph', 528, 224, 26],
              ['pa', 528, 120, 26], ['ph', 92, 528, 202],
              ['pa', 196, 528, 202], ['ph', 1810, 720, 138],
              ['pa', 1700, 720, 138], ['ph', 2150, -820, 60],
              ['pa', 2150, -716, 60], ['pa', 1948, -1760, 250],
              ['ph', 1844, -1760, 250], ['ph', 3008, -1248, 246],
              ['pa', 3154, -480, 246], ['ph', 3488, 64, 187],
              ['pa', 3392, -416, 179], ['pa', 3568, -580, 394],
              ['ph', 3568, -684, 394], ['ph', -1265, 548, 109],
              ['pa', -1265, 484, 109], ['ph', -528, -224, 26],
              ['pa', -528, -120, 26], ['ph', -92, -528, 202],
              ['pa', -196, -528, 202], ['ph', -1810, -720, 138],
              ['pa', -1700, -720, 138], ['ph', -2150, 820, 60],
              ['pa', -2150, 716, 60], ['pa', -1948, 1760, 250],
              ['ph', -1844, 1760, 250], ['ph', -3008, 1248, 246],
              ['pa', -3154, 480, 246], ['ph', -3488, -64, 187],
              ['pa', -3392, 416, 179], ['pa', -3568, 580, 394],
              ['ph', -3568, 684, 394]],
    targetid: 'vanguard3d',
    workid: 'cp_vanguard',
    level: 1,
    title: vanguardTitle,
    images: [
      { image: vanguardImg0, id: 0 },
      { image: vanguardImg1, id: 1 },
      { image: vanguardImg2, id: 2 },
      { image: vanguardImg3, id: 3 },
      { image: vanguardImg4, id: 4 },
    ],
    panorama: vanguardPanorama,
    panorama_angle: 137,
  },
  hadal: {
    name: 'hadal',
    order: 1,
    mdlurl: hadalMdl,
    mtlurl: hadalMtl,
    mdlents: [['c1', -1664, -622, 396], ['c2', 1828, 292, 512],
              ['c3', -912, 1680, 544], ['c4', 352, 512, 614],
              ['rb', 128, -2647, 14], ['rr', -576, -104, 112],
              ['pa', -946, 448, 567], ['ph', -1054, 448, 567],
              ['ph', 976, -1012, 493], ['pa', 976, -898, 493],
              ['pa', 290, 1036, 398], ['ph', 414, 1036, 398],
              ['ph', 1146, 1256, 589], ['pa', 1234, 1149, 589],
              ['ph', -1792, 1584, 565], ['ph', -1104, 1824, 465],
              ['ph', -25, 185, 277], ['pa', 60, 100, 277],
              ['pa', 2064, -16, 397], ['ph', 2080, -902, 397],
              ['ph', -1536, -2016, 174], ['pa', -1280, -1312, 13],
              ['pa', -2000, -272, 267], ['pa', -1080, 1848, 616],
              ['ph', 1008, 400, 397], ['pa', 1240, -472, 468],
              ['ph', 1280, -744, 205], ['pa', 960, -1404, 212],
              ['ph', 1216, 128, 465]],
    targetid: 'hadal3d',
    workid: '804251853',
    level: 1,
    title: hadalTitle,
    images: [
      { image: hadalImg0, id: 0 },
      { image: hadalImg1, id: 1 },
      { image: hadalImg2, id: 2 },
      { image: hadalImg3, id: 3 },
      { image: hadalImg4, id: 4 },
    ],
    panorama: hadalPanorama,
    panorama_angle: 103,
  },
  snowville: {
    name: 'snowville',
    order: 2,
    workid: 'pd_snowville',
    level: 1,
    title: snowvilleTitle,
    images: [
      { image: snowvilleImg0, id: 0 },
      { image: snowvilleImg1, id: 1 },
      { image: snowvilleImg2, id: 2 },
      { image: snowvilleImg3, id: 3 },
      { image: snowvilleImg4, id: 4 },
    ],
    panorama: snowvillePanorama,
    panorama_angle: 0,
  },
  occult: {
    name: 'occult',
    order: 1,
    mdlurl: occultMdl,
    mtlurl: occultMtl,
    mdlents: [['cn', 0, 0, 70], ['pa', 544, 624, -41], ['ph', -328, 96, -126],
              ['pa', 1216, -130, -160], ['ph', 1216, -254, -160],
              ['pa', -30, 1152, -33], ['ph', 94, 1152, -27],
              ['pa', -544, -624, -41], ['ph', 328, -96, -126],
              ['pa', -1216, 130, -160], ['ph', -1216, 254, -160],
              ['pa', 30, -1152, -33], ['ph', -94, -1152, -27],
              ['rr', -1368, -3568, 122], ['rb', 1368, 3568, 122]],
    targetid: 'occult3d',
    workid: '468770640',
    level: 0,
    title: occultTitle,
    images: [
      { image: occultImg0, id: 0 },
      { image: occultImg1, id: 1 },
      { image: occultImg2, id: 2 },
      { image: occultImg3, id: 3 },
      { image: occultImg4, id: 4 },
    ],
    more_images: { pcgamer: occultPcgamer },
    panorama: occultPanorama,
    panorama_angle: -23,
  },
  effigy: {
    name: 'effigy',
    order: 3,
    workid: '543841027',
    level: 0,
    title: effigyTitle,
    images: [
      { image: effigyImg0, id: 0 },
      { image: effigyImg1, id: 1 },
      { image: effigyImg2, id: 2 },
      { image: effigyImg3, id: 3 },
      { image: effigyImg4, id: 4 },
    ],
    panorama: effigyPanorama,
    panorama_angle: 168,
  },
}

export default maps
