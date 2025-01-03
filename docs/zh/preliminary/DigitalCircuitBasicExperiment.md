---
sidebar_position: 5
---
# 数字电路基础实验


数字电路是"一生一芯"的前导课程, 我们列出了一些需要大家掌握的知识点,
大家不仅需要知道它们的概念, 还需要学会使用硬件描述语言来实现其中的电路模块.
* 信息的二进制编码
* 组合逻辑设计: 多路选择器, 译码器, 优先编码器, 加法器, 比较器
* 时序逻辑设计: 时钟, D触发器, 计数器, SRAM和DRAM, 有限状态机, 时序分析

:::info
[数字电路学习资料]
* [数字电路与计算机体系结构][book] 1-5章节
* [Verilog在线学习网站][hdlbits]，推荐边看书边练手
* [中科大的Verilog OJ平台][ustc verilog oj](需要注册并登录)，推荐边看书边练手
* Verilog高级数字系统设计技术与案例分析
:::
[book]: https://pages.hmc.edu/harris/ddca/ddcarv.html

:::info
[Chisel学习资料]
建议按照如下顺序学习:
1. [Chisel Bootcamp][bootcamp]是一个很不错的chisel教程, 还支持在线运行chisel代码,
你可以一边编写chisel代码一边学习. 其中
   * 第1章是scala入门
   * 第2章是chisel基础
   * 第3章是scala高级特性和chisel的混合使用
   * 第4章是FIRRTL后端相关内容
你需要完成前两章的学习, 同时我们强烈建议你学习第3章.
第4章和本课程没有直接关系, 可以作为课外阅读材料.
1. [Chisel Users Guide][users guide]比较系统地整理了chisel的特性, 也是不错的入门教程.
1. [Chisel小抄][cheatsheet]简明地列出了chisel语言的大部分用法.
1. [Digital Design with Chisel][chisel textbook]是一本结合数字逻辑设计和Chisel的参考书.
1. [Chisel API][api]详细地列出了chisel库的所有API供参考.

然后尝试使用Chisel来完成上述数字电路实验,
你只需要把编译出的verilog代码接入verilator和NVBoard就可以了.

欢迎加入Chisel交流群（微信扫描下方二维码联系助教进群）
![Wang Rui](/ysyx-img/zh/preliminary/wangrui.jpg)
:::
[bootcamp]: https://mybinder.org/v2/gh/freechipsproject/chisel-bootcamp/master
[users guide]: https://www.chisel-lang.org/docs
[cheatsheet]: https://github.com/freechipsproject/chisel-cheatsheet/releases/latest/download/chisel_cheatsheet.pdf
[chisel textbook]: http://www.imm.dtu.dk/~masca/chisel-book.html
[api]: https://www.chisel-lang.org/api/latest/

:::info
[verilog学习资料]
我们需要培养的是硬件思维，需要头脑中先有电路再下手写代码，verilog的本质是硬件描述语言而不是硬件设计语言，大家可以看[verilog入门视频][verilog1]和[语法简介][verilog2]进行入门.
:::
[verilog1]: https://www.bilibili.com/video/BV1PS4y1s7XW
[verilog2]: https://vlab.ustc.edu.cn/guide/doc_verilog.html



