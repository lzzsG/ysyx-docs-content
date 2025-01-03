---
sidebar_position: 4
---
# 总线

:::info
[视频录播和课件]

* 录播 - [总线选讲](https://www.bilibili.com/video/BV1wP4y1q7fF/)
* 课件 - [总线选讲](https://ysyx.oscc.cc/slides/2205/17.html#/)

:::
新讲义还没写好, 大家可以先看上面的课件和视频录播.

<!-- -->
:::info
[总线资料]

* [**第五期“一生一芯”系列视频**](https://space.bilibili.com/2107852263/channel/collectiondetail?sid=690279)
* [**总线英文手册**](https://developer.arm.com/Architectures/AMBA)
* [**总线中文手册及总结**](https://www.lzrnote.cn/2021/10/08/axi%e6%80%bb%e7%ba%bf%e6%80%bb%e7%bb%93/)
* [**深入AXI4总线**](https://zhuanlan.zhihu.com/p/44766356)

:::
<!-- -->
:::warning
[将IFU的取指接口改造成AXI-Lite]

1. 用RTL编写一个AXI-Lite的SRAM模块, 地址位宽为32bit, 数据位宽为64bit
1. 收到读请求后, 通过DPI-C调用`pmem_read()`, 并延迟一周期返回读出的数据
   * IFU每次取指都要等待一个周期, 才能取到指令交给IDU

:::
<!-- -->

:::warning
[将LSU的访存接口改造成AXI-Lite]

1. 用RTL编写一个AXI-Lite的SRAM模块, 地址位宽为32bit, 数据位宽为64bit
1. 收到读写请求后, 通过DPI-C调用`pmem_read()`/`pmem_write()`, 并延迟一周期返回读出的数据/写回复
   * LSU每次访存都要等待一个周期
   * 此时可以保留`pmem_read()`/`pmem_write()`中的设备访问功能, 我们将在SoC章节介绍如何通过总线访问外设

:::
<!-- -->

:::warning
[实现AXI-Lite仲裁器]
保留一个AXI-Lite的SRAM模块, 编写一个AXI-Lite的Arbiter, 从IFU和LSU的AXI-Lite中选一个master与SRAM模块交互.
:::
