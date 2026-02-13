#!/bin/bash
# ============================================================
# OpenClaw 汉化版 - 胜算云快速配置脚本
#
# 用法:
#   # 方式1: 交互式（引导输入 API Key）
#   bash quick-setup-shengsuanyun.sh
#
#   # 方式2: 直接传入 API Key
#   bash quick-setup-shengsuanyun.sh --key sk-xxxxx
#
#   # 方式3: 环境变量
#   SHENGSUANYUN_API_KEY=sk-xxxxx bash quick-setup-shengsuanyun.sh
#
#   # 方式4: 完整非交互式 onboard（首次安装推荐）
#   bash quick-setup-shengsuanyun.sh --key sk-xxxxx --onboard
#
# 武汉晴辰天下网络科技有限公司 | https://qingchencloud.com/
# ============================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

API_KEY=""
DO_ONBOARD=false
INSTALL_DAEMON=false

# 解析参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --key|-k)
            API_KEY="$2"
            shift 2
            ;;
        --onboard)
            DO_ONBOARD=true
            shift
            ;;
        --install-daemon)
            INSTALL_DAEMON=true
            shift
            ;;
        --help|-h)
            echo -e "${CYAN}OpenClaw 汉化版 - 胜算云快速配置${NC}"
            echo ""
            echo "用法:"
            echo "  bash quick-setup-shengsuanyun.sh                        # 交互式"
            echo "  bash quick-setup-shengsuanyun.sh --key sk-xxxxx         # 直接配置"
            echo "  bash quick-setup-shengsuanyun.sh --key sk-xxxxx --onboard  # 完整初始化"
            echo ""
            echo "选项:"
            echo "  --key, -k <key>      胜算云 API 密钥"
            echo "  --onboard            同时执行完整的非交互式 onboard 初始化"
            echo "  --install-daemon     安装后台守护进程"
            echo "  --help               显示帮助信息"
            echo ""
            echo "环境变量:"
            echo "  SHENGSUANYUN_API_KEY   如果未通过 --key 指定，将使用此环境变量"
            echo ""
            echo "获取 API 密钥: https://shengsuanyun.com"
            echo "OpenClaw 汉化版用户专属福利: 新注册送 10 元体验金！"
            exit 0
            ;;
        *)
            echo -e "${RED}未知参数: $1${NC}"
            echo "使用 --help 查看帮助"
            exit 1
            ;;
    esac
done

# 检查 openclaw 是否安装
if ! command -v openclaw &> /dev/null; then
    echo -e "${RED}❌ 未检测到 OpenClaw${NC}"
    echo ""
    echo "请先安装 OpenClaw 汉化版："
    echo "  curl -fsSL https://openclaw.qt.cool/install.sh | bash"
    exit 1
fi

# 获取 API Key
if [ -z "$API_KEY" ]; then
    # 尝试从环境变量获取
    API_KEY="${SHENGSUANYUN_API_KEY:-}"
fi

if [ -z "$API_KEY" ]; then
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                                                           ║"
    echo "║     🦞 胜算云 API 快速配置                                ║"
    echo "║        国内 API 聚合平台，支持多种 AI 模型               ║"
    echo "║                                                           ║"
    echo "║     获取密钥: https://shengsuanyun.com                    ║"
    echo "║     新用户福利: 注册送 10 元体验金！                      ║"
    echo "║                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    read -rp "请输入胜算云 API 密钥: " API_KEY
    
    if [ -z "$API_KEY" ]; then
        echo -e "${RED}❌ API 密钥不能为空${NC}"
        exit 1
    fi
fi

# 验证 Key 格式（基础检查）
if [ ${#API_KEY} -lt 8 ]; then
    echo -e "${RED}❌ API 密钥格式不正确（长度太短）${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔧 正在配置胜算云...${NC}"
echo ""

if [ "$DO_ONBOARD" = true ]; then
    # 完整非交互式 onboard
    echo -e "${CYAN}▶ 执行完整 onboard 初始化（胜算云模式）...${NC}"
    
    ONBOARD_ARGS=(
        --non-interactive
        --auth-choice shengsuanyun-api-key
        --shengsuanyun-api-key "$API_KEY"
        --accept-risk
    )
    
    if [ "$INSTALL_DAEMON" = true ]; then
        ONBOARD_ARGS+=(--install-daemon)
    fi
    
    openclaw onboard "${ONBOARD_ARGS[@]}"
    
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                           ║${NC}"
    echo -e "${GREEN}║     ✅ 胜算云配置完成！已完成完整初始化。                 ║${NC}"
    echo -e "${GREEN}║                                                           ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
else
    # 仅配置认证（已有 onboard 的用户切换到胜算云）
    echo -e "${CYAN}▶ 配置胜算云认证信息...${NC}"
    
    openclaw configure --section auth <<EOF
shengsuanyun-api-key
$API_KEY
EOF
    
    # 如果交互式 configure 不方便，回退到环境变量 + 重新 onboard
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠ 交互式配置失败，尝试非交互式方式...${NC}"
        export SHENGSUANYUN_API_KEY="$API_KEY"
        openclaw onboard --non-interactive --auth-choice shengsuanyun-api-key --accept-risk 2>/dev/null || true
    fi
    
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                           ║${NC}"
    echo -e "${GREEN}║     ✅ 胜算云认证配置完成！                               ║${NC}"
    echo -e "${GREEN}║                                                           ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
fi

echo ""
echo -e "${CYAN}🚀 快速开始：${NC}"
echo ""
echo "   openclaw                  # 启动 OpenClaw（使用胜算云模型）"
echo "   openclaw dashboard        # 打开 Dashboard 管理面板"
echo "   openclaw configure        # 修改配置"
echo ""
echo -e "${CYAN}💡 可用模型（通过胜算云）：${NC}"
echo ""
echo "   GPT-4.1 / GPT-4.1-nano / GPT-4.1-mini"
echo "   Claude Sonnet 4 / Claude Haiku"  
echo "   DeepSeek V3 / DeepSeek R1"
echo "   Qwen3 / GLM-4 / 通义千问"
echo "   更多模型请访问 https://shengsuanyun.com"
echo ""
