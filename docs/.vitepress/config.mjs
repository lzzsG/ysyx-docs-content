import { defineConfig } from 'vitepress'
import path from 'path';


// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/ysyx-docs-content/',
  title: "Lzzs",
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
      { text: 'Home', link: 'https://lzzs.fun' },
      { text: 'Blog', link: 'https://lzzs.fun/blog' },
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

    resolve: {
      alias: {
        '/ysyx-img/': path.resolve(__dirname, '../ysyx-img/'), // 指向 docs/ysyx-img 目录
      },
    },

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
            "link": "/zh/index"
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
