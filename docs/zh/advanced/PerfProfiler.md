---
sidebar_position: 6
---
# 性能计数器

在基础阶段你已经使用过基础的性能评测工具，如马里奥的FPS，NEMU运行得到的IPC数据，本节你需要了解有哪些性能评测工具，如何使用这些性能评测工具。我们在am-kernels中已经提供了coremark、dhrystone、microbench，了解三者的异同。不仅仅局限于上面已知的性能评测方式，你还需要了解更多相关内容，并且需要进行性能调优的挑战。

:::info
[性能评测相关资料]
* **课件资料**
  * [计算机系统性能评价指标](https://foxsen.github.io/archbase/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%B3%BB%E7%BB%9F%E6%80%A7%E8%83%BD%E8%AF%84%E4%BB%B7%E4%B8%8E%E6%80%A7%E8%83%BD%E5%88%86%E6%9E%90.html#%E6%B5%8B%E8%AF%95%E7%A8%8B%E5%BA%8F%E9%9B%86)
  * [测试程序集](https://foxsen.github.io/archbase/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%B3%BB%E7%BB%9F%E6%80%A7%E8%83%BD%E8%AF%84%E4%BB%B7%E4%B8%8E%E6%80%A7%E8%83%BD%E5%88%86%E6%9E%90.html#%E6%B5%8B%E8%AF%95%E7%A8%8B%E5%BA%8F%E9%9B%86)
  * [性能分析方法](https://foxsen.github.io/archbase/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%B3%BB%E7%BB%9F%E6%80%A7%E8%83%BD%E8%AF%84%E4%BB%B7%E4%B8%8E%E6%80%A7%E8%83%BD%E5%88%86%E6%9E%90.html#%E6%80%A7%E8%83%BD%E5%88%86%E6%9E%90%E6%96%B9%E6%B3%95)
  * [性能测试和分析实例](https://foxsen.github.io/archbase/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%B3%BB%E7%BB%9F%E6%80%A7%E8%83%BD%E8%AF%84%E4%BB%B7%E4%B8%8E%E6%80%A7%E8%83%BD%E5%88%86%E6%9E%90.html#%E6%80%A7%E8%83%BD%E6%B5%8B%E8%AF%95%E5%92%8C%E5%88%86%E6%9E%90%E5%AE%9E%E4%BE%8B)
  * An Overview of Common Benchmarks论文
:::

:::warning
[完成以下课后习题  (参考北京大学体系结构实习课程和JYY老师课程)]
* 使用Linux下的剖视工具（例如 `gprof`）对 `dhrystone`和 `whetstone`进行剖视，参考论文Table 1形式给出数据，你的结果和该论文是否一致，为什么？
* 对dhrystone代码做少量修改，使其运行结果不变但“性能”提升。
* 采用dhrystone进行评测有哪些可改进的地方？对其做出修改、评测和说明。
* 在linux下使用编译器分别采用-O0、-O2、-O3选项对whetstone程序进行编译并执行，记录评测结果。
* 进一步改进whetstone程序性能（例如新的编译选项），用实验结果回答。
* 了解SPEC CPU2000
* [性能调优实验](http://jyywiki.cn/ICS/2021/labs/Lab3), [代码框架](https://github.com/NJU-ProjectN/ics-workbench/tree/lab3/perftune)
:::
