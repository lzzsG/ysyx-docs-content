import { defineConfig } from 'vitepress'
import { chineseSearchOptimize, pagefindPlugin } from 'vitepress-plugin-pagefind'

// function chineseSearchOptimize(input: string) {
//   const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' })
//   const result: string[] = []
//   for (const it of segmenter.segment(input)) {
//     if (it.isWordLike) {
//       result.push(it.segment)
//     }
//   }
//   return result.join(' ')
// }

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-cn',
  base: '/ysyx-docs-content/',
  title: "Lzzs",
  vite: {
    plugins: [pagefindPlugin({
      customSearchQuery: chineseSearchOptimize,
      btnPlaceholder: '搜索',
      placeholder: '搜索文档',
      emptyText: '空空如也',
      heading: '共: {{searchResult}} 条结果',
      filter(searchItem, idx, originArray) {
        console.log(searchItem)
        return !searchItem.route.includes('404')
      }
    })],
  },
  description: "A VitePress Site ,for Lzzs CS000 Notebook",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    nav: [

      {
        text: 'Dropdown Menu',
        items: [
          {
            text: 'Item A1', items: [
              { text: 'Section A Item A', link: '/item-3' }]
          },
          { text: 'Item B', link: '/item-3' },
          { text: 'Item C', link: '/item-3' }
        ]
      },
    ],
    logo: '/favicon.svg',  // 替换为你的logo
    // siteTitle: '----',  // 可自定义标题，不设置则默认为title

    footer: {
      // message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Lzz'
    },
    sidebar: [
      {
        "text": "ysyx",

        "items": [
          {
            "text": "index",
            "link": "/index"
          },
          {
            "text": "preliminary",
            "items": [
              {
                "text": "preliminary",
                "link": "/zh/preliminary/preliminary"
              },
              {
                "text": "HowToAskSmartQuestion",
                "link": "/zh/preliminary/HowToAskSmartQuestion"
              },
              {
                "text": "LinuxSystemInstallationAndBasicUsage",
                "link": "/zh/preliminary/LinuxSystemInstallationAndBasicUsage"
              },
              {
                "text": "RecapCLanguage",
                "link": "/zh/preliminary/RecapCLanguage"
              },
              {
                "text": "SetupVerilatorSimulationEnvironment",
                "link": "/zh/preliminary/SetupVerilatorSimulationEnvironment"
              },
              {
                "text": "DigitalCircuitBasicExperiment",
                "link": "/zh/preliminary/DigitalCircuitBasicExperiment"
              },
              {
                "text": "CompletePA1",
                "link": "/zh/preliminary/CompletePA1"
              },
              {
                "text": "SubmitDefense",
                "link": "/zh/preliminary/SubmitDefense"
              }
            ]
          }
          ,
          {

            "text": "basic",
            "items": [
              {
                "text": "basic",
                "link": "/zh/basic/basic"
              },
              {
                "text": "NEMUWithRV32IMSupport",
                "link": "/zh/basic/NEMUWithRV32IMSupport"
              },
              {
                "text": "SimpleProcessorWithRTL",
                "link": "/zh/basic/SimpleProcessorWithRTL"
              },
              {
                "text": "RuntimeAndInfra",
                "link": "/zh/basic/RuntimeAndInfra"
              },
              {
                "text": "SingleCycleNPCSupportingRV32E",
                "link": "/zh/basic/SingleCycleNPCSupportingRV32E"
              },
              {
                "text": "DeviceAndInputOutput",
                "link": "/zh/basic/DeviceAndInputOutput"
              },
              {
                "text": "Bus",
                "link": "/zh/basic/Bus"
              },
              {
                "text": "SoCComputerSystem",
                "link": "/zh/basic/SoCComputerSystem"
              },
              {
                "text": "PerfOptimizationAndSimpleCache",
                "link": "/zh/basic/PerfOptimizationAndSimpleCache"
              },
              {
                "text": "ProcessorWithPipeline",
                "link": "/zh/basic/ProcessorWithPipeline"
              }
            ]
          }
          ,
          {
            "text": "advanced",
            "items": [
              {
                "text": "Bus",
                "link": "/zh/advanced/Bus"
              },
              {
                "text": "SoCComputerSystem",
                "link": "/zh/advanced/SoCComputerSystem"
              },
              {
                "text": "advanced",
                "link": "/zh/advanced/advanced"
              },
              {
                "text": "MultiplierDivider",
                "link": "/zh/advanced/MultiplierDivider"
              },
              {
                "text": "MultiplierDividerFunctionalUnit",
                "link": "/zh/advanced/MultiplierDividerFunctionalUnit"
              },
              {
                "text": "UserProgramAndSystemCall",
                "link": "/zh/advanced/UserProgramAndSystemCall"
              },
              {
                "text": "FancyUserProgram",
                "link": "/zh/advanced/FancyUserProgram"
              },
              {
                "text": "IntroToCache",
                "link": "/zh/advanced/IntroToCache"
              },
              {
                "text": "PerfProfiler",
                "link": "/zh/advanced/PerfProfiler"
              },
              {
                "text": "PipelinedProcessor",
                "link": "/zh/advanced/PipelinedProcessor"
              }

            ]
          }
          ,

          {
            "text": "specialist",
            "items": [
              {
                "text": "specialist",
                "link": "/zh/specialist/specialist"
              }
            ]
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/lzzsG/VitePress-template' }
    ],
    search: {
      provider: 'local'
    }


  },
  rewrites: {
    'md': '1/md',  // 可以在这重定向
  },
  cleanUrls: true,
  markdown: {
    math: true   // 数学公式，需要 npm add -D markdown-it-mathjax3

  }
})
