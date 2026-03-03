#!/bin/bash

# 检测操作系统类型
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    SED_I="sed -i ''"
else
    # Linux 和其他系统
    SED_I="sed -i"
fi

# 使用函数来执行 sed 命令，确保跨平台兼容
sed_inplace() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "$@"
    else
        sed -i "$@"
    fi
}

# 修改 package.json
sed_inplace 's#1186258278/OpenClawChineseTranslation#luoweb/openclawcn#g' package.json
sed_inplace 's#武汉晴辰天下网络科技有限公司#roweb#g' package.json
sed_inplace 's#<contact@qingchencloud.com>#<contact@roweb.cn>#g' package.json
sed_inplace 's#https://qingchencloud.com/#https://roweb.cn/#g' package.json

# 修改 .github/workflows/sync-and-release.yml
sed_inplace 's#武汉晴辰天下网络科技有限公司#roweb#g' .github/workflows/sync-and-release.yml
sed_inplace 's#<contact@qingchencloud.com>#<contact@roweb.cn>#g' .github/workflows/sync-and-release.yml
sed_inplace 's#https://qingchencloud.com/#https://roweb.cn/#g' .github/workflows/sync-and-release.yml
sed_inplace 's#1186258278/OpenClawChineseTranslation#luoweb/openclawcn#g' .github/workflows/sync-and-release.yml
sed_inplace 's#1186258278/openclaw-zh:latest#luoweb/openclaw-zh:latest#g' .github/workflows/sync-and-release.yml

# 修改 Dockerfile
sed_inplace 's#武汉晴辰天下网络科技有限公司#roweb#g' Dockerfile
sed_inplace 's#<contact@qingchencloud.com>#<contact@roweb.cn>#g' Dockerfile
sed_inplace 's#https://qingchencloud.com/#https://roweb.cn/#g' Dockerfile
sed_inplace 's#1186258278/OpenClawChineseTranslation#luoweb/openclawcn#g' Dockerfile
sed_inplace 's#1186258278/openclaw-zh:latest#luoweb/openclaw-zh:latest#g' Dockerfile

# 修改 install.sh
sed_inplace 's#武汉晴辰天下网络科技有限公司#roweb#g'  *.sh
sed_inplace 's#https://qingchencloud.com/#https://roweb.cn/#g'  *.sh
sed_inplace 's#1186258278/OpenClawChineseTranslation#luoweb/openclawcn#g'  *.sh
sed_inplace 's#https://roweb.cn/#https://luoweb.cn/#g'  *.sh
