module.exports = {
  'files': [
    '../../node_modules/octicons/build/svg/gear.svg',
    '../../node_modules/octicons/build/svg/info.svg',
    '../../node_modules/octicons/build/svg/x.svg',
    '../../node_modules/octicons/build/svg/chevron-right.svg',
    '../../node_modules/octicons/build/svg/chevron-left.svg',
    '../../node_modules/octicons/build/svg/chevron-down.svg',
    '../../node_modules/octicons/build/svg/issue-opened.svg',
    '../../node_modules/octicons/build/svg/grabber.svg',
    '../../node_modules/octicons/build/svg/file.svg',
    '../../node_modules/simple-icons/icons/facebook.svg',
    '../../node_modules/simple-icons/icons/linkedin.svg',
    '../../node_modules/simple-icons/icons/github.svg',
    '../../node_modules/simple-icons/icons/youtube.svg',
    '../../node_modules/ionicons/dist/ionicons/svg/expand.svg'
  ],
  'fontName': 'lvl_icons',
  'cssTemplate': './lvl-icons.css.hbs',
  'classPrefix': 'lvl-',
  'baseSelector': '.lvl',
  'types': ['eot', 'woff', 'woff2', 'ttf', 'svg'],
  'fixedWidth': false,
  'fileName': 'app.[fontname].[chunkhash].[ext]',

  // html doc
  'html': true,
  'htmlTemplate': './lvl-icons.html.hbs',

  // file output
  'dest': 'static',
  'writeFiles': true
};


