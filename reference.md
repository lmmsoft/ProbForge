下面给你一份可直接放 GitBook 的「开发者文档（Developer Docs）」中文版，按你指定的技术栈：Node.js / Next.js / Express / ethers.js / Solidity / MySQL / 钱包日志（Logging） 来组织，并且对接我们之前的 AMA（阶段0/1/2自适应市场架构）。

⸻

Meme 概率协议 Developer Docs

JS Fullstack + Solidity + MySQL + Wallet Logging

1. 技术栈与模块边界

1.1 技术栈
• Smart Contract: Solidity + Foundry（或 Hardhat）
• Backend API: Node.js + Express.js
• Frontend: Next.js（App Router 或 Pages Router 均可）
• 链交互: ethers.js
• 数据库: MySQL 8.x（建议配 Prisma 或 TypeORM）
• 索引/同步: 自建 Indexer（基于 RPC + Events + Cron），可选 Redis 做队列
• 钱包登录: SIWE（Sign-In with Ethereum）+ JWT / Session
• 日志: 应用日志（pino/winston）+ 审计日志（MySQL append-only）+ 可选 OpenTelemetry

1.2 系统模块

/contracts Solidity 合约
/apps/web Next.js 前端
/apps/api Express 后端
/packages/sdk ethers.js SDK（共用）
/packages/indexer 事件索引与链上同步
/packages/shared types, utils, constants

⸻

2. 关键业务概念（与 AMA 对齐）

2.1 市场阶段（Market Stage）
• Stage 0：AMM/Bonding Curve 冷启动
• Stage 1：Hybrid（Orderbook 开启，AMM fallback）
• Stage 2：Orderbook 主导（AMM 停止注入新流动性）

前端展示与路由、后端指标统计、合约状态都围绕 market.stage 运转。

2.2 资产与头寸
• Outcome 份额：YES / NO（或区间型 outcome）
• Fully Collateralized：所有仓位由抵押资产支撑（USDC/原生币等）

2.3 结算
• Optimistic Settlement + Challenge Window
• 结算结果来源：尽量链上可验证；否则走仲裁/挑战机制

⸻

3. 合约设计（Solidity）

3.1 合约清单
• MarketFactory.sol
• 创建市场（模板化参数）
• 收取创建保证金（anti-spam）
• 生成 Market（clone 或 new）
• MarketRegistry.sol
• 记录市场元信息（creator、模板、stage、状态）
• AmmEngine.sol（或内置在 Market）
• Stage0/Stage1 AMM 交易与定价
• OrderbookEngine.sol（可先 offchain orderbook + onchain settlement）
• Stage1/Stage2 订单撮合与结算入口
• MarketStateController.sol
• 市场阶段升级（按指标触发）
• 可做 onchain gate（真正的指标统计在 indexer，controller 只接收可验证摘要/证明）
• Settlement.sol
• 提交结算、挑战、最终执行
• Treasury.sol / FeeRouter.sol
• 手续费分账：MM/LP、Creator、Protocol、Insurance

3.2 关键事件（Indexer 必备）
• MarketCreated(market, creator, templateId, paramsHash)
• MarketStageUpgraded(market, from, to)
• Trade(market, trader, side, amountIn, sharesOut, price)
• OrderPlaced/OrderFilled/OrderCanceled(...)（如果 onchain orderbook）
• SettlementProposed(market, proposer, result, bond)
• SettlementChallenged(market, challenger, bond)
• SettlementFinalized(market, result)

3.3 安全与权限
• 升级权限：建议 不可升级 或 最小可升级（仅修复关键 bug）
• 必备：reentrancy guard、pausable（可选）、safe transfer（ERC20）
• 创建模板参数不可变：创建后锁定 paramsHash

⸻

4. Offchain Orderbook 推荐实现（更适合 Hackathon→生产进化）

现实里要做“高金融效率”，链下订单簿 + 链上结算是性价比最高的路线（类似很多 perp/perp-dex 的路径）。

4.1 订单签名（EIP-712）

订单结构：
• marketId
• side（YES/NO）
• price（以概率或 tick 表示）
• size
• expiry
• nonce
• maker

Maker 用 EIP-712 签名，撮合由后端/撮合器完成，最终走链上：
• fillOrder(order, makerSig, takerAmount, …)

4.2 防作恶
• nonce 防重放
• expiry 防陈旧订单
• 链上校验 makerSig + 余额/抵押约束

⸻

5. 数据库设计（MySQL）

5.1 表结构（核心）

markets
• id (pk)
• chain_id
• market_address
• creator_address
• template_id
• stage (0/1/2)
• status (active/resolving/finalized)
• params_hash
• created_at

market_metrics_daily
• market_id
• date
• volume
• unique_traders
• open_interest
• avg_spread
• dispute_rate
• index: (market_id, date)

trades
• id
• market_id
• tx_hash
• block_number
• trader
• side
• amount_in
• shares_out
• price
• timestamp

orders（offchain orderbook）
• id
• market_id
• maker
• side
• price
• size
• filled
• expiry
• nonce
• sig
• status (open/filled/canceled/expired)
• index: (market_id, status, price)

settlements
• market_id
• proposer
• proposed_result
• bond
• challenge_deadline
• final_result
• status

5.2 钱包日志（Wallet Logging / Audit Log）

