---
sidebar_position: 4
---

# 支持RV32E的单周期NPC

有了对运行时环境的基本认识, 你就知道应该给NPC提供怎么样的运行时环境来支撑程序的运行了.
由于B阶段的目标是帮助大家建立对处理器芯片的基本认识, 因此我们弱化了B阶段的性能指标,
在此基础上, 我们可以通过降低设计的复杂度来节省流片成本, 使得相同面积可容纳更多同学的设计.
因此, 目前我们让NPC采用RV32E指令集; 在A阶段的后期启动Linux时, 我们将逐步采用RV64IMAC指令集.

需要说明的是, 虽然NEMU采用RV32IM, 与NPC采用的RV32E有所不同,
但RV32E的程序可以直接运行在RV32IM的处理器上.
因此, 只要我们确保已经将程序编译到RV32E,
即使我们把RV32IM的NEMU作为DiffTest的REF, 也可以正常工作.

:::tip
[我从第五期转入, 如何将RV64IM修改为RV32E?]
修改为RV32E需要进行如下操作:
* NEMU - 可通过`make menuconfig`将`Base ISA`改为`riscv32`,
  然后在`nemu/src/isa/riscv32`下实现RV32IM即可.
  部分RV32指令的语义与RV64所有不同, 我们建议你依照手册重新实现一遍, 保证对指令的理解无误.
* AM - 支持RV32E需要改动较多内容, 我们建议你重新克隆`abstract-machine`, 具体操作如下:
  1. 把`ysyx-workbench/abstract-machine`拷贝到其他目录
  1. 删除`ysyx-workbench/abstract-machine`目录
  1. 修改`ysyx-workbench/init.sh`文件如下:
     ```diff
     --- ysyx-workbench/init.sh
     +++ ysyx-workbench/init.sh
     @@ -45,4 +45,4 @@
        abstract-machine)
     -    init NJU-ProjectN/abstract-machine ysyx2204 abstract-machine true AM_HOME
     +    init NJU-ProjectN/abstract-machine ics2023 abstract-machine true AM_HOME
          init NJU-ProjectN/fceux-am ics2021 fceux-am false
          ;;
     ```
  1. 运行`bash init.sh abstract-machine`
  1. 可参考已经拷贝到其他目录的`abstract-machine`将相应代码拷贝回来
  1. 删除已经拷贝到其他目录的`abstract-machine`
* NPC - 直接修改RTL实现即可
:::
## 搭建面向riscv32e-npc的运行时环境

AM项目已经提供了riscv32e-npc的基本框架, 你只需要在`am-kernels/tests/cpu-tests/`目录下执行
```bash
make ARCH=riscv32e-npc ALL=xxx
```
即可将名为`xxx`的测试编译到`riscv32e-npc`的运行时环境中.
为了熟悉流程, 我们先尝试在NPC中运行dummy程序.

:::warning
[从命令行中读入NPC需要执行的程序]
接下来我们将会在NPC中不断地运行各种程序, 如果每次运行新程序都要重新编译NPC, 效率是很低的.
为了提高效率, 我们可以让仿真环境从命令行中读入程序的路径, 然后把程序内容放置到存储器中.
:::
<!-- -->
:::tip
[程序在哪里? 应该如何读入到仿真环境中?]
如果你仍然对这些感到疑惑, 说明你之前并没有完全理解NEMU是如何读入程序的.
:::
<!-- -->
:::warning
[一键编译并在NPC上运行AM程序]
在AM项目中, Makefile并没有为`riscv32e-npc`提供`run`目标. 尝试为`riscv32e-npc`提供`run`目标,
使得键入`make ARCH=riscv32e-npc ALL=xxx run`即可把AM程序编译并在NPC上运行.
:::
为了运行dummy程序, NPC还需要实现一些指令. 具体地
* `auipc`, `lui`: 它们属于整数计算指令, 思考一下, 如何让这些指令与`addi`共享同一个加法器?
* `jal`, `jalr`: 它们属于条无条件跳转指令, 执行之后, PC将会被修改, 这应该如何实现?
* `sw`: 这条指令需要访存内存, 不过对于dummy程序来说, 不实现这条`sw`指令也不影响运行的结果.
  因此目前你可以将它实现成空指令, 我们会在后面再来正确地实现它.

