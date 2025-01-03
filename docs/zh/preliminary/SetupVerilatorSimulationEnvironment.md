---
sidebar_position: 4
---
# 搭建verilator仿真环境

verilator是一款开源的verilog仿真工具, 在"一生一芯"项目中,
你将会使用它来进行RTL功能仿真, 从而验证你编写的RTL代码.

框架代码默认提供了一个`npc`目录,
这里的`npc`是`New Processor Core`的含义, 将来大家就会在这个目录下设计自己的处理器.
不过为了设置一个环境变量`NPC_HOME`, 你需要运行如下命令:
> ```bash
> cd ysyx-workbench
> bash init.sh npc
> ```
这个环境变量会在将来使用.
`npc`目录下有一些简单的文件:
```
ysyx-workbench/npc
├── csrc
│   └── main.cpp
├── Makefile
└── vsrc
    └── example.v
```
目前这三个文件几乎都是空文件,
在这一小节中, 我们将会引导大家搭建verilator仿真环境,
并编写两个简单的数字电路模块来进行仿真.

:::danger
[竟然连仿真框架都没有, 真寒酸]
我们之所以设置这部分的实验内容, 是为了让大家知道,
<Highlight color="#c40e0e">项目里面的所有细节都是和大家有关系的</Highlight>.

在以前的课程实验当中, 大家不多不少都会觉得,
框架理所应当是由助教来提供的, 做实验就是在指定的地方写上相应的代码,
其它都是无关的代码/文件, 大家不需要关心.
事实上, 这样的实验方案是<Highlight color="#c40e0e">很危险</Highlight>的, 这不仅不能将你训练成真正的专业人士,
反而会使得你无法在真正的项目中存活下来:
1. 遇到系统性的bug, 肯定调不出来, 因为连调用你代码的模块你都觉得跟你没关系,
更别说可以清晰地认识到整个项目的架构和其中的每一处细节了
1. 离开了讲义, 就什么都做不了, 因为你总是在等别人像这些讲义一样清楚地告诉你接下来应该做什么怎么做,
而不是站在项目的角度去切实分析现在应该做什么

一个很现实的场景是, 以后你到了企业或者进入课题组, 不会再有讲义和框架代码照顾你,
你的老板说一句"来试试verilator", 你就要自己把verilator跑起来,
写一份使用报告, 在下周的组会上给老板汇报工作.

因此, 我们希望给大家提供更真实的训练: 给出一个目标,
让大家学会对目标进行分解, 并通过自身的技能一步步达成这个目标.
搭建verilator仿真框架其实是一个很容易实现的目标, 因此作为一项小试牛刀的训练, 也是非常合适的.
:::
:::tip
[如果你想使用Chisel]
请运行以下命令:
```bash
cd ysyx-workbench
bash init.sh npc-chisel
```
上述命令会将`npc`目录中的文件换成一个Chisel开发环境, 具体介绍可以阅读其中的`README.md`.

本小节主要关注verilator的使用方法, 即使你想用Chisel进行开发,
我们也建议你按照讲义内容使用verilog先走一遍流程.
:::
## STFW + RTFM

事不宜迟, 我们马上开始.

:::warning
[认识verilator]
你很可能是第一次听说过verilator这个工具, 这是很正常的.
然后你就会想进一步了解verilator的各种信息, 这也是很正常的.
但如果你的第一反应是去问人, 这就不恰当了.
事实上, verilator这个工具在仿真领域已经非常有名, 以至于你可以很容易在互联网上搜索到它的相关信息.
你需要通过STFW找到它的官方网站, 然后阅读一下相关的介绍.
:::
找到官网并且阅读过相关介绍之后, 接下来就是通过运行来体会一下了.
不过在这之前, 我们还需要安装它.

:::warning
[安装verilator]
在官网中找到安装verilator的步骤, 然后按照从git安装的相应步骤进行操作.
我们之所以不采用`apt-get`安装, 是因为其版本较老.
此外, 为了统一版本, 你需要通过git安装`5.008`的版本.
为此, 你还需要进行一些简单的git操作, 如果你对此感到生疏, 你可能需要寻找一些git教程来学习.
另外, 你最好在`ysyx-workbench/`之外的目录进行这一操作,
否则git将会追踪到verilator的源代码, 从而占用不必要的磁盘空间.

