#!/usr/bin/env node

import { saveJSONSToCSV } from './parser.js'
const args = process.argv.slice(2)

function showHelp() {
  console.log(`
Usage: npx jtocsv [options]

Options:
-h, --help      Show help message
path           Path to the JSONs folder
output         Path to save the output CSV file

Examples:
npx jtocsv ./data ./data.csv
`)
}
function handleArgs() {
  if (args.includes('-h') || args.includes('--help')) {
    showHelp()
    process.exit(0)
  }

  console.log('No arguments provided. Try -h or --help for usage information.')
}

handleArgs()
if (args.length < 2) {
  console.error(
    "\x1b[31mPlease provide path to the JSONs folder and path to save the output CSV file\nEx: './data' './data.csv'\x1b[0m"
  )
  process.exit()
}
await saveJSONSToCSV(...args)
