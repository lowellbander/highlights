'use strict';

const cheerio = require('cheerio');
const fs = require('fs');
const scrapeIt = require('scrape-it');

const {log} = console;

const contents = fs.readFileSync('tinyHighlights.htm', {encoding: 'utf8'});

let $ = cheerio.load(contents);

const parsed = scrapeIt.scrapeHTML($, {
  highlights: {
    listItem: '.highlight',
  },
  meta: {
    listItem: '.bookMain',
    data: {
      title: {
        selector: '.title',
      },
      author: {
        selector: '.author',
        convert: _ => _.split(' ').slice(1).join(' '),
      },
      nHighlights: {
        selector: 'span[class*=highlightCount]',
        convert: _ => parseInt(_),
      },
    },
  },
});

log(parsed);