安装成功后, 运行以下命令来检查安装是否成功，以及版本是否正确。
```bash
verilator --version
```
:::
<!-- -->
:::warning
[运行示例]
verilator手册中包含一个C++的示例, 你需要在手册中找到这个示例, 然后按照示例的步骤进行操作.
:::
## 示例: 双控开关

手册中的示例非常简单, 甚至算不上是一个真正的电路模块.
接下来我们编写一个真正的电路模块, 双控开关, 来进行测试.
编写如下的verilog代码:
```verilog
module top(
  input a,
  input b,
  output f
);
  assign f = a ^ b;
endmodule
```
双控开关的一个应用是通过两个开关(`a`和`b`)联合控制同一盏灯的亮灭(`f`).
和手册中的示例不同, 这个模块有输入输出端口.
为了驱动输入端口, 并从输出端口获得结果,
我们需要对C++文件中的`while`循环进行修改:
```c
// 以下为伪代码

#include <stdio.h>
#include <stdlib.h>
#include <assert.h>

while (???) {
  int a = rand() & 1;
  int b = rand() & 1;
  top->a = a;
  top->b = b;
  top->eval();
  printf("a = %d, b = %d, f = %d\n", a, b, top->f);
  assert(top->f == (a ^ b));
}
```
在一次循环中, 代码将会随机生成两个1比特信号, 用来驱动两个输入端口,
然后通过`eval()`函数更新电路的状态, 这样我们就可以读取输出端口的值并打印.
为了自动检查结果是否正确, 我们通过`assert()`语句对输出结果进行检查.

:::warning
[对双控开关模块进行仿真]
尝试在verilator中对双控开关模块进行仿真.
由于顶层模块名与手册中的示例有所不同, 你还需要对C++文件进行一些相应的修改.
此外, 这个项目没有指示仿真结束的语句, 为了退出仿真, 你需要键入`Ctrl+C`.
:::
<!-- -->
:::tip
[上述代码是什么意思?]
如果你不知道应该如何修改, 说明你还不太熟悉C程序的编写,
你应该先回到上一小节复习C语言.
:::
<!-- -->
:::warning
[理解RTL仿真的行为]
阅读verilator编译出的C++代码, 然后结合verilog代码, 尝试理解仿真器进行仿真的时候都发生了什么.
:::
## 打印并查看波形

查看波形文件是RTL调试的常用手段之一.
verilator支持波形的生成, 你可以通过开源的波形查看工具GTKWave来查看波形.

:::warning
[生成波形并查看]
verilator手册中已经介绍了波形生成的方法, 你需要阅读手册找到相关内容,
然后按照手册中的步骤生成波形文件, 并通过
```bash
apt-get install gtkwave
```
安装GTKWave来查看波形.
:::
<!-- -->
:::tip
[手册这么多内容, 怎么找?]
尝试一下键入`Ctrl+F`.
:::
<!-- -->
:::danger
[不要长时间生成波形]
波形文件一般会占用较多的磁盘空间, 长时间生成波形可能会导致磁盘空间耗尽, 从而导致系统崩溃.
:::
<!-- -->
:::tip
[生成FST格式的波形]
FST格式的波形文件大致是VCD格式的1/50, 但它仅能被GTKWave支持.
尽管如此, 我们还是推荐你使用它.
:::
## 编写Makefile

:::warning
[一键仿真]
反复键入编译运行的命令是很不方便的, 尝试为`npc/Makefile`编写规则`sim`,
实现一键仿真, 如键入`make sim`即可进行上述仿真.
:::
<!-- -->
:::danger
[注意保留git追踪的命令]
框架代码已经在`npc/Makefile`中提供了一条默认的`sim`规则,
它已经包含用于git追踪的命令`$(call git_commit, "sim RTL")`,
在编写Makefile的时候注意不要修改这一命令, 否则会影响开发跟踪的功能,
而这是记录"一生一芯"成果原创性的重要依据.
因此在编写Makefile并运行之后, 你也需要确认git是否已经正确追踪了仿真的记录.
:::
## 接入NVBoard

