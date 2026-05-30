# colbymchenry/codegraph - 代码语义图谱索引工具

## 项目简介

**仓库地址**：https://github.com/colbymchenry/codegraph

`codegraph` 是一款**本地代码语义索引与知识图谱工具**，专为 AI 编程代理设计。它会提前解析项目代码，构建函数、类、变量、接口之间的调用关系、依赖链路、模块结构，生成轻量化本地索引库。

传统 AI 编码会反复执行「读取文件、搜索文件、遍历目录」等操作，消耗大量 Token 与时间；而 CodeGraph 直接基于预构建的语义图谱查询代码关系，大幅提升 AI 理解代码的速度、降低资源开销，同时全程数据本地化，保障代码隐私。

## 核心原理

1. **代码解析**：基于多语言解析器扫描项目源码，提取**符号（函数/类/常量）、调用关系、导入导出、路由、模块依赖**等信息。
2. **本地存储**：使用 SQLite 数据库持久化索引，不依赖云端服务，所有数据保存在本地项目目录。
3. **增量更新**：监听文件变动，仅对修改文件重新索引，避免全量扫描，保证索引实时性。
4. **MCP 协议对接**：兼容 MCP（Model Context Protocol），可无缝接入 Claude Code、Cursor 等主流 AI 编码工具。

## 核心优势

- ⚡ **速度提升**：减少文件遍历操作，AI 理解代码速度提升约 20%
- 💰 **成本降低**：Token 消耗平均减少 47%，工具调用次数减少 50%
- 🔒 **隐私安全**：100% 本地运行，代码不上传第三方服务器
- 🌐 **多语言支持**：兼容 20+ 主流编程语言与框架
- 🔄 **自动维护**：文件变更自动增量更新索引，无需手动重建

## 支持的语言与框架

### 主流编程语言

JavaScript、TypeScript、Python、Go、Rust、Java、Kotlin、Swift、C/C++、PHP、Ruby 等。

### 主流开发框架

- 后端：Express、FastAPI、Django、Gin、Spring Boot
- 移动端：Swift/Objective-C 混编、React Native 桥接代码
- 全栈/前端：Next.js、Vue 生态等

工具可自动识别框架路由、控制器、中间件等框架特有结构。

## 核心功能与工具详解

CodeGraph 对外提供一系列 MCP 工具，AI 可自动调用，也可手动执行查询，核心功能如下：

### 1. `codegraph_context`

**功能**：根据当前任务，自动筛选、聚合相关代码上下文，过滤无关文件。

**场景**：开发新功能、阅读陌生模块，快速拿到精准代码片段。

### 2. `codegraph_search`

**功能**：全局符号搜索，按函数名、类名、变量名、关键字精准检索代码符号。

**场景**：全局查找方法、定位同名符号、快速检索业务逻辑。

### 3. `codegraph_callers`

**功能**：查询**指定函数/方法被哪些代码调用**（上游调用方）。

**场景**：评估接口修改影响、梳理调用链路、废弃代码清理。

### 4. `codegraph_callees`

**功能**：查询**指定函数/方法内部调用了哪些其他代码**（下游依赖）。

**场景**：阅读复杂逻辑、拆解长函数、理解执行流程。

### 5. `codegraph_impact`

**功能**：影响范围分析，预判修改某段代码后，整个项目会受到影响的文件、模块、功能。

**场景**：代码重构、接口变更、版本迭代，规避隐性 Bug。

### 6. `codegraph_trace`

**功能**：全链路追踪，生成完整的代码调用栈、执行路径。

**场景**：复杂流程排查、性能分析、异常链路定位。

### 7. `codegraph_status`

**功能**：查看当前项目索引状态、已索引文件数量、语言类型、更新时间。

**场景**：排查索引异常、确认索引是否最新。

## 安装与部署教程

### 一、系统支持

支持 **macOS、Linux、Windows** 全平台。

### 二、安装命令

#### 1. macOS / Linux

打开终端，执行一键安装脚本：

```bash
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh
```

#### 2. Windows（PowerShell 管理员模式）

```powershell
irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex
```

### 三、项目初始化索引

1. 进入你的项目根目录

```bash
cd /path/to/your/project
```

2. 初始化并构建全量索引

```bash
codegraph init -i
```

3. 等待扫描完成，首次索引耗时取决于项目文件数量，大型项目建议耐心等待。

### 四、接入 AI 工具（MCP 配置）

CodeGraph 基于 MCP 协议工作，以 Claude Code / Cursor 为例：

1. 在 AI 工具的 MCP 配置文件中添加 CodeGraph 服务；
2. 重启 AI 客户端，工具会自动发现 `codegraph` 相关能力；
3. 后续 AI 分析代码、跳转引用、查询链路时，会自动调用本地索引。

### 五、常用手动命令

```bash
# 查看索引状态
codegraph status

# 手动触发增量更新索引
codegraph update

# 重建全量索引
codegraph rebuild

# 查看帮助文档
codegraph --help
```

## 典型使用场景

1. **接手大型老项目**：依靠 `codegraph_trace`、`codegraph_callers` 快速梳理代码架构与调用关系。
2. **代码重构**：使用 `codegraph_impact` 分析修改影响范围，保证重构安全。
3. **复杂 Bug 排查**：结合调用链路追踪，定位异常代码的完整执行路径。
4. **多语言混合项目**：支持跨语言代码关系解析，适配混合技术栈项目。
5. **隐私敏感项目**：纯本地运行，适合企业内部代码、私密项目使用。

## 与 AI 指令集（skills）组合工作流

两者搭配可形成完整的 AI 工程化开发体系：

1. **架构理解**：`skills` 的 `/zoom-out` + CodeGraph 图谱，全局掌握项目结构
2. **需求开发**：`skills` 规范开发流程 + CodeGraph 快速获取代码上下文
3. **问题排查**：`skills` `/diagnose` 标准化排错 + CodeGraph 追踪调用链路
4. **代码重构**：`skills` 架构优化指令 + CodeGraph 影响范围分析

## 注意事项

1. **首次索引**：百万行级别的超大型项目，首次构建索引耗时较长，建议在空闲时段执行。
2. **忽略文件**：工具会自动忽略 `node_modules`、`dist`、`build` 等编译目录，无需额外配置。
3. **版本更新**：定期执行更新命令，保证解析器与功能为最新版。
4. **离线使用**：安装完成后完全离线可用，无网络依赖。

## 总结

CodeGraph 是**大型代码库 + AI 编程**的强力搭档，它解决了 AI 读取、理解复杂代码效率低、开销大的核心问题。对于中大型项目、多模块项目、混合技术栈项目，能显著提升开发、排错、重构效率，同时兼顾代码隐私与安全。
