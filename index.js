#!/usr/bin/env node

import { saveJSONSToCSV } from './parser.js'
const args = process.argv.slice(2)
if (args.length < 2) {
  console.error(
    "\x1b[31mPlease provide path to the JSONs folder and path to save the output CSV file\nEx: './data' './data.csv'\x1b[0m"
  )
  process.exit()
}
await saveJSONSToCSV(...args)
