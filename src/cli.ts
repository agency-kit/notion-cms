#!/usr/bin/env node

import sade from 'sade'
import * as prompts from '@clack/prompts'
import { z } from "zod";
import NotionCMS from './notion-cms';
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JS_CONFIG = path.resolve(process.cwd(), `ncms.config.mjs`)
const TS_CONFIG = path.resolve(process.cwd(), `ncms.config.ts`)
const CONFIG_PATH = fs.existsSync(TS_CONFIG) ? TS_CONFIG : JS_CONFIG

const NCMSConfig = z.object({
  databaseId: z.string().uuid(),
  pageId: z.string().uuid(),
  mode: z.union([
    z.literal('database'),
    z.literal('page')
  ]),
  cacheUrl: z.string().url()
}).required({ databaseId: true });

type NCMSConfig = z.infer<typeof NCMSConfig>;

const getUUIDfromNotionUrl = NotionCMS._parseNotionEntityLink

function writeToConfig(config: NCMSConfig, property: string, value: any): void {
  const updatedConfig = structuredClone(config)
  updatedConfig[property as keyof NCMSConfig] = value
  try {
    fs.writeFileSync(CONFIG_PATH, `
export default {
  "databaseId": "${updatedConfig['databaseId']}",
  "mode": "${updatedConfig['mode']}"
}`)
  } catch (e) {
    throw new Error(`Could not write to ${CONFIG_PATH}: ${e}`)
  }
}

function makeConfig(): void {
  try {
    fs.writeFileSync(JS_CONFIG, `
export default {
  "databaseId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "mode": "database"
}`)
  } catch (e) {
    throw new Error(`Could not write a new config at ${JS_CONFIG}, ${e}`)
  }
}

async function findConfig(optionalPath?: string, initialized?: boolean): Promise<{ default: NCMSConfig }> {
  try {
    return optionalPath ? await import(optionalPath) : await import(CONFIG_PATH)
  } catch (e) {
    if (initialized) throw new Error(`Could not find config at ${CONFIG_PATH}, ${e}`)
    makeConfig()
    return findConfig(optionalPath, true)
  }
}

async function setDatabaseInConfig(link?: string, options?: { c: string }) {
  let uuid
  if (!link) {
    const meaning = await prompts.text({
      message: 'Paste a link to this project\'s database.',
      placeholder: 'Go to Notion -> Desired DB -> ... -> copy link to DB/view',
      initialValue: '',
      validate(value) {
        uuid = getUUIDfromNotionUrl(value)
        if (!z.string().uuid().safeParse(uuid).success) {
          prompts.cancel(`Invalid UUID extracted. Please try again with a different link.`)
          process.exit(1)
        }
      },
    })
    if (prompts.isCancel(meaning)) {
      prompts.cancel('Operation cancelled.')
      process.exit(0)
    }
  } else {
    uuid = getUUIDfromNotionUrl(link)
  }
  try {
    const { default: config } = await findConfig(options?.c)
    // Improve this to take a map of updates
    writeToConfig(config, 'databaseId', uuid)
  } catch (e) {
    throw new Error(`Could not add database to config from provided link, ${e}`)
  }
}

const ncms = sade('ncms');

ncms
  .version('0.4.0')
  .describe(`
              ╭━╮╱╭╮╱╱╭╮╱╱╱╱╱╱╱╱╭━━━┳━╮╭━┳━━━╮
              ┃┃╰╮┃┃╱╭╯╰╮╱╱╱╱╱╱╱┃╭━╮┃┃╰╯┃┃╭━╮┃
              ┃╭╮╰╯┣━┻╮╭╋┳━━┳━╮╱┃┃╱╰┫╭╮╭╮┃╰━━╮
              ┃┃╰╮┃┃╭╮┃┃┣┫╭╮┃╭╮╮┃┃╱╭┫┃┃┃┃┣━━╮┃
              ┃┃╱┃┃┃╰╯┃╰┫┃╰╯┃┃┃┃┃╰━╯┃┃┃┃┃┃╰━╯┃
              ╰╯╱╰━┻━━┻━┻┻━━┻╯╰╯╰━━━┻╯╰╯╰┻━━━╯
              -------------------------------
        Give Notion super powers by turning it into a 
        full-fledged headless Content Management System.
`)
  .option('-c, --config', 'Provide path to custom config')

ncms
  .command('remote')
  .action(async () => {
    try {
      const { default: config } = await findConfig()
      // Improve this with a console.table
      if (config?.databaseId) console.log(`db: ${config?.databaseId}`)
      if (config?.pageId) console.log(`page: ${config?.pageId}`)
    } catch (e) {
      prompts.cancel(`Unable to locate remote properties. Did you set them in your ncms.config.mjs?`)
      process.exit(1)
    }
  })

ncms
  .command('remote add db [link]')
  .alias('remote db')
  .describe('Set the project database by pasting a Notion link')
  .example('remote add db')
  .example('remote add db https://www.notion.so/3ae516b8911542339e250e019933fa95?v=209c923332694fa3810b1e3c36a77338')
  .action(async (link, opts) => {
    await setDatabaseInConfig(link, opts)
  })

ncms
  .command('remote add page [link]')
  .alias('remote pg')
  .describe('Adds a working page id that your NotionCMS database will live in.')
  .example('')
  .action((link, opts) => {
    console.log('> these are extra opts', opts)
  })

ncms
  .command('remote add integration [key]')
  .alias('remote ig')
  .describe('Adds the provided Notion integration API key to your .env file')
  .example('remote ig')
  .example('remote add integration')
  .example('remote add integration secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  .action((key) => {

  })

ncms
  .command('cache add [path]')
  .describe('Add a custom path for the NotionCMS cache.')
  .example('add cache ./lc/cache.json')
  .example('add cache ./lc')
  .action((path) => {

  })

ncms
  .command('cache clear')
  .describe('Clear the local cache, based on settings in config.')
  .example('add cache ./lc/cache.json')
  .action(() => {

  })

ncms
  .command('new')
  .describe('Scaffold a new NotionCMS project from scratch.')
  .option('-o, --output', 'Change the name of the output file', 'bundle.js')
  .example('new --config my-conf.js')
  .action(async (src, dest, opts) => {
    await prompts.group(
      {
        db: () => setDatabaseInConfig(),
        age: () => prompts.text({ message: 'What is your age?' }),
        color: ({ results }) =>
          prompts.multiselect({
            message: `What is your favorite color?`,
            options: [
              { value: 'red', label: 'Red' },
              { value: 'green', label: 'Green' },
              { value: 'blue', label: 'Blue' },
            ],
          }),
      },
      {
        // On Cancel callback that wraps the group
        // So if the user cancels one of the prompts in the group this function will be called
        onCancel: ({ results }) => {
          prompts.cancel('Operation cancelled.');
          process.exit(0);
        },
      }
    );
    // set db

    // pull in data from config

    // build new NotionCMS with params and data

  })

ncms
  .command('push')
  .action(() => {


  })

ncms.parse(process.argv)
