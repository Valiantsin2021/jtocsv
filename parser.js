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
  let files
  try {
    files = await fs.readdir(json_path)
  } catch (err) {
    console.error(
      'Error reading files from folder:',
      json_path,
      `error: ${err.message}`
    )
  }
  const dataArr = []
  if (files.length === 0) {
    console.log('No JSON files found with the path: ', json_path)
    process.exit()
  }
  for (const file of files.filter(el => el.includes('.json'))) {
    let data
    try {
      data = await fs.readFile(path.join(json_path, file), 'utf-8')
    } catch (err) {
      console.error('Error reading file: ', file, `Error: ${err.message}`)
    }
    try {
      const flattedObj = flattenObject(JSON.parse(data))
      if (!flattedObj) {
        continue
      }
      if (Array.isArray(flattedObj)) {
        dataArr.push(...flattedObj)
      } else {
        dataArr.push(flattedObj)
      }
    } catch (err) {
      console.error('Error flattening file: ', file, `Error: ${err.message}`)
    }
  }
  console.log('JSONs flattened to array')
  return dataArr
}

export const saveJSONSToCSV = async (json_path, csv_path) => {
  const dataArr = await flattenJSONs(json_path)
  await formatCsvData(dataArr, csv_path)
}
