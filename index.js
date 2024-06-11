#!/usr/bin/env node

import { saveJSONSToCSV } from './parser.js'
const args = process.argv.slice(2)
await saveJSONSToCSV(...args)