wallet_audit_logs（强烈建议 append-only）
• id
• address
• action（LOGIN / SIGN / CREATE_MARKET / PLACE_ORDER / TRADE / PROPOSE_SETTLEMENT / CHALLENGE / WITHDRAW…）
• message（SIWE message / order hash / marketId 等）
• signature（如有）
• ip_hash（哈希化，避免存明文）
• user_agent_hash
• created_at

原则：业务日志（debug）和审计日志（可追溯）分离。审计日志只追加不更新。

⸻

6. 钱包登录（SIWE）与会话

6.1 登录流程

1.  前端请求 GET /auth/nonce
2.  前端构造 SIWE message（domain、uri、nonce、chainId、issuedAt）
3.  用户钱包签名
4.  前端 POST /auth/verify 提交 message + signature
5.  后端验证成功 → 签发 JWT（或 NextAuth session）

6.2 权限模型
• 基本：所有链上操作无需登录（permissionless）
• 登录用于：
• 保存用户偏好/订单簿撮合权限（offchain）
• 速率限制与风控（anti-spam）
• 记录审计日志（wallet_audit_logs）

⸻

7. 后端 API（Express）

7.1 Market
• GET /markets 列表（可按 stage、volume、status 排序）
• GET /markets/:id 详情（含 metrics、orderbook snapshot）
• POST /markets（可选：仅用于生成前端 metadata；链上创建由前端直发）
• POST /markets/:id/upgrade/check（返回是否满足升级条件，仅做提示）

7.2 Orderbook（链下）
• POST /orders 提交 signed order
• GET /orderbook/:marketId 返回 bids/asks
• POST /orders/:id/cancel（maker 签名撤单）
• POST /match/:marketId（撮合器内部接口）

7.3 Settlement
• GET /settlement/:marketId
• POST /settlement/:marketId/propose（提交提案信息 + 记录审计）
• POST /settlement/:marketId/challenge

7.4 Metrics
• GET /metrics/markets/:id/daily
• GET /metrics/leaderboard（Creator 声誉、市场质量评分）

⸻

8. Indexer（事件同步）

8.1 同步策略
• 订阅合约 events（WebSocket 优先；失败回退 HTTP polling）
• 按区块高度 checkpoint，写入 sync_state 表
• 同步事件→落库→更新 metrics

8.2 升级判断（Stage 0→1→2）
• 每日/每小时聚合 metrics
• 计算 rolling window（例如 24h、30d）
• 输出 upgrade_eligibility（给前端展示 + 给 controller 提供升级建议）
• 真正链上升级：
• MVP：由任何人调用 upgradeStage(market)，合约内部只检查“已满足某些链上可验证条件/标志”
• 生产：可引入可验证证明/多源签名/挑战机制（看你们时间）

⸻

9. 前端（Next.js）

9.1 页面信息架构
• / 市场列表（默认只突出 Top 流动性/热点）
• /market/[id]
• Stage 0：AMM 交易面板（滑点提示）
• Stage 1：Hybrid 面板（优先 orderbook，fallback AMM）
• Stage 2：Orderbook 专属（盘口、挂单、成交）
• /create 创建市场（模板化参数表单 + 链上发 tx）
• /profile 用户订单、成交、审计记录摘要（可选）

9.2 ethers.js 建议封装（packages/sdk）
• getMarkets()
• createMarket(templateId, params)
• swapAmm(market, side, amountIn, minSharesOut)
• placeOrderSigned(order)（offchain）
• fillOrderOnchain(order, sig, fillAmount)（onchain）

⸻

10. 运行与部署

10.1 环境变量（示例）

apps/api
• DATABASE_URL=mysql://...
• JWT_SECRET=...
• RPC_HTTP_URL=...
• RPC_WS_URL=...
• CHAIN_ID=...
• LOG_LEVEL=info

apps/web
• NEXT_PUBLIC_CHAIN_ID=...
• NEXT_PUBLIC_RPC_URL=...
• NEXT_PUBLIC_FACTORY_ADDRESS=...
• NEXT_PUBLIC_API_BASE=...

10.2 部署建议
• Web：Vercel / Docker
• API + Indexer：同一台或分开（Docker compose 最快）
• MySQL：云数据库或本地容器
• 监控：Sentry + Prometheus（可选）

⸻

11. MVP 开发顺序（最省时间的路径）
1.  合约：Factory + Market(AMM) + Settlement（先跑通 Stage0）
1.  Indexer：MarketCreated + Trade 同步入库
1.  前端：市场列表 + AMM 交易 + 创建市场
1.  加 Stage1：链下 orderbook（签名挂单）+ 链上 fill
1.  Metrics：rolling volume / users → 前端展示“可升级”
1.  Stage2：启用做市商激励（先按挂单深度评分在后端算，奖励可以先“积分化”）

⸻

12. 工程注意事项（评委爱看的点）
    • 可验证：所有关键状态以链上为准，DB 只是缓存/索引
    • Anti-spam：创建保证金 + UI 限流 + 审计日志
    • 阶段演进：同一 market 在不同 stage 前端自动切换交互
    • 安全：不可变参数、挑战窗口、签名防重放

⸻

如果你们要“直接开干”，我也可以继续给你补两份更落地的东西（你选一个我就按那个输出）：

1.  GitBook 目录结构 + 每页内容拆分（方便直接贴）
2.  MVP 代码骨架清单（monorepo 目录、关键文件、接口定义、合约接口 ABI 约定）
