# Docker 镜像修复与验收

## 已确认的故障

2026-09-12 检查 GHCR / Docker Hub 的 `latest`、`nightly`、`2026.9.4-zh.1`：
标签均可匿名读取，并包含 linux/amd64 与 linux/arm64，故不是标签整体丢失。

[稳定版构建 34588670102](https://github.com/1186258278/OpenClawChineseTranslation/actions/runs/34588670102)
在两个架构上均出现：

```text
npm error sh: 1: node-gyp-build: not found
npm error code EUNSUPPORTEDPROTOCOL
npm error Unsupported URL Type "workspace:": workspace:*
```

旧 Dockerfile 复制 CI 的 workspace/node_modules，再执行 `npm rebuild || true`
和 `npm install ... || true`，把失败当成成功；最后的目录全局安装只是链接，未修好依赖树。
CI artifact 直接传目录还会丢失隐藏的 pnpm store、符号链接或执行权限。

另外：默认 CMD 是裸 `openclaw`；Compose 使用未安装的 `wget`，并错误地把 shell
操作符放进 exec-form 数组；一键部署脚本启动超时仍继续显示成功。

## 修复结构

- 构建完成后 `npm pack --ignore-scripts`，不再运行 prepack 覆盖已注入的汉化面板。
- Docker 仅接收 tgz，在目标架构通过 npm 全局安装真正的发行包及运行时依赖。
- 安装错误直接失败，不禁用原生依赖的生命周期脚本。
- 默认启动 gateway，保留原数据卷路径、认证与来源校验。
- amd64 与 arm64 原生 runner 分别验证 CLI、原生模块、默认启动、healthz、
  Dashboard 静态资源、认证 RPC 和正常停止。
- 测试镜像先推 candidate 标签，两个架构均通过后才更新正式标签。
- 两个仓库的发布均为必需步骤；最后匿名读回 manifest/config，并比较摘要一致性。

## 镜像专用重建

`docker-rebuild.yml` 从已经发布的精确 npm 版本重建稳定版容器，
不发布 npm、不改 GitHub Release、不移动 Git tag；为避免降级，它只接受 npm latest 的版本。
nightly 通过现有 `nightly.yml` 的 `force_build=true` 重建。

提交推送并执行线上重建后，还必须检查两个架构的真实 smoke 与两个仓库的读回结果。
本地单测、语法检查和 registry manifest 可读，不等于容器已经运行通过。

## 用户升级

保留数据卷、认证配置与 `.env`。Compose 部署使用 `docker compose pull` 和
`docker compose up -d --force-recreate`，不要执行 `down -v`。
使用固定历史标签的部署不会随 latest 自动升级；本次修复不批量改写历史版本。

## 本次本地验收记录

- Node：23/23，包括真实 npm 的 workspace 安装失败与 tgz 安装成功对照。
- Python：7/7，检查错误默认命令、版本、健康检查、架构缺失和仓库内容不一致。
- Bash/Bats：23/23，包括 local-only 端口与启动失败、超时返回值。
- PowerShell Docker mock：3/3；部署脚本 AST 语法解析通过。
- actionlint：6 个相关工作流通过；修改的 Bash 片段与 Compose 配置解析通过。
- GHCR / Docker Hub：三个当前标签、两个架构的匿名 manifest/config 检查完成。

以上为本地及发布前检查，不是修复后容器验收。本机 Docker Desktop 未运行，
本次未启动它，以免影响其他项目的已有容器。真实 Linux 双架构启动验证待 GitHub Actions。
修复位于独立 worktree，原工作树的 33 项既有改动保持不变。
以上记录产生于发布前。用户现已确认提交推送与线上镜像重建；实际发布结果以 CI 和 registry 读回证据为准。
