import fs from 'fs/promises'
import csv from 'fast-csv'
import { createWriteStream } from 'fs'
import path from 'path'
import { flatten } from 'flat'

/**
 * Asynchronously formats CSV data and writes it to a file.
 *
 * @param {Array} data - The array of data to be formatted.
 * @param {string} filePath - The file path where the CSV will be written.
 * @returns {Promise} A promise that resolves when the CSV formatting is complete.
 */
export const formatCsvData = async (data, filePath) => {
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

/**
 * Flattens an object or an array of objects recursively.
 *
 * @param {Object|Array} obj - The object or array to flatten.
 * @param {Object} opts - Optional options object.
 * @return {Object|Array} The flattened object or array. If the input is an object,
 *                        the result is a flattened object. If the input is an array,
 *                        the result is an array of flattened objects.
 */
export const flattenObject = (obj, opts = {}) => {
  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    return flatten(obj, opts)
  }
  if (Array.isArray(obj)) {
    const arr = []
    obj.forEach(item => {
      arr.push(flatten(item, opts))
    })
    return arr
  }
}

/**
 * Asynchronously finds the largest file in an array of files.
 *
 * @param {Array<string>} files - The array of file paths.
 * @param {string} dir - The directory path.
 * @return {Promise<string>} A Promise that resolves to the path of the largest
 * file.
 */
export const findLargestFile = async (dir, files) => {
  let largestFile = { name: '', size: 0 }

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stats = await fs.stat(filePath)

    if (stats.size > largestFile.size) {
      largestFile = { name: filePath, size: stats.size }
    }
  }
  console.log('Largest JSON file:', largestFile.name)
  return largestFile.name
}

/**
 * Moves a specific string to the beginning of the array.
 *
 * @param {string[]} arr - The array of strings.
 * @param {string} str - The string to move to the beginning.
 * @returns {string[]} The modified array with the specified string at the beginning.
 */
function moveToBeginning(arr, str) {
  const fileName = str.split('\\').at(-1)
  const index = arr.indexOf(fileName)
  if (index > -1) {
    arr.splice(index, 1)
    arr.unshift(fileName)
  }
  return arr
}

/**
 * Asynchronously reads all JSON files from a given path and returns an array of
 * flattened objects.
 *
 * @param {string} json_path - The path to the folder containing JSON files.
 * @return {Promise<Array>} A Promise that resolves to an array of flattened
 * objects.
 */
export const flattenJSONs = async json_path => {
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
  let jsonFiles = files.filter(el => el.toLowerCase().includes('.json'))
  if (jsonFiles.length === 0) {
    console.log('No JSON files found with the path: ', json_path)
    process.exit()
  }
  const largest = await findLargestFile(json_path, jsonFiles)
  jsonFiles = moveToBeginning(jsonFiles, largest)
  console.log(jsonFiles)
  for (const file of jsonFiles) {
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

/**
 * Asynchronously saves JSONs data from a given path to a CSV file at a specified path.
 *
 * @param {string} json_path - The path to the folder containing JSON files.
 * @param {string} csv_path - The path to the output CSV file.
 * @return {Promise<void>} A Promise that resolves when the JSON data has been saved to the CSV file.
 */
export const saveJSONSToCSV = async (json_path, csv_path) => {
  const dataArr = await flattenJSONs(json_path)
  await formatCsvData(dataArr, csv_path)
}