[NVBoard][nvboard](NJU Virtual Board)是南京大学开发的, 用于教学的虚拟FPGA板卡项目,
可以在RTL仿真环境中提供一个虚拟板卡的界面, 支持拨码开关, LED灯, VGA显示等功能,
在速度要求不高的场景下可完全替代真实的FPGA板卡(毕竟不是每人身边都有一块FPGA).
通过以下命令获取NVBoard的代码:
```bash
cd ysyx-workbench
bash init.sh nvboard
```

[nvboard]: https://github.com/NJU-ProjectN/nvboard.git

:::warning
[运行NVBoard示例]
阅读NVBoard项目的介绍, 尝试运行NVBoard项目中提供的示例.
:::
<!-- -->
:::tip
[不知道NVBoard如何工作?]
试试从`make`命令开始, 看看一切是如何发生的.
通过前面的学习, 你已经掌握了足够的知识背景去理解NVBoard如何工作了:
包括Makefile的使用, C语言和C++中类的基本用法.
现在就试试阅读代码(Makefile也是代码), 看看示例中的verilog顶层端口,
约束文件, 以及NVBoard是如何建立联系的.
:::
<!-- -->
:::warning
[在NVBoard上实现双控开关]
阅读NVBoard项目的说明, 然后仿照该示例下的C++文件和Makefile, 修改你的C++文件,
为双控开关的输入输出分配引脚, 并修改`npc/Makefile`使其接入NVBoard.
:::
<!-- -->
:::info
[NVBoard的故事]
NVBoard虽然是南京大学的教学项目, 但它却与参加"一生一芯"的各位有着一种特殊的联系:
在第三期"一生一芯"的流片名单当中有两位特殊的同学, 他们报名的时候还只是大一,
而其中一位同学sjr就是NVBoard的第一作者.

事实上, 也正是sjr同学在参加"一生一芯"时锻炼出的独立解决问题的能力和自信,
帮助他成功开发NVBoard项目.
如今NVBoard项目又反过来帮助"一生一芯"改进学习效果,
NVBoard承载的除了虚拟FPGA板卡的功能之外, 还有"一生一芯"秉承的独立解决问题的理念.

这些离你其实并不遥远, 当你愿意自主学习而不再等着别人给你答案的时候, 你的未来也会充满无限的可能.
:::
## 示例: 流水灯
(如果该段示例代码理解困难，可以先进行[数字电路基础实验部分](DigitalCircuitBasicExperiment.md)!)

流水灯是按照顺序依次亮起和熄灭的一组灯, 以下是流水灯的一个参考实现:
```verilog
module light(
  input clk,
  input rst,
  output reg [15:0] led
);
  reg [31:0] count;
  always @(posedge clk) begin
    if (rst) begin led <= 1; count <= 0; end
    else begin
      if (count == 0) led <= {led[14:0], led[15]};
      count <= (count >= 5000000 ? 32'b0 : count + 1);
    end
  end
endmodule
```
这里的输出信号led的每一位对应虚拟板卡的一个led灯.
由于代码中包含需要进行复位的时序逻辑部件, 我们需要对verilator的仿真代码进行修改:
```c
// 以下为伪代码

void single_cycle() {
  top->clk = 0; top->eval();
  top->clk = 1; top->eval();
}

void reset(int n) {
  top->rst = 1;
  while (n -- > 0) single_cycle();
  top->rst = 0;
}

...
reset(10);  // 复位10个周期
while(???) {
  ...
  single_cycle();
  ...
}
```

:::warning
[将流水灯接入NVBoard]
编写流水灯模块, 然后接入NVBoard并分配引脚.
如果你的实现正确, 你将看到灯从右端往左端依次亮起并熄灭.
:::
<!-- -->
:::warning
[理解RTL仿真的行为(2)]
阅读verilator编译出的C++代码, 然后结合verilog代码,
尝试理解仿真器是如何对时序逻辑电路进行仿真的.
:::
:::info
[verilator进阶学习]
[请点击这里](https://www.itsembedded.com/)
:::
