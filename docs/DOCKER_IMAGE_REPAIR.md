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

- Node：30/30，包括真实 npm 的 workspace 安装失败与 tgz 安装成功对照，
  以及新增的 7 项 nightly 标签原子更新回归测试。
- Python：7/7，检查错误默认命令、版本、健康检查、架构缺失和仓库内容不一致。
- Bash/Bats：23/23，包括 local-only 端口与启动失败、超时返回值。
- PowerShell Docker mock：3/3；部署脚本 AST 语法解析通过。
- actionlint：6 个相关工作流通过；修改的 Bash 片段与 Compose 配置解析通过。
- GHCR / Docker Hub：三个当前标签、两个架构的匿名 manifest/config 检查完成。

以上为本地检查，不代替修复后容器验收。本机 Docker Desktop 未运行，
本次未启动它，以免影响其他项目的已有容器。真实 Linux 双架构启动验证在 GitHub Actions 完成，见下节。
修复位于独立 worktree，原工作树的 33 项既有改动保持不变。

## 线上修复验收

经用户确认后，已提交推送并执行线上镜像重建。修复提交：

- `58bc9c3708bd498a658436899b36292b9fb07c71`：容器打包、双架构运行验证、部署脚本与双仓库发布门禁。
- `16a3cc5c0398c797b90135bc73f307253b961255`：保留发布后的 Docker Hub 部署文档同步。
- `4e8e8b75cc44d746259ec185ab1b902c99df9117`：nightly 标签原子更新及失败保留旧标签。

- [脚本 CI 34692244288](https://github.com/1186258278/OpenClawChineseTranslation/actions/runs/34692244288)：Bash、PowerShell、跨平台检查成功。
- [最终修复脚本 CI 34693919002](https://github.com/1186258278/OpenClawChineseTranslation/actions/runs/34693919002)：成功。Node 回归测试另在本地通过。
- [稳定版最终 Docker 重建 34692888151](https://github.com/1186258278/OpenClawChineseTranslation/actions/runs/34692888151)：成功；amd64/arm64 均通过真实启动、原生依赖、healthz、Dashboard、认证健康 RPC 和停止测试。
- GHCR 与 Docker Hub 的 `latest`、`2026.9.4-zh.1` 已更新，匿名读回相同的多架构 manifest 摘要：
  `sha256:cbfe7ea81345722f4e9c6114f6a4ae461db232dca1501bb733cef5903346b93e`。
- Docker Hub README 同步成功，公开页面接口读回包含 `healthz`、token 和 `--bind` 部署说明。
- [Nightly 重建 34692246979](https://github.com/1186258278/OpenClawChineseTranslation/actions/runs/34692246979)：Docker 的 amd64/arm64 构建和真实运行测试、双仓库发布与匿名读回全部成功。
  两个仓库的 `nightly`、`2026.9.4-nightly.202609121154` 摘要均为：
  `sha256:7237ec4cced3747cddf49d035bc41a414e768fbc276cf1909d6e66f40d8e7ff3`。
  该历史 run 的整体状态仍为 failure，原因是独立的 Git 标签发布步骤失败，见下节；不要把 Docker 成功写成整条 Nightly CI 成功。

上述稳定版与 nightly 每个标签都包含 `linux/amd64`、`linux/arm64`。
稳定版最终重建覆盖了首次修复运行 34692245187 的摘要；应以本节最终摘要为准。

稳定版只重建容器，不重复发布 npm；npm latest 保持 `2026.9.4-zh.1`。

## Nightly 标签恢复与后续防护

旧流程先删除远端 `nightly` 标签，再创建标签。本次删除成功，但重新创建时触发
GitHub App 对 workflow 文件的权限检查，留下了标签缺失和 Release 草稿状态。
这是 GitHub 发布元数据故障，不是已发布 Docker 镜像故障。

- 已将 `nightly` 标签恢复到此次通过容器测试的源提交 `58bc9c3708bd498a658436899b36292b9fb07c71`。
- 已恢复现有 [Nightly Release](https://github.com/1186258278/OpenClawChineseTranslation/releases/tag/nightly)
  （ID `387550682`），读回确认 `draft=false`、`prerelease=true`；说明与已验收 nightly 版本一致。
- 未清理历史 Release / 草稿，也未移动稳定版 Git tag。
- `scripts/update-nightly-tag.mjs` 使用 GitHub REST 单次 PATCH 更新已有标签，
  更新前检查提交顺序；权限拒绝时直接失败并保留已有标签，不再先删除。
- Nightly 工作流增加串行运行限制；显式保持 Release 非草稿。
- 新增 7 项回归测试已通过，更新后的脚本 CI 已通过。
  原子更新防护尚未在一次新的完整 Nightly 发布中验收；权限不足仍会报告失败，
  该防护不扩大 GitHub Token 权限。
