'use strict';

const cheerio = require('cheerio');
const fs = require('fs');
const scrapeIt = require('scrape-it');

const contents = fs.readFileSync('tinyHighlights.htm', {encoding: 'ascii'});

// const log = _ => console.log();

const {log} = console;

log(contents);


