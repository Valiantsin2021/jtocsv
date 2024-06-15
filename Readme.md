# Jtocsv (JSON to CSV parser)

[![CI](https://github.com/Valiantsin2021/jtocsv/actions/workflows/ci.yml/badge.svg)](https://github.com/Valiantsin2021/jtocsv/actions/workflows/ci.yml)

Jtocsv is an npm package that reads the JSON files from a folder path, parses and flattens the data and combines the data in the output CSV file. It provides flexibility through command-line arguments. CSV headers are formed on flattened JSONs keys.

## Installation

```bash
npm install -g jtocsv
```

### Usage

```bash
jtocsv [options]
```

### Command-Line Options

#### 

- path: (Required) Path to the folder containing JSON files (objects or JSON arrays).

- path: (Required) Path to the output CSV file.

  
### Examples

Read all JSON files and save the parsed data to CSV file:

```bash
jtocsv /path/to/jsons /path/to/output.csv
```

Inline

```bash
import { saveJSONSToCSV } from 'jtocsv/parser.js'
await saveJSONSToCSV('json_path', 'csv_path')
```

### Contributing

Contributions are welcome! 
