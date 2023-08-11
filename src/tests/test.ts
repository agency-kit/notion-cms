import { TestNotionCMS } from './notion-cms.spec'
import {
  PluginsCustom,
  PluginsCustomFallback,
  PluginsDefault,
  PluginsDefaultOther,
} from './custom-render.spec'
import { TestLimiter } from './limiter.spec'
import { TestNotionCMSCache } from './notion-cms-caching.spec'

TestNotionCMS.run()

TestLimiter.run()

PluginsDefault.run()
PluginsDefaultOther.run()
PluginsCustom.run()
PluginsCustomFallback.run()

TestNotionCMSCache.run()
