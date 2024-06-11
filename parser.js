import fs from 'fs/promises'
import csv from 'fast-csv'
import { createWriteStream } from 'fs'
import path from 'path'
import { flatten } from 'flat'

const formatCsvData = async (data, filePath) => {
  return new Promise((resolve, reject) => {
    const csvStream = csv.format({ headers: true })
    const writeStream = createWriteStream(filePath)
    csvStream
      .pipe(writeStream)
      .on('error', error => {
        console.error(`Error writing CSV file: ${error.message}`)
        reject(error)
      })
      .on('finish', () => {
        console.log('CSV formatting complete.')
        resolve('CSV formatting complete.')
      })
    data.forEach(item => {
      csvStream.write(item)
    })
    csvStream.end()
  })
}

const flattenObject = obj => {
  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    return flatten(obj)
  }
  if (Array.isArray(obj)) {
    const arr = []
    obj.forEach(item => {
      arr.push(flatten(item))
    })
    return arr
  }
}
const flattenJSONs = async json_path => {
  try {
    const files = await fs.readdir(json_path)
    const dataArr = []
    for (const file of files.filter(el => el.includes('.json'))) {
      const data = await fs.readFile(path.join(json_path, file), 'utf-8')
      const flattedObj = flattenObject(JSON.parse(data))
      if (!flattedObj) {
        continue
      }
      if (Array.isArray(flattedObj)) {
        dataArr.push(...flattedObj)
      } else {
        dataArr.push(flattedObj)
      }
    }
    console.log('JSONs flattened to array')
    return dataArr
  } catch (err) {
    console.error(`Error reading JSON files: ${err.message}`)
  }
}

export const saveJSONSToCSV = async (json_path, csv_path) => {
  const dataArr = await flattenJSONs(json_path)
  await formatCsvData(dataArr, csv_path)
}
const args = process.argv.slice(2)
if (args.length < 2) {
  console.error(
    "\x1b[31mPlease provide path to the JSONs folder and path to save the output CSV file\nEx: './data' './data.csv'\x1b[0m"
  )
  process.exit()
}
