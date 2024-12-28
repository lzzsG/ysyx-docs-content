import os
import re

def process_file(file_path):
    """处理单个 Markdown 文件"""
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    updated_lines = []
    for line in lines:
        # 匹配 :::info、:::warning、:::tip、:::danger、:::details 后紧接内容的行
        match = re.match(r"(::: ?(info|warning|tip|danger|details))\s*(.*)", line)
        if match:
            block_start = match.group(1)  # :::info 或类似的标记
            content = match.group(3)  # 紧随其后的内容
            if content:  # 如果后面有内容，将内容移动到下一行
                updated_lines.append(f"{block_start}\n")
                updated_lines.append(f"{content}\n")
            else:
                updated_lines.append(line)  # 如果已经是正确格式，保持不变
        else:
            updated_lines.append(line)

    # 写回文件
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(updated_lines)


def process_folder(folder_path):
    """递归遍历文件夹并处理所有 Markdown 文件"""
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".md"):  # 只处理 .md 文件
                file_path = os.path.join(root, file)
                process_file(file_path)


def main():
    # 指定文件夹路径
    folder_path = "./docs/zh"  # 替换为你的目标文件夹路径
    process_folder(folder_path)
    print("Markdown 文件处理完成！")


if __name__ == "__main__":
    main()
