'use strict';

const cheerio = require('cheerio');
const fs = require('fs');
const scrapeIt = require('scrape-it');

const {log} = console;

const contents = fs.readFileSync('biggerHighlights.htm', {encoding: 'utf8'});

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

const highlights = parsed.highlights;
const bucketSizes = parsed.meta.map(_ => _.nHighlights);
const bucketed = bucketHighlights(highlights, bucketSizes);

const database = createDatabase(bucketed, parsed.meta);

fs.writeFileSync('database.json', JSON.stringify(database, null, '\t'));

function createDatabase(bucketed, meta) {
  if (bucketed.length !== meta.length) {
    throw 'bucketed and meta must have same length';
  }

  let database = [];
  for (let i = 0; i < bucketed.length; ++i) {
    const title = meta[i].title;
    const author = meta[i].author;
    bucketed[i].forEach(quote => {
      const entry = {
        quote,
        title, 
        author,
      };
      database.push(entry);
    });
  }
  return database;
}

function bucketHighlights(highlights, bucketSizes) {
  let buckets = [];
  bucketSizes.forEach(size => buckets.push(unshiftN(highlights, size)));
  return buckets;
}

function unshiftN(arr, n) {
  let result = [];
  for (let i = 0; i < n; ++i) {
    result.push(arr.shift());
  }
  return result;
}