:::info
[vscode自动跳转插件]
* 如果选择chisel编程，推荐metals插件
* 如果选择verilog编程，推荐[digital ide](https://digital-eda.github.io/DIDE-doc-Cn/#/?id=digital-ide-version-030)插件
:::
[hdlbits]: https://hdlbits.01xz.net/wiki/Main_Page
[ustc verilog oj]: https://verilogoj.ustc.edu.cn/oj/

:::warning
[借助NVBoard完成数字电路实验]
我们首先推荐南京大学的[数字电路与计算机组成实验][dlco].

南京大学开展教学改革, 将"数字电路"与"计算机组成原理"两门课程进行融合,
其实验内容贯穿从数字电路基础到简单的处理器设计,
最近尝试加入程序运行时环境的相关内容, 与"一生一芯"的主线内容非常契合.

<!-- > 你需要完成"CPU数据通路"之前的大部分实验内容, 除了以下例外
> * "在线测试"的内容需要加入相关课程才能完成, 目前可以忽略
> * 计数器和时钟: 由于仿真环境下无法提供精确的时钟,
>   时钟部分的实验难以准确进行, 因此可作为阅读材料进行了解
> * 寄存器组及存储器: 讲义中建议通过工具相关的IP核实现存储器,
>   但仿真环境下不存在这样的IP核, 无法开展实验, 因此可作为阅读材料进行了解
> * VGA接口控制器实现:对于初学verilog的同学来说项目内容偏多，如果学有余力可以做完
> * 关于"CPU数据通路"及其后续内容, "一生一芯"将会有所改动, 因此在预学习阶段无需完成 -->
以下部分是**必做题**：
* 实验一 选择器
* 实验二 译码器和编码器
* 实验三 加法器与ALU
* 实验六 移位寄存器及桶形移位器
* 实验七 状态机及键盘输入

其他内容作为了解可以选做，在预学习部分不作规定。 有了NVBoard之后, 你就可以把它当作FPGA来使用, 用它来实现需要FPGA支持的实验内容.
:::

[dlco]: https://nju-projectn.github.io/dlco-lecture-note/index.html

:::warning
[评估电路综合后的时序]
我们提供了一个基于开源EDA的综合后时序评估项目.
这个项目通过[开源RTL综合器yosys][yosys]对RTL设计进行综合, 并映射到一个45nm的[开源工艺库nangate45][nangate45],
然后将综合得到的网表文件和工艺库中的标准单元信息文件输入到[开源静态时序分析工具iSTA][ista]中,
iSTA将快速评估RTL设计中的时序路径, 并给出时序余量最少的若干条路径, 供RTL设计者参考,
关于报告如何阅读, 可以参考[这个教程][ista-tutorial].
通过上述方式, RTL设计者可快速得知RTL设计的时序情况, 并对RTL设计进行快速迭代.

你可以通过以下命令克隆该项目, 具体操作方式请阅读项目中的README.
```bash
git clone git@github.com:OSCPU/yosys-sta.git
```

尝试用上述项目评估你的数字电路实验.
:::
:::danger
[评估过程中遇到问题]
如果在运行时遇到bug，可到`yosys-sta`仓库的Issue中报告问题，并提供如下信息：
* 相应的RTL设计
* sdc文件
* yosys生成的网表文件
* iEDA的版本号, 可通过命令`echo exit | ./bin/iEDA -v`获取
:::
[yosys]: https://yosyshq.net/yosys
[nangate45]: https://mflowgen.readthedocs.io/en/latest/stdlib-freepdk45.html
[ista]: https://github.com/OSCC-Project/iEDA/tree/master/src/operation/iSTA
[ista-tutorial]: https://ieda.oscc.cc/tools/ieda-tools/ista.html

:::info
[开源EDA工具的局限性]
当然, 上面的评估项目也不是完美的, 至少从目前来说有以下缺陷:
* 开源综合器yosys的综合质量不高, 根据开源EDA团队的评估工作,
  对于某RTL设计, yosys综合出的标准单元面积是商业综合器的1.8倍,
  商业综合器综合出的电路频率是153.8MHz, 而yosys综合出的电路频率只有52MHz
* nangate45是一个面向学术研究的工艺库, 其中标准单元的数量和质量也与商业工艺库有一定差距
* nangate45不能用于流片, 没有工厂将其用于产线中

不过, 在综合后时序评估这一场景中, 上述缺陷不会造成明显的影响:
即使yosys的综合质量不高, 我们也可以通过综合结果的相对提升, 来指导RTL优化的方向.
:::
<!-- -->
:::info
[所以学习"一生一芯"还需要FPGA吗?]
基本上不需要了:
* 从准确度来说, yosys的综合流程是面向ASIC设计的, 相比于FPGA流程, 其原理和报告的准确度都更适合"一生一芯".
* 从时间来说, FPGA的主要作用是仿真加速, 也就是说, 如果仿真任务并不需要花费很长时间来完成, 使用FPGA的优势并不明显.
  事实上, 从仿真流程来看, 当以下不等式成立时, FPGA的优势才能体现出来:
  ```
  FPGA_syn_time + FPGA_impl_time + FPGA_run_time < verilator_compile_time + verilator_run_time
  ```
  `FPGA_syn_time + FPGA_impl_time`通常达到小时量级, 而`verilator_compile_time`通常能在数分钟内完成,
  因此, 只有当`verilator_run_time`达到小时量级, 上述不等式才有可能成立.
  不过在"一生一芯"的学习中, 你很难遇到需要小时量级的时间才能完成的仿真任务.
  而当你遇到这样的任务时, 我们也会对FPGA的评估过程提出更高的要求.
  我们会在后续讲义中继续讨论这个问题.
* 从调试难度来说, FPGA的调试手段很有限, 只能在时间和空间均受限的条件下抓取底层的波形信息;
  相反, 软件仿真则灵活很多, 我们可以借助很多软件方法来从多方面提升调试的效率.
:::
