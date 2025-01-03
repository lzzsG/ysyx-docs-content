---
sidebar_position: 3
---

# 用RTL实现最简单的处理器

通过实现NEMU, 你已经从概念上了解处理器的构成, 以及处理器大致如何工作了,
现在我们就尝试通过RTL代码来实现一个最简单的处理器.
如预学习阶段所提到, 我们将大家设计的处理器统称为NPC
(New Processor Core, 当然大家可以给自己的处理器起一个更个性化的名字).

## 处理器基本架构

具体地, 你将会需要通过RTL来实现PA1中提到的TRM中的部件:
* PC - 本质上是一个不断加"1"的计数器, 这里的"1"是指一条指令的长度
* 寄存器 - 这里指通用寄存器(GPR, General Purpose Register), 它通常是由一组寄存器组成的.
  特别地, 从0号寄存器读出的值总是为0
* 加法器 - 这个很简单
* 存储器 - 就是个可以读写的"大数组"

事实上, 你已经在数字电路实验中了解过如何用RTL实现它们了.
我们可以按照处理器工作的流程来给RTL项目划分模块: 取指, 译码, 执行, 更新PC.
具体地:
* IFU(Instruction Fetch Unit): 负责根据当前PC从存储器中取出一条指令
* IDU(Instruction Decode Unit): 负责对当前指令进行译码, 准备执行阶段需要使用的数据和控制信号
* EXU(EXecution Unit): 负责根据控制信号对数据进行执行操作, 并将执行结果写回寄存器或存储器
* 更新PC: 通过RTL实现时, 这一操作一般与PC寄存器一同实现, 因而无需为此划分一个独立的模块

至于将上述部件放置在哪一个模块中, 大家可以自行决定, 并自行梳理出模块之间的接口.
一个例外是存储器, 为了方便测试, 我们不通过RTL来实现这个存储器, 而是用C++来实现它.
于是, 我们需要将存储器访问接口的信号拉到顶层, 通过C++代码来访问存储器:
```c
while (???) {
  ...
  top->inst = pmem_read(top->pc);
  top->eval();
  ...
}
```
你可以很容易地通过C++代码来实现一个简单的存储器.

## 若干代码风格和规范

在往期的"一生一芯"计划中, 我们发现部分不规范的代码风格会给后期的SoC集成带来额外的问题.
为了避免将来影响SoC集成的进度, 我们建议大家遵守以下若干代码规范.

:::danger
[1. 如果你是初学者, 不要使用行为建模

事实上, 南京大学数字电路实验讲义中也提到"行为建模不利于初学者建立电路思维",
我们在这里引用相关的描述:]
#### caution::强烈建议初学者不要使用行为建模方式设计电路
Verilog一开始并不是为了设计可综合电路而提出的, 它的本质是一门基于事件队列模型的电路建模语言.
因此, 行为建模很容易会让初学者偏离描述电路的初衷:
开发者需要看着电路图, 心里想象电路的行为, 然后转化成事件队列模型的思考方式,
最后再用行为建模方式来描述电路的行为, 综合器再来根据这样的描述推导出相应的电路.
从这个过程来看, 这不仅是没有必要的, 而且还很容易引入错误:
* 如果开发者心里本身就已经有电路图, 直接描述它是最方便的
* 如果开发者心里本身就已经有电路图, 而开发者对行为建模方式的理解所有偏差,
  可能会采用了错误的描述方式, 从而设计出非预期的电路
* 如果开发者心里没有电路图, 而是期望通过行为建模方式让综合器生成某种行为的电路,
  这就已经偏离“描述电路”的本质了.
  大部分同学非常容易犯这样的错误, 把行为建模当作过程式的C语言来写,
  尝试把任意复杂的行为描述映射到电路, 最终综合器只会生成出延迟大, 面积大, 功耗高的低质量电路

