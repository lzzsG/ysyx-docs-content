import os
import json

def generate_config(directory, base_path=""):
    config = []
    for entry in sorted(os.listdir(directory)):
        full_path = os.path.join(directory, entry)
        if os.path.isdir(full_path):  # 如果是子目录，递归处理
            items = generate_config(full_path, base_path + "/" + entry)
            if items:  # 子目录不为空
                config.append({
                    "text": entry,
                    "items": items
                })
        elif entry.endswith(".md"):  # 如果是 Markdown 文件
            file_name = os.path.splitext(entry)[0]  # 去掉扩展名
            link = f"{base_path}/{file_name}"  # 生成链接
            config.append({
                "text": file_name,
                "link": link
            })
    return config

# 主函数
def main():
    # 输入 zh 目录的路径
    zh_directory = "docs/zh"  # 根据你的项目调整路径
    config = generate_config(zh_directory)
    # 将结果转换为 JSON 格式
    result = {
        "text": "Root",
        "items": config
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
