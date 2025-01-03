---
sidebar_position: 6
---
# 完成PA1

南京大学"计算机系统基础"课程实验PA是国内首个也是目前唯一一个模拟器教学实验.
我们将PA引入到"一生一芯"中, 主要有以下考虑:
* PA承担了系统能力培养的绝大部分任务:
  从硬件模拟器, ISA, 运行时环境, 到自制OS, 库函数, 应用程序,
  可以让你深刻认识到程序如何在计算机上运行的每一处细节
  * 如果你选择直接在RTL实现的处理器上构建系统软件, 你首先需要保证你的处理器是对的:
    如果你的流水线在某个极端场景下和总线交互有问题, 你的自制OS和复杂应用程序(例如仙剑)都跑不起来.
    相对地, 正确实现一个模拟器, 比正确实现RTL要容易得多
* 模拟器是处理器测试验证的一个重要组件:
  我们希望大家可以理解模拟器中的每一处细节, 需要的时候可以自行对它进行定制,
  而不是把它当作一个和自己没有关系的外部工具


:::info
["计算机系统基础"理论课课程资源]
在完成PA的过程中, 如果你需要补充一些理论课的知识,
可以参考袁春风老师在中国大学MOOC上开设的课程: [上][mooc1], [中][mooc2], [下][mooc3]
:::
[mooc1]: https://www.icourse163.org/course/NJU-1001625001
[mooc2]: https://www.icourse163.org/course/NJU-1001964032
[mooc3]: https://www.icourse163.org/course/NJU-1002532004

:::warning
[阅读PA讲义中的FAQ(常见问题)]
在做PA之前, 我们强烈建议大家阅读PA讲义中的FAQ, 从而对PA有更多的了解.
:::

<!-- [PA讲义中的FAQ][PA FAQ]
[PA FAQ]: ../../ics-pa/FAQ.html -->

:::warning
[完成PA1]
根据PA讲义完成相关内容(ISA选择默认的`riscv32`), 包括如下内容:
* [基础设施:简易调试器][gdb]
* [表达式求值][expr]
* [监视点][watchpoint]
* 完成PA1的必答题
直到你看到如下提示框:
#### flag::温馨提示
PA1到此结束...
:::
<!-- https://github.com/oscc-web/ysyx-docs-content/issues/32 -->
<!-- [gdb]: ../../ics-pa/1.4.md
[expr]: ../../ics-pa/1.5.html
[watchpoint]: ../../ics-pa/1.6.html -->