所以, 直到大家掌握"描述电路"的思维而不被行为建模误导之前
我们强烈建议初学者远离行为建模方式, 仅通过数据流建模和结构化建模方式直接描述电路.
例如, 上文关于if和always的说法从某种程度上来说是正确的,
但下面的问题可以帮助大家测试自己是否已经掌握了Verilog的本质:
* 在硬件描述语言中, "执行"的精确含义是什么?
* 是谁在执行Verilog的语句? 是电路，综合器，还是其它的?
* if的条件满足, 就不执行else后的语句, 这里的"不执行"又是什么意思? 和描述电路有什么联系?
* 有"并发执行", 又有"顺序执行", 还有"任何一个变量发生变化就立即执行",
  以及"在任何情况下都执行", 它们都是如何在设计出来的电路中体现的?

如果你无法对这些问题作出明确的回答, 我们强烈建议你不要使用行为建模方式.
如果你真的想弄懂它们, 你需要阅读[Verilog标准手册](https://inst.eecs.berkeley.edu/~cs150/fa06/Labs/verilog-ieee.pdf).
:::
<!-- -->
:::danger
[真正的描述电路 = 实例化 + 连线]
忘记行为建模方式, 就可以很容易回归到描述电路的简单本质.
想象一下, 你手中有一张电路图纸, 如果你需要向其它人描述图纸上的内容, 你将会如何描述?
你一定会说出类似"有一个A元件/模块, 它的x引脚和另一个B元件/模块的y引脚相连"的描述,
因为这才是描述电路的最自然的方式.
用HDL设计电路, 就是在用HDL来描述电路图纸, 图纸上有什么, 就直接描述什么.
所以, 用HDL描述电路, 无非是做两件事情:
* 实例化: 在电路板上放一个元件/模块, 可以是一个门电路, 或者是由门电路组成的模块
* 连线: 用导线将元件/模块的引脚正确地连起来

大家可以体会一下, 数据流建模和结构化建模是如何体现这两件事的,
而行为建模又是如何把这两件简单的事情复杂化的.
:::
所以, 我们不建议初学者在Verilog代码中编写任何always语句.
为了方便大家使用触发器和选择器, 我们提供了如下Verilog模板给大家进行调用:
```verilog
// 触发器模板
module Reg #(WIDTH = 1, RESET_VAL = 0) (
  input clk,
  input rst,
  input [WIDTH-1:0] din,
  output reg [WIDTH-1:0] dout,
  input wen
);
  always @(posedge clk) begin
    if (rst) dout <= RESET_VAL;
    else if (wen) dout <= din;
  end
endmodule

// 使用触发器模板的示例
module example(
  input clk,
  input rst,
  input [3:0] in,
  output [3:0] out
);
  // 位宽为1比特, 复位值为1'b1, 写使能一直有效
  Reg #(1, 1'b1) i0 (clk, rst, in[0], out[0], 1'b1);
  // 位宽为3比特, 复位值为3'b0, 写使能为out[0]
  Reg #(3, 3'b0) i1 (clk, rst, in[3:1], out[3:1], out[0]);
endmodule
```

```verilog
// 选择器模板内部实现
module MuxKeyInternal #(NR_KEY = 2, KEY_LEN = 1, DATA_LEN = 1, HAS_DEFAULT = 0) (
  output reg [DATA_LEN-1:0] out,
  input [KEY_LEN-1:0] key,
  input [DATA_LEN-1:0] default_out,
  input [NR_KEY*(KEY_LEN + DATA_LEN)-1:0] lut
);

  localparam PAIR_LEN = KEY_LEN + DATA_LEN;
  wire [PAIR_LEN-1:0] pair_list [NR_KEY-1:0];
  wire [KEY_LEN-1:0] key_list [NR_KEY-1:0];
  wire [DATA_LEN-1:0] data_list [NR_KEY-1:0];

  genvar n;
  generate
    for (n = 0; n < NR_KEY; n = n + 1) begin
      assign pair_list[n] = lut[PAIR_LEN*(n+1)-1 : PAIR_LEN*n];
      assign data_list[n] = pair_list[n][DATA_LEN-1:0];
      assign key_list[n]  = pair_list[n][PAIR_LEN-1:DATA_LEN];
    end
  endgenerate

  reg [DATA_LEN-1 : 0] lut_out;
  reg hit;
  integer i;
  always @(*) begin
    lut_out = 0;
    hit = 0;
    for (i = 0; i < NR_KEY; i = i + 1) begin
      lut_out = lut_out | ({DATA_LEN{key == key_list[i]}} & data_list[i]);
      hit = hit | (key == key_list[i]);
    end
    if (!HAS_DEFAULT) out = lut_out;
    else out = (hit ? lut_out : default_out);
  end
endmodule

// 不带默认值的选择器模板
module MuxKey #(NR_KEY = 2, KEY_LEN = 1, DATA_LEN = 1) (
  output [DATA_LEN-1:0] out,
  input [KEY_LEN-1:0] key,
  input [NR_KEY*(KEY_LEN + DATA_LEN)-1:0] lut
);
  MuxKeyInternal #(NR_KEY, KEY_LEN, DATA_LEN, 0) i0 (out, key, {DATA_LEN{1'b0}}, lut);
endmodule

// 带默认值的选择器模板
module MuxKeyWithDefault #(NR_KEY = 2, KEY_LEN = 1, DATA_LEN = 1) (
  output [DATA_LEN-1:0] out,
  input [KEY_LEN-1:0] key,
  input [DATA_LEN-1:0] default_out,
  input [NR_KEY*(KEY_LEN + DATA_LEN)-1:0] lut
);
  MuxKeyInternal #(NR_KEY, KEY_LEN, DATA_LEN, 1) i0 (out, key, default_out, lut);
endmodule
```
其中, `MuxKey`模块实现了"键值选择"功能, 即在一个`(键值, 数据)`的列表`lut`中,
根据给定的键值`key`, 将`out`设置为与其匹配的数据.
若列表中不存在键值为`key`的数据, 则`out`为`0`.
特别地, `MuxKeyWithDefault`模块可以提供一个默认值`default_out`,
当列表中不存在键值为`key`的数据, 则`out`为`default_out`.
实例化这两个模块时需要注意如下两点:
* 需要使用者提供键值对的数量`NR_KEY`, 键值的位宽`KEY_LEN`以及数据的位宽`DATA_LEN`这三个参数,
并保证端口的信号宽度与提供的参数一致, 否则将会输出错误的结果
* 若列表中存在多个键值为`key`的数据, 则`out`的值是未定义的, 需要使用者来保证列表中的键值互不相同

`MuxKeyInternal`模块的实现中用到了很多高级的功能, 如`generate`和`for`循环等,
为了方便编写还使用了行为建模方式, 在这里我们不展开介绍,
通过结构化建模的抽象, 使用者可以无需关心这些细节.

以下代码通过使用选择器模板来分别实现2选1多路选择器和4选1多路选择器:
```verilog
module mux21(a,b,s,y);
  input   a,b,s;
  output  y;

  // 通过MuxKey实现如下always代码
  // always @(*) begin
  //  case (s)
  //    1'b0: y = a;
  //    1'b1: y = b;
  //  endcase
  // end
  MuxKey #(2, 1, 1) i0 (y, s, {
    1'b0, a,
    1'b1, b
  });
endmodule

module mux41(a,s,y);
  input  [3:0] a;
  input  [1:0] s;
  output y;

  // 通过MuxKeyWithDefault实现如下always代码
  // always @(*) begin
  //  case (s)
  //    2'b00: y = a[0];
  //    2'b01: y = a[1];
  //    2'b10: y = a[2];
  //    2'b11: y = a[3];
  //    default: y = 1'b0;
  //  endcase
  // end
  MuxKeyWithDefault #(4, 2, 1) i0 (y, s, 1'b0, {
    2'b00, a[0],
    2'b01, a[1],
    2'b10, a[2],
    2'b11, a[3]
  });
endmodule
```

:::info
[如果你使用Chisel, 也建议你不要使用when和switch]
在Chisel中, `when`和`switch`的语义和Verilog的行为建模非常相似, 因此也不建议初学者使用.
相反, 你可以使用`Mux1H`等库函数来实现选择器的功能, 具体可以查阅Chisel的相关资料.
:::
<!-- -->
:::danger
[2. 如果你坚持使用Verilog的行为建模, 不要用negedge]
`posedge`和`negedge`混用, 会导致时序收敛更加困难, 增加后端物理实现的难度.
如果你不清楚如何在两者混用的情况下仍然保持很好的时序, 我们建议你只使用`posedge`.
否则, 如果你的处理器严重影响SoC整体的时序, 在流片时间节点紧张的情况下,
"一生一芯"项目组将会把你的处理器移出该批次的流片名单.

如果你使用我们提供的上述Verilog模板, 或者使用Chisel, 你不必担心这一问题.
:::
<!-- -->
:::danger
[3. 如果你坚持使用Verilog的行为建模, 不要用异步复位]
采用异步复位容易造成亚稳态, 导致芯片复位后无法正确工作.
一般使用`异步复位, 同步释放`的技术来解决这个问题.
如果你不知道如何使用这个技术, 我们建议你只使用同步复位(即复位信号不出现在`always`的事件列表中).
否则"一生一芯"项目组不保证回片后你的处理器可以正确工作.

如果你使用我们提供的上述Verilog模板, 或者使用Chisel, 你不必担心这一问题.
:::
<!-- -->
:::danger
[4. 如果你坚持使用Verilog的行为建模, 不要使用锁存器(Latch)]
锁存器的变化不受时钟驱动, 时序分析工具难以对其进行分析.
如果你不清楚如何避免锁存器, 我们建议你不要使用行为建模.

如果你使用我们提供的上述Verilog模板, 或者使用Chisel, 你不必担心这一问题.
:::
<!-- -->
:::danger
[5. 需要在模块名前添加学号前缀]
如`module IFU`需要修改为`module ysyx_22040000_IFU`.
这是因为大家将自己的处理器集成到SoC后, 名字相同的模块会导致工具报告重复定义的错误.

如果你使用Chisel, 我们将来会提供一个FIRRTL transform自动添加前缀,
目前你编写代码时模块名不必添加学号前缀.
:::
<!-- -->
:::danger
[6. 如果你使用Verilog, 需要在宏定义的标识符前添加学号前缀]
如`` `define SIZE 5 ``需要修改为`` `define ysyx_22040000_SIZE 5 ``.
这是因为大家将自己的处理器集成到SoC后, 名字相同的宏会导致工具报告重复定义的错误.

如果你使用Chisel, 你不必担心这一问题.
:::
## 在NPC中实现第一条指令

接下来, 我们来实现一条最简单的指令: `addi`.
在NEMU中, 你已经理解这条指令是如何执行的了, 现在你需要通过RTL来实现它.

:::warning
[如果你是初学者, 尝试自己画出架构图]
如果你是第一次接触处理器设计, 尝试自己画出仅支持`addi`指令的单周期处理器的架构图.
:::
<!-- -->
:::info
[独立解决未知问题的训练]
事实上, 单周期处理器的解决方案是非常成熟的, 以至于你可以在绝大多数教材中找到非常详细的架构图.
我们之所以不在讲义中给出架构图, 是希望把一个成熟的问题包装成一个"未知"问题提供给初学者,
让初学者通过自己的思考来解决这个"未知"问题.
这种训练和大家将来解决真实问题的过程是非常相似的,
所以当你直接从教科书上找到问题的答案时, 你就再次错过了一次锻炼自己的机会.
:::
<!-- -->
:::warning
[在NPC中实现addi指令]
具体地, 你需要注意以下事项:
* PC的复位值设置为`0x80000000`
* 存储器中可以放置若干条`addi`指令的二进制编码(可以利用0号寄存器的特性来编写行为确定的指令)
* 由于目前未实现跳转指令, 因此NPC只能顺序执行, 你可以在NPC执行若干指令之后停止仿真
* 可以通过查看波形, 或者在RTL代码中打印通用寄存器的状态, 来检查`addi`指令是否被正确执行
* 关于通用寄存器, 你需要思考如何实现0号寄存器的特性; 此外,
  为了避免选择Verilog的同学编写出不太合理的行为建模代码,
  我们给出如下不完整的代码供大家补充(大家无需改动`always`代码块中的内容):
```verilog
module RegisterFile #(ADDR_WIDTH = 1, DATA_WIDTH = 1) (
  input clk,
  input [DATA_WIDTH-1:0] wdata,
  input [ADDR_WIDTH-1:0] waddr,
  input wen
);
  reg [DATA_WIDTH-1:0] rf [2**ADDR_WIDTH-1:0];
  always @(posedge clk) begin
    if (wen) rf[waddr] <= wdata;
  end
endmodule
```
* 使用NVBoard需要RTL代码比较好地支持设备, 这将在后续进行介绍, 目前不必接入NVBoard
:::
<!-- -->
:::tip
[不知道如何下手?]
你很可能会遇到以下问题:
* 如何通过PC值正确地访问存储器?
* 如何在存储器中放置`addi`指令?
* 如何仅执行若干指令后结束仿真?
* 通用寄存器模块的端口应该如何设计?

在预学习阶段搭建verilator框架的时候, 我们就已经提醒过大家:
<Highlight color="#c40e0e">项目里面的所有细节都是和大家有关系的</Highlight>
每当你觉得没有思路的时候, 这很大概率是在提醒你, 你很可能在之前的学习中有什么没做好.
相比于询问同学, 你其实更应该回顾之前的实验内容, 并尽自己最大努力理解每一处细节, 从而找到上述问题的答案.
:::
## 让程序决定仿真何时结束

我们刚才是让仿真环境(C++代码)来决定执行多少条指令后结束仿真,
显然这个做法并不具有很好的通用性: 你需要提前知道一个程序将会执行多少条指令.
有没有方法可以在程序执行结束的时候自动结束仿真呢?

事实上, NEMU已经给了一个很好的解决方案了: trap指令.
NEMU实现了一条特殊的`nemutrap`指令, 用于指示客户程序的结束,
具体地, 在RISC-V中, NEMU选择了`ebreak`指令来作为`nemutrap`指令.
事实上在NPC中, 我们也可以实现类似的功能:
如果程序执行了`ebreak`指令, 就通知仿真环境结束仿真.

要实现这一功能并不困难, 你首先需要在NPC中添加`ebreak`指令的支持.
不过, 为了让NPC在执行`ebreak`指令的时候可以通知仿真环境,
你还需要实现一种RTL代码和C++代码之间的交互机制.
我们借用system verilog中的DPI-C机制来实现这一交互.

:::warning
[尝试DPI-C机制]
阅读verilator手册, 找到DPI-C机制的相关内容, 并尝试运行手册中的例子.
:::
<!-- -->
:::warning
[通过DPI-C实现ebreak]
在RTL代码中利用DPI-C机制, 使得在NPC执行`ebreak`指令的时候通知仿真环境结束仿真.
实现后, 在存储器中放置一条`ebreak`指令来进行测试.
如果你的实现正确, 仿真环境就无需关心程序何时结束仿真了,
它只需要不停地进行仿真, 直到程序执行`ebreak`指令为止.

如果你使用Chisel, 你可以借助Chisel中的BlackBox机制调用Verilog代码,
然后让Verilog代码通过DPI-C机制与仿真环境交互.
关于BlackBox的使用方式, 请查阅相关资料.
:::