:::warning
[如果你是初学者, 尝试自己画出架构图]
如果你是处理器设计的初学者, 尝试在之前的架构图上添加`auipc`, `lui`, `jal`, `jalr`的电路.
:::
<!-- -->
:::warning
[在NPC上运行dummy程序]
实现上述指令, 使得NPC可以运行dummy程序.
不过目前`riscv32e-npc`的`halt()`函数是一个死循环,
你可以通过查看波形来检查NPC是否成功进入了`halt()`函数.
:::
<!-- -->
:::warning
[实现riscv32e-npc中的halt()函数]
为了可以自动地结束程序, 你需要在`riscv32e-npc`中实现TRM的halt()函数, 在其中添加一条`ebreak`指令.
这样以后, 在NPC上运行的AM程序在结束的时候就会执行`ebreak`指令, 从而通知NPC的仿真环境结束仿真.

实现之后, 你就可以通过一条命令自动在NPC上运行AM程序并自动结束仿真了.
:::
<!-- -->
:::warning
[为NPC实现HIT GOOD/BAD TRAP]
NEMU可以输出"程序是否成功结束执行"的信息, 尝试在NPC中实现相似的功能,
这样以后, 你就可以知道程序在NPC上是否成功结束了.
:::
## 为NPC搭建基础设施

通过完成PA, 你应该意识到基础设施的重要性了.
在PA中有四大基础设施: sdb, trace, native, DiffTest.
除了native属于AM之外, 其余三大基础设施都可以在NPC中搭建.

:::danger
[我都能看波形了, 为什么还需要这些基础设施?]
这是希望大家不要沦为工具人, 从而浪费生命.

波形确实包含了电路中所有信号每个周期的信息, 但这些信息太底层了,
它们无法携带任何高层的语义, 导致需要用户自己从这些海量信息之中寻找错误.

事实上, bug引发的错误, 在不同的抽象层次中都是有表现的,
例如RTL的实现中连错了一个信号, 反映到程序运行中,
可能是取到了错误的指令, 访问了非法内存, 或者是从函数返回到一个不正确的位置...
虽然你最终也能从0和1变化的波形中分析出这些错误,
但如果你可以直接从itrace/mtrace/ftrace的输出中发现问题, 不是更香吗?
为什么你要浪费这么多时间来做这些工具本来就做得很好的事情呢?
况且, 如果这个bug是软件层次的问题, 看波形来调试不是自找麻烦吗?

科学的调试过程首先需要理解程序如何在计算机上运行,
此外还需要理解各种工具的优缺点, 根据不同的场景选择正确的工具来分析问题.
根据计算机系统的抽象层视角, 我们可以从不同的层次观察程序运行的行为:
程序 -模块 -函数 -指令 -访存 -总线 -信号

层次越高, 行为越容易理解, 但细节也越来越模糊;
而层次越低, 细节会越精确, 但行为也越来越难理解.
因此, 科学的调试方法应该是:
* 先使用正确的软件工具帮助你迅速定位bug产生的大概位置
* 然后再结合波形在很小的范围内进行更细粒度的诊断, 找到bug的精确位置
:::
<!-- -->
:::warning
[为NPC搭建sdb]
你需要为NPC实现单步执行, 打印寄存器和扫描内存的功能,
而表达式求值和监视点都是基于打印寄存器和扫描内存实现的.
单步执行和扫描内存都很容易实现.
为了打印寄存器, 你可以通过Verilator编译出的C++文件来访问通用寄存器,
例如`top->rootp->NPC__DOT__isu__DOT__R_ext__DOT__Memory`,
具体的C++变量名与Verilog中的模块名和变量名有关, 可阅读编译出的C++头文件得知.
:::
<!-- -->
:::warning
[为NPC添加trace支持]
你已经在NEMU中实现itrace, mtrace和ftrace了, 尝试在NPC中实现它们.
其中, 实现itrace需要注意两点:
* 需要通过DPI-C获取当前执行的指令
* 需要链接llvm库, 具体可以参考`nemu/src/utils/filelist.mk`

在仿真环境获取到当前执行的指令之后, ftrace也就不难实现了.
至于mtrace, 由于目前NPC还不支持访存指令, 因此我们之后再实现它.
:::
<!-- -->
:::warning
[为NPC添加DiffTest支持]
DiffTest是处理器调试的一大杀手锏, 在为NPC实现更多指令之前, 为其搭建DiffTest是一个明智的选择.
在这里, DUT是NPC, 而REF则选择NEMU. 为此, 你需要
* 在`nemu/src/cpu/difftest/ref.c`中实现DiffTest的API, 包括`difftest_memcpy()`,
  `difftest_regcpy()`和`difftest_exec()`. 此外`difftest_raise_intr()`是为中断准备的, 目前暂不使用
* 在NEMU的menuconfig中选择共享库作为编译的目标
```
Build target (Executable on Linux Native)  ---
  (X) Shared object (used as REF for differential testing)
```
* 重新编译NEMU, 成功后将会生成动态库文件`nemu/build/riscv32-nemu-interpreter-so`
* 在NPC的仿真环境中通过动态链接方式链接上述的动态库文件, 通过其中的API来实现DiffTest的功能,
  具体可以参考NEMU的相关代码

尝试在打开DiffTest机制的情况下在NPC中正确运行dummy程序.
为了检查DiffTest机制是否生效, 你可以为NPC中`addi`指令的实现注入一个错误,
观察DiffTest是否能够按照预期地报告这一错误.

注意, 为了再次将NEMU编译成ELF, 你还需要修改NEMU中menuconfig的编译目标.
:::
<!-- -->
:::info
[我可以选择Spike作为REF吗?]
考虑到NEMU比Spike的实现更简单, 而且大家也更熟悉, 我们还是优先推荐大家把自己的NEMU作为REF.
总有一天你需要在REF中添加一些个性化的功能来帮助你调试,
我们不希望大家觉得REF的代码跟自己没有关系.
因此, 如果你具备了阅读开源软件代码的能力, 是可以把Spike作为REF的.
:::
## 实现RV32E指令集

准备好这些基础设施之后, 你就可以方便地在NPC中实现更多的RV32E指令了.
这些指令你已经在NEMU中都实现过了, 但在RTL中实现它们, 还需要注意一些细节:
* 计算指令: 这部分指令的执行主要是ALU单元完成的, 你已经在数字电路实验接触过它们了. 具体地
  * 加减法运算 - 在之前实现`addi`指令的时候, 你已经实现补码加法了.
    在电路中, 补码减法可以通过补码加法来实现.
    在RISC-V中, 加减法指令都无需判断进位和溢出
  * 逻辑运算 - 这个很简单
  * 移位运算 - 这个也不难, 直接用运算符就可以实现
  * 比较运算 - 可以归约到减法运算, 通过判断减法运算的结果来得出比较运算的结果

:::info
[硬件如何区分有符号数和无符号数?]
尝试编写以下程序:
```c
#include <stdint.h
int32_t fun1(int32_t a, int32_t b) { return a + b; }
uint32_t fun2(uint32_t a, uint32_t b) { return a + b; }
```
然后编译并查看反汇编代码:
```bash
riscv64-linux-gnu-gcc -c -march=rv32g -mabi=ilp32 -O2 test.c
riscv64-linux-gnu-objdump -d test.o
```
这两个函数有什么不同? 思考一下这是为什么?
:::
* 分支指令: 可以通过ALU中的减法运算来计算分支是否跳转
* 访存指令: 访存指令需要访问存储器, 与取指不同, 访存指令还可能需要将数据写入存储器.
  我们之前把取指的接口拉到顶层的简单实现方式, 并不能正确实现访存指令,
  这是因为访存接口的信号会依赖于当前取到的指令, 而仿真环境无法正确地处理这个依赖关系.
  为了解决这个问题, 我们可以通过DPI-C机制来实现访存:
  ```verilog
  import "DPI-C" function int pmem_read(input int raddr);
  import "DPI-C" function void pmem_write(
    input int waddr, input int wdata, input byte wmask);
  reg [31:0] rdata;
  always @(*) begin
    if (valid) begin // 有读写请求时
      rdata = pmem_read(raddr);
      if (wen) begin // 有写请求时
        pmem_write(waddr, wdata, wmask);
      end
    end
    else begin
      rdata = 0;
    end
  end
  ```
  ```c
  extern "C" int pmem_read(int raddr) {
    // 总是读取地址为`raddr & ~0x3u`的4字节返回
  }
  extern "C" void pmem_write(int waddr, int wdata, char wmask) {
    // 总是往地址为`waddr & ~0x3u`的4字节按写掩码`wmask`写入`wdata`
    // `wmask`中每比特表示`wdata`中1个字节的掩码,
    // 如`wmask = 0x3`代表只写入最低2个字节, 内存中的其它字节保持不变
  }
  ```
  我们在这两个内存读写函数中模拟了32位总线的行为: 它们只支持地址按4字节对齐的读写,
  其中读操作总是返回按4字节对齐读出的数据, 需要由RTL代码根据读地址选择出需要的部分.
  这样是为了将来在实现总线的时候不必改动太多的代码.
  你需要在Verilog代码中为这两个函数的调用传入正确的参数, 并在C++代码中实现这两个函数的功能.
  对于取指, 你需要删除之前把信号拉到顶层的实现, 然后额外调用一次`pmem_read()`来实现它.

<!-- https://github.com/verilator/verilator/issues/2626 -->

:::warning
[为NPC添加mtrace的支持]
通过DPI-C实现访存读写函数之后, mtrace就很容易实现了.
:::
<!-- -->
:::warning
[如果你是初学者, 尝试自己画出架构图]
如果你是处理器设计的初学者, 尝试画出一个完整的单周期处理器架构图.
:::
<!-- -->
:::warning
[观察ALU的综合结果]
尝试使用`yosys-sta`项目对ALU进行综合, 观察综合结果, 回答如下问题:
1. 我们知道, 补码减法可以用加法器来实现,
   而比较指令和分支指令本质上也需要通过补码减法来实现.
   如果我们在RTL代码中直接编写`-`或`<`等各种运算符,
   yosys能否自动将它们的减法功能合并为同一个加法器?
1. 移位运算符`<<`和`>>`被yosys综合成什么电路?
1. yosys从运算符直接综合出电路是否有改进的空间?

Hint: 如果你觉得32位数据的综合结果难以阅读,
可以考虑先观察并分析16位, 8位甚至4位数据的综合结果.
:::
<!-- -->
:::warning
[在NPC中正确运行所有cpu-tests]
有了基础设施的强大帮助, 你应该可以很容易地正确实现支持RV32E的NPC了.
:::
<!-- -->
:::info
[RV32E不包含乘除指令, NPC如何正确运行包含乘除法操作的C程序?]
这是因为RISC-V指令集是模块化的, gcc可以根据指令集是否包含M扩展决定如何编译乘除法操作.
若指令集中不包含M扩展, gcc将会把乘除法操作编译成形如`__mulsi3()`的函数调用,
这些函数用于提供整数算术运算操作的软件模拟版本, 即用加减操作计算出乘除法的结果.
这些函数声明可参考[这个页面][libgcc], 它们的函数体在函数库libgcc中,
通常在链接过程会将libgcc链接到ELF可执行文件中.

我们将libgcc中一些常见的整数乘除运算操作对应的软件模拟函数移植到`riscv32e-npc`中,
因此可以编译出不包含乘除法指令也能正确进行乘除法操作的ELF可执行文件.
:::
[libgcc]: https://gcc.gnu.org/onlinedocs/gccint/Integer-library-routines.html

:::danger
[解放思想, 使用正确的工具做事情]
有同学提出这样的疑问: 为什么要自己折腾verilator和Makefile这些, 明明用modelsim点一个按钮就好了.
这是因为, 仅仅使用波形进行调试, 并不是科学的方法.
对于`cpu-tests`这些规模很小的程序, 即使你坚持用波形调试, 你也可以存活下来;
但随着程序的规模越来越大, 调试效率将会越来越低:
如果仿真1亿个周期后出错, 你将要如何在波形中找到错误?

但大部分同学之前并未思考过如何提升调试的效率.
事实上, 这并不是因为大家没有能力(例如trace本质上就是一行`printf()`),
而是因为各种不专业的想法束缚了大家:
* 我不是计算机系的, 软件跟我没关系
* 我来写硬件的, 软件的部分随便糊弄一下就行
* 现在公司都用quartus/vivado, "一生一芯"用verilator已经不符合时代发展的潮流

这些想法会让大家本能地拒绝接触软件领域的思想.
例如, 在龙芯杯比赛中, 成功启动Linux是系统展示环节的巅峰成果,
然而从比赛结果来看, 并不是每一支参赛队伍都能成功攀登这一巅峰.
但我们相信, 只要学会使用正确的工具, 人人都可以在合理的时间内在自己设计的CPU上成功启动Linux.
例如, 在时长为3个月的第三期"一生一芯"中, 就有一位之前从未设计过CPU的电子系同学,
以一人之力成功在自己的CPU上启动了Linux Debian.
事实上, 即使是写一个很小的脚本, 有时候都会大幅提升你的工作效率.
相比于坚持传统方法, 了解, 借鉴并吸收其它领域的先进方法, 可以让你变得更强大.
:::
<!-- -->
:::tip
[如果你是初学者, 现在可以来看看教科书上的架构图了]
如果你是处理器设计的初学者, 尝试对比自己画的单周期处理器架构图与书上架构图的异同.
思考一下, 两者的架构孰优孰劣? 为什么?
:::